# Phase 4D — Indexation and Internal Link Optimization

Review date: 2026-08-27
Production baseline: `7819c139dc04c441a37afc06a419d655fb93ac6d`
Property: `sc-domain:hdsdrinkware.com`

## Decision

Phase 4D is **PASS WITH MONITORING** pending normal Google recrawl and the
owner's targeted URL Inspection requests. The current sitemap and the ten
submitted-but-not-indexed URLs have no observed technical indexing blocker.
The safe implementation was a contextual internal-link expansion in existing
related-resource sections. No URL migration, sitemap expansion, redirect
cleanup, schema redesign, GA4, consent or RFQ change was made.

## Search Console baseline and ten submitted URLs

Search Console's “all submitted pages” view was last updated 2026-08-21 and
showed 60 indexed and 10 not indexed. The ten URLs were inspected in the
submitted-pages reason drilldowns:

| URL | GSC reason | Type / priority | Inbound sources after change | Action |
| --- | --- | --- | ---: | --- |
| `/custom-drinkware-for-distributors/` | Discovered — currently not indexed | Commercial / P1 | 5 | Request indexing |
| `/custom-drinkware-for-event-gifts/` | Discovered — currently not indexed | Event capability / P2 | 4 | Monitor, then request if still absent |
| `/custom-drinkware-for-promotional-companies/` | Discovered — currently not indexed | Promotional capability / P2 | 3 | Monitor |
| `/custom-drinkware-for-shopify-brands/` | Discovered — currently not indexed | Commercial channel / P1 | 2 | Request indexing |
| `/custom-promotional-drinkware/` | Discovered — currently not indexed | Commercial category hub / P2 | 4 | Monitor |
| `/custom-tumbler-supplier-china/` | Discovered — currently not indexed | Supplier evaluation / P1 | 5 | Request indexing |
| `/drinkware-sourcing-agent-china/` | Discovered — currently not indexed | Sourcing service / P1 | 3 | Request indexing |
| `/sourcing-guides/custom-drinkware-production-timeline/` | Discovered — currently not indexed | High-value guide / P2 | 3 | Monitor |
| `/sourcing-guides/what-is-moq-for-custom-drinkware/` | Discovered — currently not indexed | RFQ guide / P1 | 3 | Request indexing |
| `/ddp-shipping-for-custom-drinkware-orders/` | Crawled — currently not indexed; last crawl 2026-06-14 | Shipping service / P1 | 4 | Request indexing |

The nine “discovered” pages are classified as discovery delay / link
weakness, not a technical block. The DDP page is classified as normal
reprocessing after its later page update, with a discovery-strengthening
action. All ten remain appropriate sitemap URLs.

## Technical validation

Local validation of all ten pages found HTTP 200 outputs, `index, follow`,
self-referencing HTTPS/www canonicals, one H1, sitemap membership and valid
JSON-LD. The live production check confirmed the representative production
response is HTTP 200; the owner should repeat URL Inspection's **TEST LIVE
URL** after deployment for the six priority requests.

Technical blockers: **0 / 10**.

## Content differentiation review

The ten pages have distinct title/H1 intent boundaries: distributors,
promotional category and agency workflows, Shopify channel, tumbler supplier
evaluation, sourcing service, MOQ, production timing and DDP/DDU shipping.
Shared RFQ, material, logo, packaging and shipping language is template-level
reuse already present across the site, not evidence by itself of a near-copy.

- Substantively unique intent: **10**
- Serious duplicate/overlap action required: **0**
- Template-similarity pairs reviewed: promotional category ↔ promotional
  supplier/agency; Shopify ↔ private label; tumbler supplier ↔ 40oz/stainless
  tumbler pages; sourcing agent ↔ OEM/wholesale; DDP ↔ shipping support.

No arbitrary word-count rewrite or filler content was added.

## Internal-link audit

The audit counts distinct source pages with actual crawlable HTML `<a>` links
to the 70 indexable sitemap URLs. Canonical tags, JSON-LD URLs and sitemap
entries are not counted as links.

| Inbound source pages | Before | After |
| --- | ---: | ---: |
| 0 | 0 | 0 |
| 1 | 18 in Phase 4B baseline; 19 on the pre-change checkout | 0 |
| 2 | 16 | 20 |
| 3+ | 34 | 49 |

The implementation added a net **8** indexable-target HTML link occurrences
relative to the production baseline while removing/replacing some broad
related-link lists. This is a net count, not a claim that every rendered
anchor is a new link. No P1 commercial page remains dependent on one inbound
source.

Semantic clusters strengthened:

- Commercial category → channel and capability pages: Shopify, distributors,
  promotional agencies and event-gift pages.
- Supplier evaluation → sourcing service and production-timeline guidance.
- Amazon/private-label flows → MOQ, packaging, QC, artwork and case-study
  resources.
- Shipping and wholesale flows → DDP/DDU, tariff/landed-cost and Germany EPR
  guidance.
- Logo/manufacturing flows → logo-method, artwork-preparation and tumbler
  supplier resources.

Links use descriptive, varied anchors in existing related-resource sections;
no mass footer links, hidden links or sitewide exact-match block was added.

## 310 known non-indexed URL inventory

Search Console's “all known pages” view showed 310 not indexed pages and six
reason groups. The following reason-level inventory accounts for all 310;
the 310 total must not be interpreted as 310 current pages to add to the
sitemap.

| Classification | Count | Policy |
| --- | ---: | --- |
| Current valid URL — submitted discovery/crawl pages | 10 | Keep in sitemap; fix discovery and monitor indexing |
| Redirect | 18 | No blanket redirect changes |
| Duplicate / alternate with proper canonical | 2 | No action; preserve canonical signal |
| Redirect error | 1 | Investigate only if a concrete URL mapping is supplied; no homepage redirect |
| 404 | 279 | No sitemap addition; retain 404 unless a verified one-to-one replacement exists |
| Confirmed old URL, HTTP variant, non-www/slash variant, parameter URL or soft 404 | 0 confirmed from the aggregate report | Do not infer individual paths from counts |
| **Total** | **310** | |

The current `_redirects` file contains only the two documented one-to-one
guide moves plus retired language placeholders. No mass redirect or
historical URL change was made. A future redirect is appropriate only when a
specific old URL has a clearly equivalent current page; unrelated URLs should
remain 404/410 rather than being sent to the homepage.

## Post-deployment Search Console plan

### Request indexing now

- `/custom-drinkware-for-distributors/`
- `/custom-drinkware-for-shopify-brands/`
- `/custom-tumbler-supplier-china/`
- `/drinkware-sourcing-agent-china/`
- `/sourcing-guides/what-is-moq-for-custom-drinkware/`
- `/ddp-shipping-for-custom-drinkware-orders/`

For each: open URL Inspection, run **TEST LIVE URL**, confirm the live URL is
eligible, then use **REQUEST INDEXING** once. Do not submit the whole sitemap
again or bypass quotas.

### Monitor only

- `/custom-drinkware-for-event-gifts/`
- `/custom-drinkware-for-promotional-companies/`
- `/custom-promotional-drinkware/`
- `/sourcing-guides/custom-drinkware-production-timeline/`

These are technically valid and now have stronger discovery paths; allow a
normal recrawl before taking further action.

### Do not index / no action

The 300 known non-current-valid entries represented by redirects, canonical
alternates, redirect error and 404 states are not candidates for blanket
indexing requests or sitemap inclusion. Review a concrete URL only when a
verified one-to-one replacement or redirect-error reproduction exists.

## Regression results

- Indexable URLs: 70
- Sitemap URLs: 70 unique
- Local HTTP outputs: 70 generated pages; all expected pages present
- Orphan pages: 0
- Schema: PASS — Organization, WebSite, Breadcrumb, Service and Article remain valid; 0 Product, Offer or FAQPage schemas
- GA4 / consent / RFQ tests: PASS; measurement ID remains `G-2ST51EB9GY`
- Robots, titles, descriptions, H1s, canonicals and generator: PASS
- IndexNow: unchanged; any normal workflow submission is not evidence of Google indexing

## Owner action and monitoring

Owner action is required for the six targeted URL Inspection requests above.
Monitor submitted indexed/not-indexed counts, the ten URL statuses, sitemap
read status and any new redirect-error/404 rows after Google refreshes the
report. No immediate indexing-count increase is expected after deployment.
