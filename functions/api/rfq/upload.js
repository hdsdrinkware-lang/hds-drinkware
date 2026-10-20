import {
  MAX_REQUEST_BYTES,
  createObjectKey,
  createSignedUrl,
  errorResponse,
  jsonResponse,
  requiredBindingError,
  sanitizeFileName,
  validateSignedRequest,
  validateUploadFile,
  verifyRateLimit,
  verifyTurnstile,
} from "../../_shared/rfq.js";

const readBoundedBody = async (request) => {
  const declaredLength = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return { error: ["request_too_large", "The upload request is too large.", 413] };
  }
  if (!request.body || typeof request.body.getReader !== "function") {
    return { body: new Uint8Array(0) };
  }

  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = value instanceof Uint8Array ? value : new Uint8Array(value || 0);
      total += chunk.byteLength;
      if (total > MAX_REQUEST_BYTES) {
        try { await reader.cancel("request body too large"); } catch (error) { /* best effort */ }
        return { error: ["request_too_large", "The upload request is too large.", 413] };
      }
      chunks.push(chunk);
    }
  } catch (error) {
    return { error: ["invalid_request_body", "The upload request could not be read.", 400] };
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { body };
};

const parseForm = async (request) => {
  const contentType = request.headers.get("Content-Type") || "";
  if (!/^multipart\/form-data\s*;/i.test(contentType)) return { error: ["invalid_content_type", "Upload requests must use multipart/form-data.", 415] };
  const bounded = await readBoundedBody(request);
  if (bounded.error) return bounded;
  try {
    const replayRequest = new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body: bounded.body,
    });
    return { form: await replayRequest.formData() };
  } catch (error) {
    return { error: ["invalid_multipart", "The upload request could not be read.", 400] };
  }
};

const uploadedFileResponse = async (request, env, form) => {
  const fileResult = await validateUploadFile(form.get("file"));
  if (fileResult.error) return errorResponse(...fileResult.error);

  const { file, extension, rule } = fileResult;
  const key = createObjectKey(extension);
  const filename = sanitizeFileName(file.name, extension);
  try {
    await env.RFQ_UPLOADS.put(key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: "application/octet-stream",
        contentDisposition: `attachment; filename="${filename.replace(/"/g, "")}"`,
        cacheControl: "private, no-store, max-age=0",
      },
      customMetadata: {
        originalFileName: filename,
        contentType: rule.mime,
        size: String(file.size),
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return errorResponse("r2_write_failed", "The secure upload could not be stored. Please retry.", 502);
  }

  let downloadUrl;
  let cleanupUrl;
  try {
    downloadUrl = await createSignedUrl(request, key, env.RFQ_DOWNLOAD_SIGNING_SECRET, "download");
    cleanupUrl = await createSignedUrl(request, key, env.RFQ_DOWNLOAD_SIGNING_SECRET, "cleanup");
  } catch (error) {
    try { await env.RFQ_UPLOADS.delete(key); } catch (cleanupError) { /* best effort orphan cleanup */ }
    return errorResponse("download_signing_failed", "The secure upload could not be finalized. Please retry.", 502);
  }
  return jsonResponse({
    success: true,
    upload_status: "uploaded",
    filename,
    size: file.size,
    content_type: rule.mime,
    download_url: downloadUrl,
    cleanup_url: cleanupUrl,
    expires_in_seconds: 7 * 24 * 60 * 60,
  });
};

export async function onRequestPost({ request, env }) {
  const bindingError = requiredBindingError(env);
  if (bindingError) return errorResponse(...bindingError);

  const rateLimitResult = await verifyRateLimit(env, request);
  if (rateLimitResult === null) return errorResponse("rate_limit_unavailable", "Upload protection is temporarily unavailable. Please retry later.", 503);
  if (!rateLimitResult) return errorResponse("rate_limited", "Too many upload attempts. Please retry later.", 429);

  const parsed = await parseForm(request);
  if (parsed.error) return errorResponse(...parsed.error);
  const token = String(parsed.form.get("turnstile_token") || parsed.form.get("cf-turnstile-response") || "");

  if (!(await verifyTurnstile(env, request, token))) return errorResponse("turnstile_failed", "Upload verification failed. Please complete the verification and retry.", 403);

  return uploadedFileResponse(request, env, parsed.form);
}

export async function onRequestDelete({ request, env }) {
  if (!env?.RFQ_UPLOADS || typeof env.RFQ_UPLOADS.delete !== "function" || !env.RFQ_DOWNLOAD_SIGNING_SECRET) {
    return errorResponse("cleanup_not_configured", "Secure upload cleanup is not configured for this environment.", 503);
  }
  const signed = await validateSignedRequest(request, env.RFQ_DOWNLOAD_SIGNING_SECRET, "cleanup");
  if (!signed) return errorResponse("invalid_cleanup_signature", "The cleanup token is invalid or expired.", 403);
  try {
    await env.RFQ_UPLOADS.delete(signed.key);
    return jsonResponse({ success: true, cleanup_status: "deleted" });
  } catch (error) {
    return errorResponse("r2_delete_failed", "The temporary upload could not be cleaned up automatically.", 502);
  }
}
