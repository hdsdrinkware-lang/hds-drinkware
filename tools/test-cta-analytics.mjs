import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const scriptSource = fs.readFileSync(new URL("../script.js", import.meta.url), "utf8");

const runClick = (analyticsReady, link, location = {
  href: "https://www.hdsdrinkware.com/custom-40oz-tumbler-manufacturer/",
  origin: "https://www.hdsdrinkware.com",
  pathname: "/custom-40oz-tumbler-manufacturer/",
  search: "",
}) => {
  const listeners = new Map();
  const dataLayer = [];
  const ga4Calls = [];
  const context = {
    console,
    URL,
    URLSearchParams,
    document: {
      referrer: "",
      querySelector() { return null; },
      querySelectorAll() { return []; },
      createElement() { return { dataset: {}, classList: { add() {}, remove() {} } }; },
      addEventListener(type, listener) { listeners.set(type, listener); },
    },
    window: {
      dataLayer,
      hdsAnalyticsReady: analyticsReady,
      gtag(...args) { ga4Calls.push(args); },
      location,
      sessionStorage: { getItem() { return null; }, setItem() {} },
      matchMedia: () => ({ matches: false }),
      open() {},
    },
  };

  vm.runInNewContext(scriptSource, context, { filename: "script.js" });
  listeners.get("click")({ target: { closest() { return link; } } });
  return { context, dataLayer, ga4Calls };
};

const rfqLink = {
  dataset: { ctaType: "rfq", rfqIntent: "40oz_tumbler", rfqProduct: "40oz Handle Tumbler" },
  textContent: "Request a Quote",
  innerText: "Request a Quote",
  getAttribute(name) { return name === "href" ? "/contact/#rfq-form" : null; },
  setAttribute(name, value) { if (name === "href") this.href = value; },
  closest() { return null; },
};

const { dataLayer, ga4Calls } = runClick(true, rfqLink);
assert.equal(rfqLink.href, "/contact/?source_page=%2Fcustom-40oz-tumbler-manufacturer%2F&inquiry_type=40oz_tumbler&product=40oz+Handle+Tumbler#rfq-form");
assert.deepEqual(dataLayer.map(({ event }) => event), ["cta_click"]);
assert.deepEqual(ga4Calls.map(([, eventName]) => eventName), ["cta_click"]);
assert.deepEqual(JSON.parse(JSON.stringify(dataLayer[0])), {
  event: "cta_click",
  cta_type: "rfq",
  cta_label: "Request a Quote",
  page_path: "/custom-40oz-tumbler-manufacturer/",
  destination_type: "rfq",
  placement: "page_content",
});

const whatsappLink = {
  dataset: { ctaType: "whatsapp" },
  textContent: "WhatsApp Us",
  innerText: "WhatsApp Us",
  getAttribute(name) {
    if (name === "href") return "https://wa.me/8613994271614?text=Hello%20HDS";
    return null;
  },
  setAttribute(name, value) { if (name === "href") this.href = value; },
  closest() { return null; },
};
const whatsappResult = runClick(true, whatsappLink);
assert.deepEqual(whatsappResult.dataLayer.map(({ event }) => event), ["cta_click", "whatsapp_click"]);
assert.equal(whatsappResult.dataLayer[0].destination_type, "whatsapp");
assert.equal(JSON.stringify(whatsappResult.dataLayer).includes("Hello HDS"), false, "CTA analytics must not include destination message text");

const deniedResult = runClick(false, rfqLink);
assert.deepEqual(deniedResult.dataLayer, [], "CTA analytics must not enter dataLayer before consent");
assert.deepEqual(deniedResult.ga4Calls, [], "CTA analytics must not call GA4 before consent");
console.log("Validated consent-safe cta_click routing, normalized parameters, and CTA PII safety.");
