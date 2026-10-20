const INTERNAL_PATH = "/__internal/rfq/upload/limit";
const PROTOCOL_VERSION = "v1";
const RATE_LIMIT_KEY_PATTERN = /^rfq-upload:[A-Za-z0-9_-]{43}$/;

const jsonResponse = (payload, status = 200) => new Response(
  JSON.stringify(payload),
  {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  },
);

const invalidRequest = () => jsonResponse({
  success: false,
  error: "invalid_internal_request",
}, 400);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (
      request.method !== "POST"
      || url.pathname !== INTERNAL_PATH
      || url.search
      || request.headers.get("Content-Type")?.toLowerCase() !== "application/json"
      || request.headers.get("X-HDS-RFQ-Limiter-Protocol") !== PROTOCOL_VERSION
    ) return invalidRequest();

    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      return invalidRequest();
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return invalidRequest();
    const keys = Object.keys(payload);
    if (keys.length !== 1 || keys[0] !== "key" || typeof payload.key !== "string" || !RATE_LIMIT_KEY_PATTERN.test(payload.key)) {
      return invalidRequest();
    }
    if (!env?.RFQ_UPLOAD_LIMITER || typeof env.RFQ_UPLOAD_LIMITER.limit !== "function") {
      return jsonResponse({ success: false, error: "rate_limit_binding_missing" }, 503);
    }

    try {
      const result = await env.RFQ_UPLOAD_LIMITER.limit({ key: payload.key });
      if (!result || typeof result.success !== "boolean") {
        return jsonResponse({ success: false, error: "rate_limit_malformed_response" }, 503);
      }
      return jsonResponse({ success: true, allowed: result.success }, result.success ? 200 : 429);
    } catch (error) {
      return jsonResponse({ success: false, error: "rate_limit_unavailable" }, 503);
    }
  },
};
