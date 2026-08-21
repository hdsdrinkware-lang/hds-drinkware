import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const scriptSource = fs.readFileSync(new URL("../script.js", import.meta.url), "utf8");
const formListeners = new Map();
const hiddenInputs = new Map();
const sessionValues = new Map();
const testValues = new Map([
  ["name", "Regression Test Buyer"],
  ["email", "buyer@example.test"],
  ["whatsapp", "+1 202 555 0147"],
  ["country", "United States"],
  ["product", "Other custom drinkware"],
  ["quantity", "200"],
  ["message", "Private RFQ regression test message"],
]);

const statusDisplay = {
  classList: { add() {}, remove() {} },
  style: {},
  textContent: "",
};
const submitButton = { disabled: false };
const buyerNameControl = { name: "name", value: testValues.get("name") };
const form = {
  // Deliberately reproduce named-property clobbering from <input name="name">.
  name: buyerNameControl,
  dataset: {},
  getAttribute(attribute) {
    return attribute === "name" ? "drinkware-inquiry" : null;
  },
  addEventListener(type, listener) {
    formListeners.set(type, listener);
  },
  appendChild(element) {
    if (element.name) hiddenInputs.set(element.name, element);
  },
  querySelector(selector) {
    const hiddenName = selector.match(/^input\[type="hidden"\]\[name="([^"]+)"\]$/)?.[1];
    if (hiddenName) return hiddenInputs.get(hiddenName) || null;
    if (selector === 'button[type="submit"]') return submitButton;
    if (selector === ".form-status") return statusDisplay;
    return null;
  },
  checkValidity() { return true; },
  reportValidity() {},
  reset() {},
};

class TestFormData {
  constructor() {
    this.values = new Map(testValues);
    for (const [name, input] of hiddenInputs) this.values.set(name, input.value || "");
  }
  get(name) { return this.values.get(name) || ""; }
}

let fetchCount = 0;
const ga4Calls = [];
const context = {
  console,
  URL,
  URLSearchParams,
  FormData: TestFormData,
  fetch: async (url, options) => {
    fetchCount += 1;
    assert.equal(url, "https://api.web3forms.com/submit");
    assert.equal(options.method, "POST");
    assert.ok(options.body instanceof TestFormData);
    return { ok: true, json: async () => ({ success: true }) };
  },
  document: {
    referrer: "",
    querySelector(selector) {
      if (selector === ".quote-form") return form;
      if (selector === ".form-status") return statusDisplay;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === "form") return [form];
      return [];
    },
    createElement(tagName) {
      return tagName === "input" ? { type: "", name: "", value: "" } : statusDisplay;
    },
    addEventListener() {},
  },
};
context.window = {
  dataLayer: [],
  hdsAnalyticsReady: true,
  gtag(...args) { ga4Calls.push(args); },
  location: {
    href: "https://www.hdsdrinkware.com/contact/#rfq-form",
    origin: "https://www.hdsdrinkware.com",
    pathname: "/contact/",
    search: "",
  },
  sessionStorage: {
    getItem(key) { return sessionValues.get(key) || null; },
    setItem(key, value) { sessionValues.set(key, value); },
  },
  matchMedia: () => ({ matches: false }),
  open() {},
};

vm.runInNewContext(scriptSource, context, { filename: "script.js" });
assert.equal(form.name, buyerNameControl, "test fixture must preserve the clobbered form.name property");

formListeners.get("focusin")();
await formListeners.get("submit")({ preventDefault() {} });

assert.equal(fetchCount, 1, "valid RFQ must make one submission request");
assert.deepEqual(
  context.window.dataLayer.map(({ event }) => event),
  ["form_start", "rfq_submit", "form_submit_success"],
  "RFQ analytics events must fire in order",
);
assert.deepEqual(
  ga4Calls.map(([command, eventName]) => [command, eventName]),
  [["event", "form_start"], ["event", "rfq_submit"], ["event", "form_submit_success"], ["event", "generate_lead"]],
  "PII-safe RFQ events must preserve the neutral event model and add generate_lead only after confirmed success",
);
assert.equal(ga4Calls.filter(([, eventName]) => eventName === "generate_lead").length, 1, "one successful RFQ must emit exactly one generate_lead event");
assert.equal(
  statusDisplay.textContent,
  "Thank you. Your RFQ has been received. The HDS team will review the details and follow up using your preferred contact method.",
  "successful RFQ must use the HDS-specific success message",
);

const analyticsPayload = JSON.stringify(context.window.dataLayer);
const ga4Payload = JSON.stringify(ga4Calls);
for (const value of testValues.values()) {
  assert.equal(analyticsPayload.includes(value), false, `analytics payload must not contain form value: ${value}`);
  assert.equal(ga4Payload.includes(value), false, `GA4 payload must not contain form value: ${value}`);
}
assert.equal(analyticsPayload.includes("qualified_rfq"), false, "qualified_rfq must never be emitted by frontend code");
console.log("Validated RFQ form-name clobbering regression and analytics PII safety.");
