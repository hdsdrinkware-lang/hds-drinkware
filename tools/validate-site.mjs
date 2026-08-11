import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteOrigin = "https://www.hdsdrinkware.com";
const errors = [];

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  if ([".git", "node_modules", "CAD预览"].includes(entry.name)) return [];
  const absolute = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});

const htmlFiles = walk(root).filter((file) => file.endsWith("index.html") || file.endsWith("404.html"));
const indexablePages = [];
const canonicalOwners = new Map();

const match = (html, expression) => html.match(expression)?.[1]?.trim() || "";
const localPathFromUrl = (url) => {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean || clean === "/") return path.join(root, "index.html");
  const relative = clean.replace(/^\//, "");
  return path.join(root, relative.endsWith("/") ? relative : `${relative}/`, "index.html");
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const title = match(html, /<title>([\s\S]*?)<\/title>/i);
  const description = match(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)/i);
  const canonical = match(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)/i);
  const h1 = match(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);

  if (relative !== "404.html" && !noindex) {
    for (const [label, value] of Object.entries({ title, description, canonical, h1 })) {
      if (!value) errors.push(`${relative}: missing ${label}`);
    }
    if (!/<script\s+src=["'][^"']*script\.js(?:\?[^"']*)?["'][^>]*(?:defer)?/i.test(html)) {
      errors.push(`${relative}: missing shared conversion script`);
    }
    if (canonical) {
      if (canonicalOwners.has(canonical)) errors.push(`${relative}: duplicate canonical also used by ${canonicalOwners.get(canonical)}`);
      canonicalOwners.set(canonical, relative);
      indexablePages.push({ canonical, relative });
    }
  }

  for (const json of html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(json[1]);
    } catch (error) {
      errors.push(`${relative}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const image of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    const src = image[1];
    if (/^(?:https?:|data:)/i.test(src)) continue;
    const absolute = path.resolve(path.dirname(file), src.split("?")[0]);
    if (!fs.existsSync(absolute)) errors.push(`${relative}: missing image ${src}`);
  }

  for (const link of html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
    const href = link[1];
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) continue;
    const target = localPathFromUrl(href);
    if (!fs.existsSync(target)) errors.push(`${relative}: broken internal link ${href}`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((item) => item[1]);
const indexableUrls = new Set(indexablePages.map(({ canonical }) => canonical));

for (const url of sitemapUrls) {
  if (!url.startsWith(siteOrigin)) errors.push(`sitemap: external URL ${url}`);
  if (!indexableUrls.has(url)) errors.push(`sitemap: URL is not an indexable canonical ${url}`);
}
for (const url of indexableUrls) {
  if (!sitemapUrls.includes(url)) errors.push(`sitemap: missing indexable canonical ${url}`);
}

const caseStudyDirectory = path.join(root, "case-studies");
const caseStudyIndex = fs.readFileSync(path.join(caseStudyDirectory, "index.html"), "utf8");
if (!caseStudyIndex.includes("Representative Custom Drinkware Project Scenarios")) {
  errors.push("case-studies/index.html: collection must identify the pages as representative scenarios");
}
if (/How we helped|Read Full Case Study/i.test(caseStudyIndex)) {
  errors.push("case-studies/index.html: scenario collection contains completed-project language");
}

const scenarioFiles = fs.readdirSync(caseStudyDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(caseStudyDirectory, entry.name, "index.html"))
  .filter((file) => fs.existsSync(file));
const completedProjectLanguage = [
  /How we helped/i,
  /ordered a mixed batch/i,
  /The client wanted/i,
  /The client needed/i,
  /A marketing agency in Dubai needed/i,
  /As a newly launched online boutique/i,
];

for (const file of scenarioFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  if (!html.includes("Representative B2B Project Scenario")) {
    errors.push(`${relative}: missing representative scenario label`);
  }
  if (!/not a customer testimonial/i.test(html)) {
    errors.push(`${relative}: missing customer-testimonial disclaimer`);
  }
  if (!html.includes("Scenario Outcome and Acceptance Criteria")) {
    errors.push(`${relative}: missing scenario acceptance criteria`);
  }
  for (const expression of completedProjectLanguage) {
    if (expression.test(html)) errors.push(`${relative}: contains completed-project language ${expression}`);
  }
}

const homeHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const quoteForm = homeHtml.match(/<form\s+class=["']quote-form["'][\s\S]*?<\/form>/i)?.[0] || "";
const requiredQuoteFields = [...quoteForm.matchAll(/<(?:input|select|textarea)\b[^>]*\brequired\b/gi)];
if (requiredQuoteFields.length !== 4) {
  errors.push(`index.html: quote form must have exactly 4 required fields, found ${requiredQuoteFields.length}`);
}
if (/Download PDF/i.test(homeHtml)) {
  errors.push("index.html: catalog CTA promises an immediate PDF download");
}

const conversionScript = fs.readFileSync(path.join(root, "script.js"), "utf8");
for (const field of ["landing_page", "initial_referrer", "utm_source", "utm_medium", "utm_campaign", "page_url"]) {
  if (!conversionScript.includes(field)) errors.push(`script.js: missing lead attribution field ${field}`);
}
if (!conversionScript.includes("Source page:")) {
  errors.push("script.js: WhatsApp messages do not include the source page");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${indexablePages.length} indexable pages, ${sitemapUrls.length} sitemap URLs and ${htmlFiles.length} HTML files.`);
