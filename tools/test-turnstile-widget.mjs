import assert from "node:assert/strict";
import fs from "node:fs";

const contactHtml = fs.readFileSync(new URL("../contact/index.html", import.meta.url), "utf8");
const scriptSource = fs.readFileSync(new URL("../script.js", import.meta.url), "utf8");

assert.match(
  contactHtml,
  /<script[^>]+src="https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit"[^>]+async[^>]+defer/i,
  "contact page must load the official Turnstile script with explicit rendering",
);
assert.match(contactHtml, /id="rfq-turnstile-widget"/, "contact page must include a dedicated RFQ widget container");
assert.match(contactHtml, /name="turnstile_token"/, "contact page must include the server-bound token field");
assert.match(scriptSource, /fetch\("\/api\/rfq\/turnstile-config"[^)]*cache: "no-store"/, "the widget must load its public key through the no-store runtime config route");
assert.match(scriptSource, /turnstile\.render\(widgetElement,/, "the widget must use explicit runtime rendering");
for (const callback of ["callback", "before-interactive-callback", "expired-callback", "error-callback", "timeout-callback"]) {
  assert.match(scriptSource, new RegExp(`['"]?${callback}['"]?\\s*:`), `Turnstile ${callback} callback must be wired`);
}
assert.match(scriptSource, /window\.hdsSetTurnstileToken\(token\)/, "successful challenges must update the shared token callback");
assert.match(scriptSource, /window\.hdsClearTurnstileToken\(\)/, "expired and failed challenges must clear stale tokens");
assert.match(scriptSource, /turnstile_token_missing/, "uploads without a token must fail before the upload request");
assert.equal(scriptSource.includes("TURNSTILE_SECRET_KEY"), false, "frontend code must not contain the Turnstile secret name or secret");

console.log("PASS: Turnstile widget markup, explicit rendering, runtime site-key loading, token callbacks, and fail-closed upload gating validated (static/mock coverage).");
