import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const origin = "https://www.hdsdrinkware.com";
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const indexable = new Set(urls);
const inbound = new Map(urls.map((url) => [url, { sources: new Set(), links: 0 }]));

const localFileFor = (url) => {
  const pathname = new URL(url).pathname;
  return path.join(root, pathname === "/" ? "index.html" : `${pathname.replace(/^\//, "")}index.html`);
};

for (const sourceUrl of urls) {
  const html = fs.readFileSync(localFileFor(sourceUrl), "utf8");
  for (const match of html.matchAll(/<a\b[^>]+href=["']([^"']+)["']/gi)) {
    const href = match[1].trim();
    if (!href || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let target;
    try { target = new URL(href, sourceUrl); } catch { continue; }
    if (target.origin !== origin) continue;
    const targetUrl = `${origin}${target.pathname.endsWith("/") || path.extname(target.pathname) ? target.pathname : `${target.pathname}/`}`;
    if (!indexable.has(targetUrl) || targetUrl === sourceUrl) continue;
    const record = inbound.get(targetUrl);
    record.sources.add(sourceUrl);
    record.links += 1;
  }
}

const buckets = { "0 inbound": [], "1 inbound": [], "2 inbound": [], "3+ inbound": [] };
for (const [url, record] of inbound) {
  if (url === `${origin}/`) continue;
  const label = record.sources.size === 0 ? "0 inbound" : record.sources.size === 1 ? "1 inbound" : record.sources.size === 2 ? "2 inbound" : "3+ inbound";
  buckets[label].push({ url, sources: [...record.sources].sort(), links: record.links });
}

for (const records of Object.values(buckets)) records.sort((a, b) => a.url.localeCompare(b.url));
console.log(`INDEXABLE URLS: ${urls.length}`);
for (const [label, records] of Object.entries(buckets)) console.log(`${label.toUpperCase()}: ${records.length}`);
console.log(`ORPHAN PAGES: ${buckets["0 inbound"].length}`);
console.log(`TOTAL HTML LINK OCCURRENCES TO INDEXABLE TARGETS: ${[...inbound.values()].reduce((sum, record) => sum + record.links, 0)}`);
console.log(JSON.stringify(buckets, null, 2));
