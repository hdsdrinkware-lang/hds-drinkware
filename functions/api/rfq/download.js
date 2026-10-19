import {
  attachmentHeaders,
  errorResponse,
  validateSignedRequest,
} from "../../_shared/rfq.js";

export async function onRequestGet({ request, env }) {
  if (!env?.RFQ_UPLOADS || typeof env.RFQ_UPLOADS.get !== "function" || !env.RFQ_DOWNLOAD_SIGNING_SECRET) {
    return errorResponse("download_not_configured", "Secure download is not configured for this environment.", 503);
  }
  const signed = await validateSignedRequest(request, env.RFQ_DOWNLOAD_SIGNING_SECRET, "download");
  if (!signed) return errorResponse("invalid_download_signature", "The download link is invalid or expired.", 403);

  let object;
  try {
    object = await env.RFQ_UPLOADS.get(signed.key);
  } catch (error) {
    return errorResponse("r2_read_failed", "The secure download could not be read.", 502);
  }
  if (!object?.body) return errorResponse("file_not_found", "The requested file is no longer available.", 404);

  const metadata = object.customMetadata || {};
  const filename = metadata.originalFileName || "design.bin";
  return new Response(object.body, {
    status: 200,
    headers: attachmentHeaders(filename, Number(metadata.size) || object.size),
  });
}
