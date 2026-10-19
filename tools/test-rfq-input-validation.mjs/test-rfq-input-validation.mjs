import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

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
assert.match(validation.validateDesignLink("http://example.com/design.pdf"), /publicly accessible HTTPS/);

assert.equal(validation.validateDesignFile({ name: "artwork.pdf", type: "application/pdf", size: 1024 }), "");
assert.equal(validation.validateDesignFile({ name: "artwork.PNG", type: "image/png", size: 1024 }), "");
assert.match(validation.validateDesignFile({ name: "artwork.exe", type: "application/octet-stream", size: 1024 }), /PDF, JPG\/JPEG, PNG, or WEBP/);
assert.match(validation.validateDesignFile({ name: "artwork.pdf", type: "application/pdf", size: validation.designFileMaxBytes + 1 }), /smaller than 10 MB/);

assert.equal(validation.validateDesignFileSignature(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]), "pdf"), true);
assert.equal(validation.validateDesignFileSignature(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), "jpg"), true);
assert.equal(validation.validateDesignFileSignature(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]), "png"), false);

console.log("Validated RFQ HTTPS-link rejection, file type/size rules, and content signatures.");
