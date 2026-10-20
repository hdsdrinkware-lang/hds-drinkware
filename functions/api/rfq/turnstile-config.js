import { errorResponse, jsonResponse } from "../../_shared/rfq.js";

export function onRequestGet({ env }) {
  const siteKey = String(env?.TURNSTILE_SITE_KEY || "").trim();
  if (!siteKey) return errorResponse("turnstile_site_key_missing", "Upload verification is not configured for this environment.", 503, { "Cache-Control": "no-store" });
  return jsonResponse({ success: true, site_key: siteKey }, 200, { "Cache-Control": "no-store" });
}
