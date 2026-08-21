import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const runtime = html.match(/<!-- HDS consent-first direct GA4 foundation; GTM remains inactive\. -->\s*<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(runtime, "consent runtime must be present in the shared homepage shell");

const runScenario = (initialChoice = "") => {
  const storage = new Map(initialChoice ? [["hds_analytics_consent", JSON.stringify({ choice: initialChoice, updatedAt: Date.now() })]] : []);
  const dataLayer = [];
  const appendedScripts = [];
  const listeners = new Map();
  const banner = { hidden: true, querySelector() { return { focus() {} }; } };
  const context = {
    console,
    Date,
    CustomEvent: class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    document: {
      head: { appendChild(script) { appendedScripts.push(script); } },
      createElement() { return { async: false, src: "" }; },
      addEventListener(type, listener) { listeners.set(type, listener); },
      dispatchEvent() {},
      querySelector(selector) { return selector === "#hds-consent-banner" ? banner : null; },
      querySelectorAll() { return []; },
    },
    window: {
      dataLayer,
      localStorage: { getItem(key) { return storage.get(key) || null; }, setItem(key, value) { storage.set(key, value); } },
    },
  };
  vm.runInNewContext(runtime, context, { filename: "consent-runtime.js" });
  return { context, dataLayer, appendedScripts, banner, listeners };
};

const fresh = runScenario();
assert.equal(fresh.context.window.hdsAnalyticsReady, false, "new visitors must begin with analytics blocked");
assert.equal(fresh.appendedScripts.length, 0, "new visitors must not load GA4 before a choice");
assert.equal(fresh.dataLayer[0][0], "consent");
assert.equal(fresh.dataLayer[0][1], "default");
for (const key of ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"]) {
  assert.equal(fresh.dataLayer[0][2][key], "denied", `default consent must deny ${key}`);
}
assert.equal(fresh.dataLayer[0][2].wait_for_update, 500, "default consent must include a short update wait");

fresh.context.window.hdsConsent.rejectOptional();
assert.equal(fresh.context.window.hdsAnalyticsReady, false, "reject must keep analytics blocked");
assert.equal(fresh.appendedScripts.length, 0, "reject must not load GA4");

const accepted = runScenario();
accepted.context.window.hdsConsent.acceptAnalytics();
assert.equal(accepted.context.window.hdsAnalyticsReady, true, "accept must enable direct GA4");
assert.equal(accepted.appendedScripts.length, 1, "accept must load one GA4 loader");
assert.equal(accepted.appendedScripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-2ST51EB9GY", "loader must use the approved measurement ID");
const configCalls = accepted.dataLayer.filter((entry) => entry?.[0] === "config");
assert.equal(configCalls.length, 1, "accept must configure GA4 once");
accepted.context.window.hdsConsent.acceptAnalytics();
assert.equal(accepted.appendedScripts.length, 1, "repeated accept must not duplicate the loader");
assert.equal(accepted.dataLayer.filter((entry) => entry?.[0] === "config").length, 1, "repeated accept must not duplicate config/page_view");
accepted.context.window.hdsConsent.rejectOptional();
assert.equal(accepted.context.window.hdsAnalyticsReady, false, "withdrawal must block future analytics");
assert.equal(accepted.context.window["ga-disable-G-2ST51EB9GY"], true, "withdrawal must disable the GA4 tag");

console.log("Validated consent foundation: default denied, reject blocked, accept loaded once, and withdrawal disabled future GA4.");
