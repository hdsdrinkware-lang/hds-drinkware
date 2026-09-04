import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "./site-config.mjs";

const root = process.cwd();
const site = siteConfig.origin;
const errors = [];
const warnings = [];
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapSet = new Set(sitemapUrls);

const routeToFile = (route) => route === "/"
  ? path.join(root, "index.html")
  : path.join(root, route.replace(/^\//, ""), "index.html");
const normalizeText = (value) => value.replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
  .replace(/&#(?:39|x27);/gi, "'").replace(/\s+/g, " ").trim();
const schemaNodes = (schemas) => schemas.flatMap((schema) => Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema]);
const hasType = (schema, type) => schema?.["@type"] === type || (Array.isArray(schema?.["@type"]) && schema["@type"].includes(type));
const nodesOfType = (nodes, type) => nodes.filter((node) => hasType(node, type));
const canonicalFromHtml = (html) => html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1] || "";
const h1FromHtml = (html) => normalizeText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
const metaDescriptionFromHtml = (html) => normalizeText(html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)/i)?.[1] || "");
const slugFromRoute = (route) => route.replace(/^\/+|\/+$/g, "");
const localFileForUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.origin !== site) return null;
    return routeToFile(parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`);
  } catch {
    return null;
  }
};
const localAssetForUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.origin === site ? path.join(root, parsed.pathname.replace(/^\/+/, "")) : null;
  } catch {
    return null;
  }
};

const allowedServicePages = new Set([
  "/low-moq-custom-drinkware/", "/logo-drinkware-manufacturer/", "/private-label-drinkware-supplier/",
  "/oem-drinkware-supplier-china/", "/wholesale-drinkware-supplier-china/", "/custom-tumbler-supplier-china/",
  "/custom-water-bottle-supplier-china/", "/drinkware-sourcing-agent-china/", "/custom-tumbler-packaging-guide/",
  "/ddp-shipping-for-custom-drinkware-orders/", "/custom-drinkware-quality-control-checklist/",
  "/factory-supply-chain/", "/quality-control/", "/packaging-solutions/", "/shipping-support/",
]);
const forbiddenTypes = new Set(["FAQPage", "Product", "Offer", "AggregateOffer", "AggregateRating", "Review"]);
const priorityArticleMetadata = new Map([
  ["/sourcing-guides/lfgb-certification-drinkware/", { datePublished: "2026-09-01", dateModified: "2026-09-01" }],
  ["/sourcing-guides/how-to-source-custom-tumblers-from-china/", { datePublished: "2026-06-26", dateModified: "2026-09-01" }],
  ["/sourcing-guides/understanding-fda-vs-lfgb-standards-stainless-steel-bottles/", { datePublished: "2026-06-26", dateModified: "2026-07-22" }],
]);
const urlKeys = new Set(["@id", "url", "item", "logo", "image"]);
const visitValues = (value, visit) => {
  if (Array.isArray(value)) return value.forEach((item) => visitValues(item, visit));
  if (!value || typeof value !== "object") return visit(value);
  for (const [key, item] of Object.entries(value)) {
    if (urlKeys.has(key)) visit(item, key);
    else visitValues(item, visit);
  }
};

if (sitemapUrls.length !== 71 || sitemapSet.size !== 71) {
  errors.push(`sitemap must contain 71 unique URLs; found ${sitemapSet.size}`);
}

const summary = { pages: 0, blocks: 0, invalid: 0, breadcrumbPages: 0, articlePages: 0, servicePages: 0, productPages: 0, offerPages: 0, faqPages: 0, duplicateIds: 0, brokenImageReferences: 0 };

for (const url of sitemapUrls) {
  const route = new URL(url).pathname;
  const file = routeToFile(route);
  if (!fs.existsSync(file)) {
    errors.push(`${route}: sitemap URL has no local HTML output`);
    continue;
  }
  summary.pages += 1;
  const html = fs.readFileSync(file, "utf8");
  const h1 = h1FromHtml(html);
  const metaDescription = metaDescriptionFromHtml(html);
  const schemas = [];
  for (const match of html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)) {
    summary.blocks += 1;
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed?.["@context"] !== "https://schema.org") errors.push(`${route}: JSON-LD @context must be https://schema.org`);
      if (parsed && typeof parsed === "object") schemas.push(parsed);
    } catch (error) {
      summary.invalid += 1;
      errors.push(`${route}: invalid JSON-LD (${error.message})`);
    }
  }
  const nodes = schemaNodes(schemas);
  const serializedNodes = JSON.stringify(nodes);
  if (/api\.web3forms|access_key|Gitty Elbaum|US-40OZ-102-ACTIVE|Wanguocheng|Changfeng West Street/i.test(serializedNodes)) {
    errors.push(`${route}: JSON-LD exposes private RFQ, customer or registration data`);
  }
  const ids = nodes.map((node) => node?.["@id"]).filter(Boolean);
  const uniqueIds = new Set(ids);
  summary.duplicateIds += ids.length - uniqueIds.size;
  if (ids.length !== uniqueIds.size) errors.push(`${route}: duplicate JSON-LD @id`);

  for (const node of nodes) {
    for (const type of (Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]])) {
      if (forbiddenTypes.has(type)) errors.push(`${route}: forbidden schema type ${type}`);
    }
    visitValues(node, (value, key) => {
      if (key === "logo" || key === "image") {
        const urls = Array.isArray(value) ? value : [typeof value === "object" ? value?.url : value];
        for (const imageUrl of urls.filter(Boolean)) {
          if (typeof imageUrl !== "string" || !/^https:\/\/www\.hdsdrinkware\.com\//i.test(imageUrl)) {
            errors.push(`${route}: ${key} must use an absolute HTTPS www URL`);
            continue;
          }
          const imageFile = localAssetForUrl(imageUrl);
          if (imageFile && !fs.existsSync(imageFile)) {
            summary.brokenImageReferences += 1;
            errors.push(`${route}: broken ${key} reference ${imageUrl}`);
          }
        }
      } else if (typeof value === "string" && (key === "@id" || key === "url" || key === "item")) {
        if (!/^https:\/\/www\.hdsdrinkware\.com\//i.test(value)) errors.push(`${route}: ${key} is not an absolute HTTPS www URL (${value})`);
      }
    });
  }

  const canonical = canonicalFromHtml(html);
  const organizationNodes = nodesOfType(nodes, "Organization");
  const websiteNodes = nodesOfType(nodes, "WebSite");
  const pageNodes = nodes.filter((node) => ["WebPage", "AboutPage", "CollectionPage", "ContactPage"].some((type) => hasType(node, type)));
  const breadcrumbNodes = nodesOfType(nodes, "BreadcrumbList");
  const articleNodes = nodesOfType(nodes, "Article");
  const serviceNodes = nodesOfType(nodes, "Service");
  summary.breadcrumbPages += breadcrumbNodes.length;
  summary.articlePages += articleNodes.length;
  summary.servicePages += serviceNodes.length;
  summary.productPages += nodesOfType(nodes, "Product").length;
  summary.offerPages += nodes.filter((node) => ["Offer", "AggregateOffer"].some((type) => hasType(node, type))).length;
  summary.faqPages += nodesOfType(nodes, "FAQPage").length;

  if (route === "/") {
    if (organizationNodes.length !== 1 || websiteNodes.length !== 1) errors.push("/: homepage must define exactly one Organization and one WebSite");
    if (breadcrumbNodes.length !== 0) errors.push("/: homepage must not define BreadcrumbList");
    const organization = organizationNodes[0];
    if (organization?.name !== "HDS Drinkware" || organization?.["@id"] !== `${site}/#organization`) errors.push("/: Organization identity is inconsistent");
    if (organization?.logo?.["@type"] !== "ImageObject" || organization?.logo?.url !== `${site}/assets/company-logo.png`) errors.push("/: Organization logo must be the approved company logo");
    if (websiteNodes[0]?.["@id"] !== `${site}/#website` || websiteNodes[0]?.publisher?.["@id"] !== `${site}/#organization`) errors.push("/: WebSite publisher relationship is inconsistent");
  } else {
    if (organizationNodes.length !== 0 || websiteNodes.length !== 0) errors.push(`${route}: Organization/WebSite must be defined on homepage only`);
    if (breadcrumbNodes.length !== 1) errors.push(`${route}: expected exactly one BreadcrumbList`);
  }
  if (pageNodes.length !== 1 || pageNodes[0]?.["@id"] !== `${canonical}#webpage` || pageNodes[0]?.name !== h1) {
    errors.push(`${route}: page entity must match the canonical URL and visible H1`);
  }
  if (pageNodes[0]?.isPartOf?.["@id"] !== `${site}/#website` || pageNodes[0]?.publisher?.["@id"] !== `${site}/#organization`) {
    errors.push(`${route}: page entity has broken Website/Organization relationships`);
  }

  if (breadcrumbNodes[0]) {
    const items = breadcrumbNodes[0].itemListElement || [];
    if (!items.length || items.some((item, index) => item?.position !== index + 1 || typeof item?.name !== "string" || typeof item?.item !== "string")) errors.push(`${route}: BreadcrumbList positions or values are invalid`);
    if (items.at(-1)?.item !== canonical) errors.push(`${route}: final breadcrumb URL must equal canonical`);
    if (!new Set(["/sourcing-guides/", "/case-studies/"]).has(route) && items.at(-1)?.name !== h1) errors.push(`${route}: final breadcrumb name must match the visible H1`);
    for (const item of items) {
      if (item?.item && !sitemapSet.has(item.item)) errors.push(`${route}: breadcrumb destination is not a sitemap URL (${item.item})`);
      if (item?.item && !fs.existsSync(localFileForUrl(item.item) || "")) errors.push(`${route}: breadcrumb destination is not a local HTTP-200 page (${item.item})`);
    }
  }

  const isGuideArticle = route.startsWith("/sourcing-guides/") && route !== "/sourcing-guides/";
  if (isGuideArticle && articleNodes.length !== 1) errors.push(`${route}: sourcing guide must have exactly one Article`);
  if (!isGuideArticle && articleNodes.length !== 0) errors.push(`${route}: Article is only permitted on sourcing guide detail pages`);
  if (articleNodes[0]) {
    const article = articleNodes[0];
    if (article.headline !== h1 || article.mainEntityOfPage?.["@id"] !== `${canonical}#webpage` || article.author?.["@id"] !== `${site}/#organization` || article.publisher?.["@id"] !== `${site}/#organization`) {
      errors.push(`${route}: Article relationships or headline are inconsistent`);
    }
    if (article.datePublished === undefined) warnings.push(`${route}: Article datePublished is not yet supported by repository evidence`);
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(article.datePublished)) errors.push(`${route}: Article datePublished must be an evidence-backed ISO date`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(article.dateModified || "")) errors.push(`${route}: Article dateModified must be an approved ISO date`);
    if (article.datePublished && article.dateModified && article.datePublished > article.dateModified) errors.push(`${route}: Article datePublished cannot be later than dateModified`);
    if (!article.image) warnings.push(`${route}: Article image deferred until a legitimate representative image is available`);
    const expectedMetadata = priorityArticleMetadata.get(route);
    if (expectedMetadata && (article.datePublished !== expectedMetadata.datePublished || article.dateModified !== expectedMetadata.dateModified || article.description !== metaDescription)) {
      errors.push(`${route}: priority Article dates or description do not match approved repository evidence`);
    }
  }
  if (serviceNodes.length && !allowedServicePages.has(route)) errors.push(`${route}: Service schema is not approved for this page class`);
  if (serviceNodes.length > 1) errors.push(`${route}: expected at most one Service entity`);
  for (const service of serviceNodes) if (service.provider?.["@id"] !== `${site}/#organization`) errors.push(`${route}: Service provider must reference #organization`);
}

if (summary.invalid || summary.duplicateIds || summary.faqPages || summary.productPages || summary.offerPages || summary.brokenImageReferences) {
  errors.push("schema summary contains invalid JSON, duplicate IDs, forbidden rich-result types or broken image references");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

if (warnings.length) console.warn(`Schema completeness warnings (${warnings.length}):\n${warnings.join("\n")}`);
console.log(`Schema validation passed: ${summary.pages} pages, ${summary.blocks} JSON-LD blocks, ${summary.breadcrumbPages} breadcrumbs, ${summary.articlePages} articles, ${summary.servicePages} services, ${summary.productPages} products, ${summary.offerPages} offers, ${summary.faqPages} FAQPage schemas, ${summary.brokenImageReferences} broken image references.`);
