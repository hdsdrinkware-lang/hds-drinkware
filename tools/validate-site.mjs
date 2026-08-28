import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "./site-config.mjs";
import "./test-form-analytics.mjs";
import "./test-consent-foundation.mjs";
import "./test-cta-analytics.mjs";

const root = process.cwd();
const siteOrigin = siteConfig.origin;
const baselinePath = path.join(root, "tools", "seo-regression-baseline.json");
const businessFactsPath = path.join(root, "tools", "business-facts.json");
const evidenceRegistryPath = path.join(root, "tools", "evidence-registry.json");
const customerProjectPath = path.join(root, "tools", "customer-projects", "us-40oz-102-active.json");
const writeBaseline = process.argv.includes("--write-baseline");
const errors = [];
const warnings = [];
const ignoredDirectories = new Set([
  ".git", ".codex-deploy", "node_modules", "CAD预览",
  "Accio-Foreign-Trade-Lead-Engine", "foreign-trade-lead-engine",
]);
const businessFacts = JSON.parse(fs.readFileSync(businessFactsPath, "utf8"));
const evidenceRegistry = JSON.parse(fs.readFileSync(evidenceRegistryPath, "utf8"));
const activeCustomerProject = JSON.parse(fs.readFileSync(customerProjectPath, "utf8"));
const evidenceById = new Map(evidenceRegistry.evidence.map((item) => [item.evidenceId, item]));
const publicFactStatuses = new Set(["verified", "qualified", "not-applicable"]);
for (const [key, fact] of Object.entries(businessFacts.facts || {})) {
  if (fact.public && !publicFactStatuses.has(fact.status)) errors.push(`tools/business-facts.json: public fact ${key} has non-publication status ${fact.status}`);
  if (!fact.public && publicFactStatuses.has(fact.status) && fact.status !== "not-applicable") errors.push(`tools/business-facts.json: non-public fact ${key} uses public status ${fact.status}`);
  for (const evidenceId of fact.evidenceIds || []) if (!evidenceById.has(evidenceId)) errors.push(`tools/business-facts.json: ${key} references missing evidence ${evidenceId}`);
}
if (activeCustomerProject.status !== "active" || activeCustomerProject.publicPage !== false || activeCustomerProject.publicationPermission !== false) {
  errors.push("tools/customer-projects/us-40oz-102-active.json: active project must remain non-public and active");
}
for (const evidenceId of activeCustomerProject.evidenceIds || []) if (!evidenceById.has(evidenceId)) errors.push(`active customer project references missing evidence ${evidenceId}`);

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  if (ignoredDirectories.has(entry.name)) return [];
  const absolute = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});
const htmlFiles = walk(root).filter((file) => file.endsWith("index.html") || file.endsWith("404.html"));
const match = (html, expression) => html.match(expression)?.[1]?.trim() || "";
const normalizeText = (value) => value.replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"")
  .replace(/&#(?:39|x27);/gi, "'").replace(/\s+/g, " ").trim();
const fingerprint = (value) => crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
const routeFromFile = (file) => {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return "/";
  if (relative === "404.html") return "/404.html";
  return `/${relative.replace(/index\.html$/, "")}`;
};
const localPathFromPathname = (pathname) => {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, "");
  if (!clean) return path.join(root, "index.html");
  if (path.extname(clean)) return path.join(root, clean);
  return path.join(root, clean.endsWith("/") ? clean : `${clean}/`, "index.html");
};
const hasFragmentTarget = (html, fragment) => {
  if (!fragment) return true;
  const decoded = decodeURIComponent(fragment);
  const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:id|name)=["']${escaped}["']`, "i").test(html);
};
const schemaContainsType = (value, type) => {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some((item) => schemaContainsType(item, type));
  const schemaType = value["@type"];
  if (schemaType === type || (Array.isArray(schemaType) && schemaType.includes(type))) return true;
  return Object.values(value).some((item) => schemaContainsType(item, type));
};
const topLevelSchemaNodes = (schemas) => schemas.flatMap((schema) => Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema]);
const schemaNodeHasType = (schema, type) => schema?.["@type"] === type || (Array.isArray(schema?.["@type"]) && schema["@type"].includes(type));

const pages = [];
const titleOwners = new Map();
const descriptionOwners = new Map();
const canonicalOwners = new Map();
const assetVersions = { styles: new Map(), script: new Map() };
const headingDebt = {};
const paragraphOccurrences = new Map();
const numericClaimOccurrences = new Map();
const excludedCommercialRoutes = new Set([
  "/about-hds-drinkware/", "/factory-supply-chain/", "/quality-control/",
  "/packaging-solutions/", "/shipping-support/", "/case-studies/", "/contact/", "/faq/",
]);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const route = routeFromFile(file);
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const gtmLoaderCount = [...html.matchAll(/www\.googletagmanager\.com\/(?:gtm\.js|ns\.html)/g)].length;
  const ga4LoaderCount = html.includes('loader.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId)') ? 1 : 0;
  const ga4ConfigCount = html.includes('window.gtag("config", measurementId, { send_page_view: true })') ? 1 : 0;
  const explicitPageViewCount = [...html.matchAll(/gtag\(['"]event['"],['"]page_view['"]/g)].length;
  if (siteConfig.analytics.mode !== "direct-ga4-temporary") errors.push("site-config: unsupported production analytics mode");
  if (gtmLoaderCount !== 0) errors.push(`${relative}: GTM must not load while the published container is empty`);
  if (ga4LoaderCount !== 1 || ga4ConfigCount !== 1) errors.push(`${relative}: expected exactly one consent-gated direct GA4 loader and config command`);
  if (explicitPageViewCount !== 0) errors.push(`${relative}: direct GA4 config already sends page_view; explicit page_view would duplicate it`);
  if (!html.includes('gtag("consent", "default"')) errors.push(`${relative}: missing default consent initialization`);
  if (!html.includes('analytics_storage: "denied"') || !html.includes('ad_storage: "denied"')) errors.push(`${relative}: default consent must deny analytics and advertising storage`);
  if (!html.includes('id="hds-consent-banner"') || !html.includes('data-consent-accept') || !html.includes('data-consent-reject')) errors.push(`${relative}: missing accessible consent banner controls`);
  if (!html.includes('data-consent-settings') || !html.includes(`${siteOrigin}/privacy-policy/`)) errors.push(`${relative}: missing persistent Cookie Settings or privacy link`);
  const title = match(html, /<title>([\s\S]*?)<\/title>/i);
  const description = match(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)/i);
  const canonical = match(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)/i);
  const main = match(html, /<main(?:\s[^>]*)?>([\s\S]*?)<\/main>/i);
  const headings = [...main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((item) => ({ level: Number(item[1]), text: normalizeText(item[2]) }));
  const h1Count = headings.filter(({ level }) => level === 1).length;
  if (h1Count > 1) errors.push(`${relative}: multiple H1 elements (${h1Count})`);
  for (let index = 1; index < headings.length; index += 1) {
    if (headings[index].level > headings[index - 1].level + 1) {
      errors.push(`${relative}: heading hierarchy skips from H${headings[index - 1].level} to H${headings[index].level} before “${headings[index].text}”`);
    }
  }
  const h2Count = headings.filter(({ level }) => level === 2).length;
  const h3Count = headings.filter(({ level }) => level === 3).length;
  if (h2Count > 18 || h3Count > 20 || h2Count + h3Count > 30) {
    headingDebt[relative] = { h2: h2Count, h3: h3Count, total: h2Count + h3Count };
  }

  const parsedSchemas = [];
  for (const json of html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)) {
    try { parsedSchemas.push(JSON.parse(json[1])); }
    catch (error) { errors.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }

  if (relative !== "404.html" && !noindex) {
    for (const [label, value] of Object.entries({ title, description, canonical })) {
      if (!value) errors.push(`${relative}: missing ${label}`);
    }
    if (h1Count !== 1) errors.push(`${relative}: expected exactly one H1, found ${h1Count}`);
    if (!/<script\s+src=["'][^"']*script\.js(?:\?[^"']*)?["'][^>]*(?:defer)?/i.test(html)) {
      errors.push(`${relative}: missing shared conversion script`);
    }
    const expectedCanonical = `${siteOrigin}${route}`;
    if (canonical && canonical !== expectedCanonical) {
      errors.push(`${relative}: canonical mismatch; expected ${expectedCanonical}, found ${canonical}`);
    }
    const normalizedTitle = normalizeText(title).toLowerCase();
    const normalizedDescription = normalizeText(description).toLowerCase();
    if (titleOwners.has(normalizedTitle)) errors.push(`${relative}: duplicate title also used by ${titleOwners.get(normalizedTitle)}`);
    else titleOwners.set(normalizedTitle, relative);
    if (descriptionOwners.has(normalizedDescription)) errors.push(`${relative}: duplicate meta description also used by ${descriptionOwners.get(normalizedDescription)}`);
    else descriptionOwners.set(normalizedDescription, relative);
    if (canonicalOwners.has(canonical)) errors.push(`${relative}: duplicate canonical also used by ${canonicalOwners.get(canonical)}`);
    else canonicalOwners.set(canonical, relative);
    const schemaNodes = topLevelSchemaNodes(parsedSchemas);
    const organizationNodes = schemaNodes.filter((schema) => schemaNodeHasType(schema, "Organization"));
    const websiteNodes = schemaNodes.filter((schema) => schemaNodeHasType(schema, "WebSite"));
    if (route === "/") {
      if (organizationNodes.length !== 1) errors.push(`${relative}: homepage must contain exactly one Organization entity, found ${organizationNodes.length}`);
      if (websiteNodes.length !== 1) errors.push(`${relative}: homepage must contain exactly one WebSite entity, found ${websiteNodes.length}`);
    } else {
      if (organizationNodes.length !== 0) errors.push(`${relative}: Organization entity must be defined on homepage only`);
      if (websiteNodes.length !== 0) errors.push(`${relative}: WebSite entity must be defined on homepage only`);
    }
    if (schemaNodes.some((schema) => schemaContainsType(schema, "FAQPage"))) errors.push(`${relative}: FAQPage schema is not permitted in Phase 4C`);
    const breadcrumbNodes = schemaNodes.filter((schema) => schemaNodeHasType(schema, "BreadcrumbList"));
    if (route === "/" && breadcrumbNodes.length !== 0) errors.push(`${relative}: homepage must not contain BreadcrumbList schema`);
    if (route !== "/" && breadcrumbNodes.length !== 1) errors.push(`${relative}: expected one BreadcrumbList schema, found ${breadcrumbNodes.length}`);
    const isArticle = route.startsWith("/sourcing-guides/") && route !== "/sourcing-guides/";
    const articleNodes = schemaNodes.filter((schema) => schemaNodeHasType(schema, "Article"));
    if (isArticle && articleNodes.length !== 1) errors.push(`${relative}: expected one Article schema for sourcing guide, found ${articleNodes.length}`);
    if (!isArticle && articleNodes.length !== 0) errors.push(`${relative}: Article schema is only permitted on sourcing guide detail pages`);
    pages.push({ canonical, file, html, main, relative, route });
  }

  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = image[0];
    const src = match(tag, /\bsrc=["']([^"']+)/i);
    if (!/\bwidth=["']\d+["']/i.test(tag) || !/\bheight=["']\d+["']/i.test(tag)) errors.push(`${relative}: image missing numeric width/height (${src || "unknown source"})`);
    if (!src || /^(?:https?:|data:)/i.test(src)) continue;
    const absolute = path.resolve(path.dirname(file), src.split("?")[0]);
    if (!fs.existsSync(absolute)) errors.push(`${relative}: missing image ${src}`);
  }
  for (const figure of html.matchAll(/<figure\b[^>]*\bdata-evidence-id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/figure>/gi)) {
    const evidenceId = figure[1];
    const evidence = evidenceById.get(evidenceId);
    if (!evidence) { errors.push(`${relative}: public figure references missing evidence ${evidenceId}`); continue; }
    if (!String(evidence.publicUseStatus).startsWith("approved")) errors.push(`${relative}: evidence ${evidenceId} is not approved for public use`);
    if (!/<source\b[^>]+type=["']image\/avif["']/i.test(figure[2]) || !/<source\b[^>]+type=["']image\/webp["']/i.test(figure[2])) errors.push(`${relative}: evidence ${evidenceId} is missing AVIF/WebP sources`);
  }

  for (const css of html.matchAll(/(?:href|src)=["'][^"']*styles\.css(?:\?v=([^"'&]+))?/gi)) {
    const version = css[1] || "(missing)";
    if (!assetVersions.styles.has(version)) assetVersions.styles.set(version, []);
    assetVersions.styles.get(version).push(relative);
  }
  for (const script of html.matchAll(/src=["'][^"']*script\.js(?:\?v=([^"'&]+))?/gi)) {
    const version = script[1] || "(missing)";
    if (!assetVersions.script.has(version)) assetVersions.script.set(version, []);
    assetVersions.script.get(version).push(relative);
  }

  const isCommercialLanding = route.split("/").filter(Boolean).length === 1 && !excludedCommercialRoutes.has(route) && !noindex;
  if (isCommercialLanding) {
    for (const paragraph of main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
      const text = normalizeText(paragraph[1]);
      if (text.length < 120) continue;
      const key = fingerprint(text.toLowerCase());
      const record = paragraphOccurrences.get(key) || { text, pages: new Set() };
      record.pages.add(relative);
      paragraphOccurrences.set(key, record);
    }
  }
  const claimText = noindex ? "" : normalizeText(main.replace(/<aside\b[\s\S]*?<\/aside>/gi, " "));
  const isScopedBusinessPage = !noindex && (route === "/" || (route.split("/").filter(Boolean).length === 1 && route !== "/case-studies/"));
  if (isScopedBusinessPage) {
    const prohibitedBusinessClaims = [
      [/within\s+12\s+hours/i, "absolute 12-hour response promise"],
      [/\ball products\s+(?:start|starting)\s+from\s+200\s+(?:pcs|pieces)/i, "universal 200-piece MOQ"],
      [/\bMOQ\s*:\s*200\s+(?:pcs|pieces)\b/i, "unqualified 200-piece MOQ"],
      [/\bMOQ starts from 200\s+(?:pcs|pieces)\b/i, "unqualified MOQ starts-from claim"],
      [/\b(?:20[–-]35|30[–-]35)\s+days\b/i, "universal production lead-time promise"],
      [/\b(?:FDA|LFGB|SGS|ISO)\s+Certified\b/i, "unapproved company-level certification claim"],
      [/\b(?:HDS|we)\s+(?:owns?|operates?)\s+(?:every|all|the)\s+(?:factory|production line)/i, "unapproved factory-ownership claim"],
      [/\bFOB\s+Yiwu\b/i, "unsupported FOB Yiwu term"],
    ];
    for (const [pattern, label] of prohibitedBusinessClaims) if (pattern.test(claimText)) errors.push(`${relative}: ${label}`);
  }
  const claimPattern = /[^.!?]{0,110}\b(?:\d[\d,.]*\s*(?:%|pcs|pieces|units|days?|hours?|years?|orders?|containers?|m²|sqm)|(?:within|in)\s+\d+\s+(?:days?|hours?))\b[^.!?]{0,110}[.!?]?/gi;
  for (const claim of claimText.matchAll(claimPattern)) {
    const text = normalizeText(claim[0]);
    if (!text) continue;
    if (/\baround\s+(?:200|500)\s+(?:pcs|pieces)\b/i.test(text) || /\b7[–-]10\s+days\b/i.test(text)) continue;
    const key = fingerprint(text.toLowerCase());
    const record = numericClaimOccurrences.get(key) || { text, pages: new Set() };
    record.pages.add(relative);
    numericClaimOccurrences.set(key, record);
  }
}

for (const [kind, expectedVersion] of Object.entries(siteConfig.assetVersions)) {
  for (const [version, files] of assetVersions[kind]) {
    if (version !== expectedVersion) errors.push(`${kind} asset version ${version} used by ${files.length} file(s); expected ${expectedVersion}`);
  }
}

const inboundLinks = new Map(pages.map(({ canonical }) => [canonical, new Set()]));
for (const page of pages) {
  for (const link of page.html.matchAll(/<a\b[^>]+href=["']([^"']+)["']/gi)) {
    const href = link[1].trim();
    if (!href || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let url;
    try { url = new URL(href, page.canonical); }
    catch { errors.push(`${page.relative}: invalid link ${href}`); continue; }
    if (url.origin !== siteOrigin) continue;
    const target = localPathFromPathname(url.pathname);
    if (!fs.existsSync(target)) { errors.push(`${page.relative}: broken internal link ${href}`); continue; }
    if (url.hash && target.endsWith(".html")) {
      const targetHtml = fs.readFileSync(target, "utf8");
      if (!hasFragmentTarget(targetHtml, url.hash.slice(1))) errors.push(`${page.relative}: broken fragment link ${href}`);
    }
    const targetUrl = `${siteOrigin}${url.pathname.endsWith("/") || path.extname(url.pathname) ? url.pathname : `${url.pathname}/`}`;
    if (inboundLinks.has(targetUrl) && targetUrl !== page.canonical) inboundLinks.get(targetUrl).add(page.canonical);
  }
}
for (const [url, sources] of inboundLinks) if (url !== `${siteOrigin}/` && sources.size === 0) errors.push(`orphan page: ${url}`);

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((item) => item[1]);
const indexableUrls = new Set(pages.map(({ canonical }) => canonical));
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push("sitemap: duplicate URLs");
for (const url of sitemapUrls) {
  if (!url.startsWith(siteOrigin)) errors.push(`sitemap: external URL ${url}`);
  if (!indexableUrls.has(url)) errors.push(`sitemap: URL is not an indexable canonical ${url}`);
}
for (const url of indexableUrls) if (!sitemapUrls.includes(url)) errors.push(`sitemap: missing indexable canonical ${url}`);
if (sitemapUrls.some((url) => url.includes("/customer-projects/"))) errors.push("sitemap: active customer project must not be published");

const publicTextFiles = ["index.html", "llms.txt", "llms-full.txt", ...pages.map(({ relative }) => relative)];
for (const relative of new Set(publicTextFiles)) {
  const content = fs.readFileSync(path.join(root, relative), "utf8");
  if (/Wanguocheng|Changfeng West Street|No\. 2402/i.test(content)) errors.push(`${relative}: exposes the unapproved complete registered address`);
  if (/US-40OZ-102-ACTIVE|Gitty Elbaum/i.test(content)) errors.push(`${relative}: exposes an internal customer-project identifier or customer identity`);
}

const duplicateParagraphDebt = Object.fromEntries([...paragraphOccurrences]
  .filter(([, record]) => record.pages.size >= 3)
  .map(([key, record]) => [key, { count: record.pages.size, pages: [...record.pages].sort(), text: record.text }]));
const numericClaimDebt = Object.fromEntries([...numericClaimOccurrences]
  .map(([key, record]) => [key, { count: record.pages.size, pages: [...record.pages].sort(), text: record.text }]));
const currentDebt = { excessiveHeadings: headingDebt, duplicateParagraphs: duplicateParagraphDebt, numericClaims: numericClaimDebt };

if (!writeBaseline && !fs.existsSync(baselinePath)) errors.push("tools/seo-regression-baseline.json: missing regression baseline");
else if (!writeBaseline) {
  const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  for (const [file, counts] of Object.entries(currentDebt.excessiveHeadings)) {
    const previous = baseline.excessiveHeadings?.[file];
    if (!previous || counts.h2 > previous.h2 || counts.h3 > previous.h3 || counts.total > previous.total) errors.push(`${file}: excessive heading count is new or increased (H2 ${counts.h2}, H3 ${counts.h3})`);
  }
  for (const [key, record] of Object.entries(currentDebt.duplicateParagraphs)) {
    const previous = baseline.duplicateParagraphs?.[key];
    if (!previous || record.count > previous.count) errors.push(`duplicated commercial paragraph is new or more widespread (${record.count} pages): ${record.text.slice(0, 100)}…`);
  }
  for (const [key, record] of Object.entries(currentDebt.numericClaims)) {
    const previous = baseline.numericClaims?.[key];
    if (!previous || record.count > previous.count) errors.push(`new or expanded numeric business claim on ${record.pages.join(", ")}: ${record.text.slice(0, 120)}…`);
  }
  warnings.push(`${Object.keys(currentDebt.duplicateParagraphs).length} known repeated commercial paragraph blocks remain baselined for Phase 2 review.`);
  warnings.push(`${Object.keys(currentDebt.numericClaims).length} known numeric-claim contexts remain baselined for business verification.`);
}

const caseStudyDirectory = path.join(root, "case-studies");
const caseStudyIndex = fs.readFileSync(path.join(caseStudyDirectory, "index.html"), "utf8");
if (!caseStudyIndex.includes("Representative Custom Drinkware Project Scenarios")) errors.push("case-studies/index.html: collection must identify the pages as representative scenarios");
if (/How we helped|Read Full Case Study/i.test(match(caseStudyIndex, /<main(?:\s[^>]*)?>([\s\S]*?)<\/main>/i))) errors.push("case-studies/index.html: scenario collection contains completed-project language");
const scenarioFiles = fs.readdirSync(caseStudyDirectory, { withFileTypes: true }).filter((entry) => entry.isDirectory())
  .map((entry) => path.join(caseStudyDirectory, entry.name, "index.html")).filter((file) => fs.existsSync(file));
for (const file of scenarioFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  if (!html.includes("Representative B2B Project Scenario")) errors.push(`${relative}: missing representative scenario label`);
  if (!/not a customer testimonial/i.test(html)) errors.push(`${relative}: missing customer-testimonial disclaimer`);
  if (!html.includes("Scenario Outcome and Acceptance Criteria")) errors.push(`${relative}: missing scenario acceptance criteria`);
  if (/How we helped|ordered a mixed batch|The client wanted|The client needed|A marketing agency in Dubai needed|As a newly launched online boutique/i.test(html)) errors.push(`${relative}: contains completed-project language`);
}

const homeHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const homeQuoteForm = homeHtml.match(/<form\s+class=["']quote-form["'][\s\S]*?<\/form>/i)?.[0] || "";
const requiredHomeFields = [...homeQuoteForm.matchAll(/<(?:input|select|textarea)\b[^>]*\brequired\b/gi)];
if (homeHtml.includes('name="drinkware-inquiry"')) errors.push("index.html: canonical drinkware RFQ must live on contact/index.html only");
if (!homeHtml.includes('href="contact/#rfq-form"') || !homeHtml.includes(">Request a Quote</a>")) errors.push("index.html: homepage must expose a direct canonical RFQ CTA");
if (requiredHomeFields.length !== 0) errors.push(`index.html: homepage must not duplicate canonical RFQ fields, found ${requiredHomeFields.length}`);
if (/Download PDF/i.test(homeHtml)) errors.push("index.html: catalog CTA promises an immediate PDF download");

const contactHtml = fs.readFileSync(path.join(root, "contact", "index.html"), "utf8");
const contactForm = contactHtml.match(/<form\b[^>]*id=["']rfq-form["'][\s\S]*?<\/form>/i)?.[0] || "";
if (contactForm) {
  if (!/action=["']https:\/\/api\.web3forms\.com\/submit["']/i.test(contactForm) || !/method=["']POST["']/i.test(contactForm)) errors.push("contact/index.html: Web3Forms endpoint or method changed");
  if (!/<input\b[^>]*name=["']access_key["'][^>]*value=["']45e7b7c2-d1c6-4019-a627-1d3f6bbadbab["']/i.test(contactForm)) errors.push("contact/index.html: existing Web3Forms access-key configuration changed");
  const requiredNames = [...contactForm.matchAll(/<(?:input|select|textarea)\b(?=[^>]*\brequired\b)[^>]*\bname=["']([^"']+)/gi)].map((item) => item[1]).sort();
  const expectedRequiredNames = ["country", "name", "quantity"].sort();
  if (requiredNames.join("|") !== expectedRequiredNames.join("|")) errors.push(`contact/index.html: RFQ required fields are ${requiredNames.join(", ") || "missing"}`);
  if (/type=["']file["']/i.test(contactForm)) errors.push("contact/index.html: file upload field must not be present in Phase 1");
}

const conversionScript = fs.readFileSync(path.join(root, "script.js"), "utf8");
for (const field of ["landing_page", "initial_referrer", "utm_source", "utm_medium", "utm_campaign", "page_url"]) if (!conversionScript.includes(field)) errors.push(`script.js: missing lead attribution field ${field}`);
for (const eventName of ["form_start", "rfq_submit", "form_submit_success", "form_submit_error", "whatsapp_click", "email_click", "cta_click"]) if (!conversionScript.includes(`\"${eventName}\"`)) errors.push(`script.js: missing analytics event ${eventName}`);
if (/trackConversionEvent\(["']qualified_rfq/i.test(conversionScript)) errors.push("script.js: qualified_rfq must not fire from frontend code");
if (/\b(?:form|formElement|target|currentTarget)\.name\b/.test(conversionScript)) errors.push("script.js: form identity must use an explicit name attribute lookup");
if (!conversionScript.includes("Source page:")) errors.push("script.js: WhatsApp messages do not include the source page");
if (!conversionScript.includes("window.hdsAnalyticsReady !== true")) errors.push("script.js: analytics events are not blocked until consent");
if (!conversionScript.includes('"generate_lead"')) errors.push("script.js: generate_lead lead event is missing");

const privacyPolicy = fs.readFileSync(path.join(root, "privacy-policy", "index.html"), "utf8");
if (!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(privacyPolicy)) errors.push("privacy-policy/index.html: privacy information must remain owner-review noindex");
for (const phrase of ["Google Analytics 4", "Web3Forms", "Cookie Settings", "UK/EU", "RFQ form content"]) {
  if (!privacyPolicy.includes(phrase)) errors.push(`privacy-policy/index.html: missing factual disclosure ${phrase}`);
}

if (writeBaseline) {
  if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
  fs.writeFileSync(baselinePath, `${JSON.stringify(currentDebt, null, 2)}\n`);
  console.log(`Wrote SEO regression baseline with ${Object.keys(duplicateParagraphDebt).length} repeated paragraph blocks and ${Object.keys(numericClaimDebt).length} numeric-claim contexts.`);
  process.exit(0);
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
if (warnings.length) console.warn(warnings.join("\n"));
console.log(`Validated ${pages.length} indexable pages, ${sitemapUrls.length} sitemap URLs and ${htmlFiles.length} HTML files.`);
