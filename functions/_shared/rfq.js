export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_REQUEST_BYTES = MAX_FILE_BYTES + 128 * 1024;
export const DOWNLOAD_TTL_SECONDS = 7 * 24 * 60 * 60;
export const RFQ_KEY_PREFIX = "rfq/";
export const RATE_LIMIT_SERVICE_PATH = "/__internal/rfq/upload/limit";

export const ALLOWED_FILE_TYPES = Object.freeze({
  pdf: { mime: "application/pdf", label: "PDF" },
  jpg: { mime: "image/jpeg", label: "JPG/JPEG" },
  jpeg: { mime: "image/jpeg", label: "JPG/JPEG" },
  png: { mime: "image/png", label: "PNG" },
  webp: { mime: "image/webp", label: "WEBP" },
});

const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };

export const jsonResponse = (payload, status = 200, headers = {}) => new Response(
  JSON.stringify(payload),
  { status, headers: { ...jsonHeaders, ...headers } },
);

export const errorResponse = (code, message, status, headers = {}) => jsonResponse({
  success: false,
  error: code,
  message,
}, status, headers);

export const getFileExtension = (name = "") => String(name).split(/[\\/]/).pop().split(".").pop()?.toLowerCase() || "";

export const sanitizeFileName = (name, extension) => {
  const source = String(name || "design").split(/[\\/]/).pop() || "design";
  const base = source
    .replace(/\.[^.]*$/, "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f"'<>:|?*]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 100) || "design";
  return `${base}.${extension}`;
};

export const hasSignature = (bytes, extension) => {
  const startsWith = (values, offset = 0) => values.every((value, index) => bytes[offset + index] === value);
  if (extension === "pdf") return startsWith([0x25, 0x50, 0x44, 0x46, 0x2d]);
  if (extension === "jpg" || extension === "jpeg") return startsWith([0xff, 0xd8, 0xff]);
  if (extension === "png") return startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (extension === "webp") return startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8);
  return false;
};

export const validateUploadFile = async (file) => {
  if (!file || typeof file.arrayBuffer !== "function") return { error: ["missing_file", "Please choose a design file.", 400] };
  if (!Number.isSafeInteger(file.size) || file.size <= 0 || file.size > MAX_FILE_BYTES) {
    return { error: ["invalid_file_size", "The design file must be between 1 byte and 10 MiB.", 413] };
  }
  const extension = getFileExtension(file.name);
  const rule = ALLOWED_FILE_TYPES[extension];
  if (!rule || file.type !== rule.mime) {
    return { error: ["invalid_file_type", "Only PDF, JPG/JPEG, PNG, and WEBP files are accepted.", 415] };
  }
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!hasSignature(bytes, extension)) {
    return { error: ["invalid_file_signature", "The file content does not match its declared type.", 415] };
  }
  return { file, extension, rule, bytes };
};

export const isSafeObjectKey = (key) => /^rfq\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(pdf|jpg|jpeg|png|webp)$/.test(String(key || ""))
  && !String(key).includes("..")
  && !String(key).includes("\\");

export const createObjectKey = (extension, now = new Date()) => {
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${RFQ_KEY_PREFIX}${year}/${month}/${crypto.randomUUID()}.${extension}`;
};

const textEncoder = new TextEncoder();

const base64UrlEncode = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const base64UrlDecode = (value) => {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

export const signValue = async (secret, value) => {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(String(secret)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return base64UrlEncode(new Uint8Array(await crypto.subtle.sign("HMAC", key, textEncoder.encode(value))));
};

export const verifyValue = async (secret, value, signature) => {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      textEncoder.encode(String(secret)),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    );
    return await crypto.subtle.verify("HMAC", key, base64UrlDecode(signature), textEncoder.encode(value));
  } catch (error) {
    return false;
  }
};

export const createSignedUrl = async (request, key, secret, purpose, ttl = DOWNLOAD_TTL_SECONDS) => {
  const expires = Math.floor(Date.now() / 1000) + ttl;
  const signature = await signValue(secret, `${purpose}\n${key}\n${expires}`);
  const url = new URL(request.url);
  url.pathname = purpose === "download" ? "/api/rfq/download" : "/api/rfq/upload";
  url.search = new URLSearchParams({ key, expires: String(expires), sig: signature }).toString();
  return url.toString();
};

export const validateSignedRequest = async (request, secret, purpose) => {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "";
  const expires = Number(url.searchParams.get("expires"));
  const signature = url.searchParams.get("sig") || "";
  const now = Math.floor(Date.now() / 1000);
  if (!isSafeObjectKey(key) || !Number.isSafeInteger(expires) || expires <= now || expires > now + DOWNLOAD_TTL_SECONDS + 60) return null;
  if (!(await verifyValue(secret, `${purpose}\n${key}\n${expires}`, signature))) return null;
  return { key, expires };
};

export const requiredBindingError = (env) => {
  if (!env?.RFQ_UPLOADS || typeof env.RFQ_UPLOADS.put !== "function" || typeof env.RFQ_UPLOADS.get !== "function" || typeof env.RFQ_UPLOADS.delete !== "function") {
    return ["r2_binding_missing", "Secure upload storage is not configured for this environment.", 503];
  }
  if (!env.RFQ_DOWNLOAD_SIGNING_SECRET) {
    return ["download_signing_secret_missing", "Secure download signing is not configured for this environment.", 503];
  }
  if (!env.TURNSTILE_SECRET_KEY) {
    return ["turnstile_secret_missing", "Upload verification is not configured for this environment.", 503];
  }
  if (!env.RFQ_UPLOAD_LIMITER_SERVICE || typeof env.RFQ_UPLOAD_LIMITER_SERVICE.fetch !== "function") {
    return ["rate_limit_service_missing", "Upload rate limiting is not configured for this environment.", 503];
  }
  return null;
};

export const getClientIp = (request) => request.headers.get("CF-Connecting-IP")
  || request.headers.get("X-Forwarded-For")?.split(",")[0].trim()
  || "unknown";

const normalizeHostname = (value) => String(value || "")
  .trim()
  .toLowerCase()
  .replace(/\.$/, "");

const isExactHostname = (value) => {
  if (!value || value.includes("*") || value.includes("/") || value.includes(":")) return false;
  return /^(?=.{1,253}$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i.test(value);
};

export const getTurnstileAllowedHostnames = (request, env) => {
  let requestHostname = "";
  try {
    requestHostname = normalizeHostname(new URL(request.url).hostname);
  } catch (error) {
    return new Set();
  }
  const configured = String(env?.TURNSTILE_ALLOWED_HOSTNAMES || env?.TURNSTILE_ALLOWED_HOSTNAME || "")
    .split(",")
    .map(normalizeHostname)
    .filter(isExactHostname);
  return new Set([requestHostname, ...configured].filter(isExactHostname));
};

export const rateLimitKey = async (request) => {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(getClientIp(request)));
  return `rfq-upload:${base64UrlEncode(new Uint8Array(digest))}`;
};

export const verifyRateLimit = async (env, request) => {
  if (!env?.RFQ_UPLOAD_LIMITER_SERVICE || typeof env.RFQ_UPLOAD_LIMITER_SERVICE.fetch !== "function") return null;
  try {
    const key = await rateLimitKey(request);
    const response = await env.RFQ_UPLOAD_LIMITER_SERVICE.fetch(new Request(
      `https://rfq-upload-limiter.internal${RATE_LIMIT_SERVICE_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-HDS-RFQ-Limiter-Protocol": "v1",
        },
        body: JSON.stringify({ key }),
      },
    ));
    if (!response || (response.status !== 200 && response.status !== 429)) return null;
    const result = await response.json();
    if (result?.success !== true || typeof result.allowed !== "boolean") return null;
    if (response.status === 200 && result.allowed !== true) return null;
    if (response.status === 429 && result.allowed !== false) return null;
    return result.allowed;
  } catch (error) {
    return null;
  }
};

export const verifyTurnstile = async (env, request, token) => {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
    const ip = getClientIp(request);
    if (ip !== "unknown") body.set("remoteip", ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    if (!response.ok) return false;
    const result = await response.json();
    if (result?.success !== true) return false;
    const hostname = normalizeHostname(result?.hostname);
    return Boolean(hostname && getTurnstileAllowedHostnames(request, env).has(hostname));
  } catch (error) {
    return false;
  }
};

export const attachmentHeaders = (filename, size) => {
  const safeName = sanitizeFileName(filename, getFileExtension(filename) || "bin");
  const headers = {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename="${safeName.replace(/"/g, "")}"`,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "private, no-store, max-age=0",
  };
  if (Number.isSafeInteger(size)) headers["Content-Length"] = String(size);
  return headers;
};
