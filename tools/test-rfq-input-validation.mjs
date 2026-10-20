import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const contactHtml = fs.readFileSync(new URL("../contact/index.html", import.meta.url), "utf8");
const scriptSource = fs.readFileSync(new URL("../script.js", import.meta.url), "utf8");
const context = {
  console,
  URL,
  URLSearchParams,
  document: {
    referrer: "",
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
  },
  window: {
    dataLayer: [],
    hdsAnalyticsReady: false,
    location: { href: "https://www.hdsdrinkware.com/contact/", origin: "https://www.hdsdrinkware.com", pathname: "/contact/", search: "" },
    sessionStorage: { getItem() { return null; }, setItem() {} },
  },
};

vm.runInNewContext(scriptSource, context, { filename: "script.js" });
const validation = context.window.hdsRfqValidation;

assert.equal(validation.validateDesignLink(""), "");
assert.equal(validation.validateDesignLink("https://example.com/design.pdf"), "");
assert.match(validation.validateDesignLink("file:///C:/Users/buyer/design.pdf"), /Local computer file paths cannot be opened/);
assert.match(validation.validateDesignLink("C:\\Users\\buyer\\design.pdf"), /Local computer file paths cannot be opened/);
assert.match(validation.validateDesignLink("\\\\server\\share\\design.pdf"), /Local computer file paths cannot be opened/);
for (const value of [
  "http://example.com/design.pdf",
  "javascript:alert(1)",
  "data:text/plain,design",
  "not a URL",
  "https:example.com/design.pdf",
  "https://buyer:secret@example.com/design.pdf",
  "https://example.com/design file.pdf",
]) {
  assert.notEqual(validation.validateDesignLink(value), "", `unsafe or malformed design link must be rejected: ${value}`);
}
assert.equal(validation.validateDesignLink("HTTPS://example.com/design.pdf"), "");

assert.equal(/<input[^>]+type=["']file["']/i.test(contactHtml), false, "contact RFQ must not render a local file picker");
assert.equal(/turnstile_token|rfq-turnstile-widget|challenges\.cloudflare\.com\/turnstile/i.test(contactHtml), false, "contact RFQ must not render upload-only Turnstile controls");
for (const forbidden of ["uploadDesignFile", "cleanupUploadedFile", "selectedDesignFile", "uploadedDesign", "/api/rfq/", "design_download_url", "turnstile_token"]) {
  assert.equal(scriptSource.includes(forbidden), false, `script.js must not retain upload dependency: ${forbidden}`);
}
assert.equal(scriptSource.includes('fetch("https://api.web3forms.com/submit"'), true, "RFQ must retain Web3Forms submission");

console.log("Validated optional HTTPS design-link rules, local-path rejection, upload dependency removal, and Web3Forms retention.");
