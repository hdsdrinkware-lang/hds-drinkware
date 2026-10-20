import assert from "node:assert/strict";
import {
  MAX_FILE_BYTES,
  MAX_REQUEST_BYTES,
  createSignedUrl,
  signValue,
} from "../functions/_shared/rfq.js";
import { onRequestDelete, onRequestPost } from "../functions/api/rfq/upload.js";
import { onRequestGet } from "../functions/api/rfq/download.js";
import { onRequestGet as onRequestTurnstileConfig } from "../functions/api/rfq/turnstile-config.js";

const makeBytes = (signature, size = signature.length) => {
  const bytes = new Uint8Array(size);
  bytes.set(signature);
  return bytes;
};

const signatures = {
  pdf: makeBytes(new TextEncoder().encode("%PDF-1.7"), 64),
  jpg: makeBytes(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]), 64),
  jpeg: makeBytes(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]), 64),
  png: makeBytes(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 64),
  webp: (() => {
    const bytes = makeBytes(Uint8Array.from([0x52, 0x49, 0x46, 0x46]), 64);
    bytes.set(Uint8Array.from([0x57, 0x45, 0x42, 0x50]), 8);
    return bytes;
  })(),
};

class MockR2 {
  constructor({ failPut = false } = {}) {
    this.files = new Map();
    this.failPut = failPut;
  }

  async put(key, value, options) {
    if (this.failPut) throw new Error("synthetic R2 write failure");
    const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : new Uint8Array(await new Response(value).arrayBuffer());
    this.files.set(key, { bytes, customMetadata: options.customMetadata, size: bytes.byteLength });
  }

  async get(key) {
    const file = this.files.get(key);
    if (!file) return null;
    return {
      body: new Response(file.bytes).body,
      customMetadata: file.customMetadata,
      size: file.size,
    };
  }

  async delete(key) {
    this.files.delete(key);
  }
}

const r2 = new MockR2();
const env = {
  RFQ_UPLOADS: r2,
  RFQ_DOWNLOAD_SIGNING_SECRET: "synthetic-download-secret",
  TURNSTILE_SECRET_KEY: "synthetic-turnstile-secret",
  RFQ_UPLOAD_LIMITER: { limit: async () => ({ success: true }) },
};

const originalFetch = globalThis.fetch;
let siteverifyResult = { success: true, hostname: "preview.example" };
let siteverifyError = null;
globalThis.fetch = async (url, options) => {
  if (String(url).includes("challenges.cloudflare.com/turnstile/v0/siteverify")) {
    if (siteverifyError) throw siteverifyError;
    assert.ok(options?.body instanceof URLSearchParams, "Siteverify must receive URL-encoded form data");
    return Response.json(siteverifyResult);
  }
  return originalFetch(url);
};

const makeUploadRequest = (name, type, bytes, token = "synthetic-turnstile-token") => {
  const form = new FormData();
  form.append("file", new File([bytes], name, { type }));
  form.append("turnstile_token", token);
  return new Request("https://preview.example/api/rfq/upload", {
    method: "POST",
    headers: { "CF-Connecting-IP": "203.0.113.10" },
    body: form,
  });
};

const responseJson = async (response) => response.json();

const makeRawMultipartRequest = (fileBytes, extraHeaders = {}) => {
  const boundary = "----hds-rfq-test-boundary";
  const prefix = new TextEncoder().encode(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="oversized.pdf"\r\nContent-Type: application/pdf\r\n\r\n`);
  const suffix = new TextEncoder().encode(`\r\n--${boundary}--\r\n`);
  const body = new Uint8Array(prefix.byteLength + fileBytes.byteLength + suffix.byteLength);
  body.set(prefix, 0);
  body.set(fileBytes, prefix.byteLength);
  body.set(suffix, prefix.byteLength + fileBytes.byteLength);
  return new Request("https://preview.example/api/rfq/upload", {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "CF-Connecting-IP": "203.0.113.10",
      ...extraHeaders,
    },
    body,
  });
};

let configResponse = await onRequestTurnstileConfig({
  request: new Request("https://preview.example/api/rfq/turnstile-config"),
  env: { TURNSTILE_SITE_KEY: "synthetic-public-site-key", TURNSTILE_SECRET_KEY: "must-not-leak" },
});
assert.equal(configResponse.status, 200, "configured site key should be returned for the Preview widget");
assert.equal(configResponse.headers.get("Cache-Control"), "no-store");
const configPayload = await responseJson(configResponse);
assert.deepEqual(configPayload, { success: true, site_key: "synthetic-public-site-key" });
assert.equal(JSON.stringify(configPayload).includes("must-not-leak"), false, "Turnstile secrets must never be returned to the browser");

configResponse = await onRequestTurnstileConfig({
  request: new Request("https://preview.example/api/rfq/turnstile-config"),
  env: { TURNSTILE_SECRET_KEY: "must-not-leak" },
});
assert.equal(configResponse.status, 503, "missing public site key must fail closed");

for (const [extension, bytes] of Object.entries(signatures)) {
  const type = extension === "pdf" ? "application/pdf" : extension === "webp" ? "image/webp" : extension === "png" ? "image/png" : "image/jpeg";
  const response = await onRequestPost({
    request: makeUploadRequest(`buyer-artwork.${extension}`, type, bytes),
    env,
  });
  assert.equal(response.status, 200, `${extension} upload should pass with valid signature`);
  const result = await responseJson(response);
  assert.equal(result.upload_status, "uploaded");
  assert.match(result.download_url, /\/api\/rfq\/download\?/);
}

const tooLarge = new Uint8Array(MAX_FILE_BYTES + 1);
tooLarge.set(signatures.pdf);
let response = await onRequestPost({ request: makeUploadRequest("large.pdf", "application/pdf", tooLarge), env });
assert.equal(response.status, 413, "files over 10 MiB must be rejected");

const oversizedRequestBody = new Uint8Array(MAX_REQUEST_BYTES + 1);
response = await onRequestPost({ request: makeRawMultipartRequest(oversizedRequestBody), env });
assert.equal(response.status, 413, "request bodies over the hard cap must be rejected without Content-Length");

response = await onRequestPost({
  request: makeRawMultipartRequest(oversizedRequestBody, { "Content-Length": "1" }),
  env,
});
assert.equal(response.status, 413, "a dishonest smaller Content-Length must not bypass the body cap");

response = await onRequestPost({ request: makeUploadRequest("wrong.png", "application/pdf", signatures.png), env });
assert.equal(response.status, 415, "declared MIME mismatch must be rejected");

response = await onRequestPost({ request: makeUploadRequest("fake.pdf", "application/pdf", new TextEncoder().encode("MZ-not-a-pdf")), env });
assert.equal(response.status, 415, "executable content with a PDF extension must be rejected");

response = await onRequestPost({
  request: new Request("https://preview.example/api/rfq/upload", { method: "POST", body: "file=not-multipart" }),
  env,
});
assert.equal(response.status, 415, "non-multipart requests must be rejected");

siteverifyResult = { success: false, hostname: "preview.example" };
response = await onRequestPost({ request: makeUploadRequest("blocked.pdf", "application/pdf", signatures.pdf), env });
assert.equal(response.status, 403, "invalid Turnstile tokens must be rejected");

siteverifyResult = { success: true, hostname: "attacker.example" };
response = await onRequestPost({ request: makeUploadRequest("wrong-host.pdf", "application/pdf", signatures.pdf), env });
assert.equal(response.status, 403, "Turnstile hostnames that do not match the request must be rejected");

siteverifyResult = { success: true };
response = await onRequestPost({ request: makeUploadRequest("missing-host.pdf", "application/pdf", signatures.pdf), env });
assert.equal(response.status, 403, "a missing Siteverify hostname must be rejected");

siteverifyResult = { success: true, hostname: "preview.example" };
response = await onRequestPost({ request: makeUploadRequest("empty-token.pdf", "application/pdf", signatures.pdf, ""), env });
assert.equal(response.status, 403, "an empty Turnstile token must be rejected");

siteverifyError = new Error("synthetic Siteverify outage");
response = await onRequestPost({ request: makeUploadRequest("siteverify-error.pdf", "application/pdf", signatures.pdf), env });
assert.equal(response.status, 403, "Siteverify outages must fail closed");
siteverifyError = null;

let bodyRead = false;
const rateLimitedRequest = {
  url: "https://preview.example/api/rfq/upload",
  method: "POST",
  headers: new Headers({ "Content-Type": "multipart/form-data; boundary=unused", "CF-Connecting-IP": "203.0.113.11" }),
  get body() {
    bodyRead = true;
    throw new Error("body must not be read before rate limiting");
  },
};
response = await onRequestPost({
  request: rateLimitedRequest,
  env: { ...env, RFQ_UPLOAD_LIMITER: { limit: async () => ({ success: false }) } },
});
assert.equal(response.status, 429, "rate-limited requests must return 429");
assert.equal(bodyRead, false, "rate limiting must occur before multipart body parsing");

response = await onRequestPost({
  request: makeUploadRequest("limiter-outage.pdf", "application/pdf", signatures.pdf),
  env: { ...env, RFQ_UPLOAD_LIMITER: { limit: async () => { throw new Error("synthetic limiter outage"); } } },
});
assert.equal(response.status, 503, "rate-limit outages must fail closed");

response = await onRequestPost({ request: makeUploadRequest("missing-r2.pdf", "application/pdf", signatures.pdf), env: { ...env, RFQ_UPLOADS: undefined } });
assert.equal(response.status, 503, "missing R2 binding must block upload");

response = await onRequestPost({ request: makeUploadRequest("missing-limit.pdf", "application/pdf", signatures.pdf), env: { ...env, RFQ_UPLOAD_LIMITER: undefined } });
assert.equal(response.status, 503, "missing rate-limit binding must block upload");

response = await onRequestPost({ request: makeUploadRequest("r2-failure.pdf", "application/pdf", signatures.pdf), env: { ...env, RFQ_UPLOADS: new MockR2({ failPut: true }) } });
assert.equal(response.status, 502, "R2 write failures must be reported without a false upload success");
assert.equal((await responseJson(response)).download_url, undefined, "failed uploads must not generate a download URL");

const success = await onRequestPost({ request: makeUploadRequest("secure-design.pdf", "application/pdf", signatures.pdf), env });
const uploaded = await responseJson(success);
const download = await onRequestGet({ request: new Request(uploaded.download_url), env });
assert.equal(download.status, 200, "valid download signatures must work");
assert.equal(download.headers.get("Content-Type"), "application/octet-stream");
assert.match(download.headers.get("Content-Disposition"), /attachment/);
assert.equal(download.headers.get("X-Content-Type-Options"), "nosniff");
assert.match(download.headers.get("Cache-Control"), /private/);

const tamperedUrl = new URL(uploaded.download_url);
tamperedUrl.searchParams.set("sig", `${tamperedUrl.searchParams.get("sig")}x`);
response = await onRequestGet({ request: new Request(tamperedUrl), env });
assert.equal(response.status, 403, "tampered download signatures must fail");

const traversalUrl = new URL(uploaded.download_url);
traversalUrl.searchParams.set("key", "rfq/../secret.pdf");
response = await onRequestGet({ request: new Request(traversalUrl), env });
assert.equal(response.status, 403, "path traversal keys must fail");

const expiredUrl = new URL(uploaded.download_url);
const expiredKey = expiredUrl.searchParams.get("key");
const expired = Math.floor(Date.now() / 1000) - 1;
expiredUrl.searchParams.set("expires", String(expired));
expiredUrl.searchParams.set("sig", await signValue(env.RFQ_DOWNLOAD_SIGNING_SECRET, `download\n${expiredKey}\n${expired}`));
response = await onRequestGet({ request: new Request(expiredUrl), env });
assert.equal(response.status, 403, "expired download signatures must fail");

const cleanup = await onRequestDelete({ request: new Request(uploaded.cleanup_url, { method: "DELETE" }), env });
assert.equal(cleanup.status, 200, "signed cleanup should work");
assert.equal((await responseJson(cleanup)).cleanup_status, "deleted");

console.log("PASS: RFQ upload/download functions validated with synthetic R2, Turnstile, rate-limit, signature, MIME, size, and failure cases.");
