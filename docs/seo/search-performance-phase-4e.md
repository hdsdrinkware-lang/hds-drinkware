# Phase 4E — Search Performance & CTR Optimization

Date: 2026-08-27
Property: `sc-domain:hdsdrinkware.com`
Account: `Vincent (zh766499@gmail.com)`
Data last updated in Search Console: 7 hours before review
Baseline commit: `93cbf16a8c069416b594296b3a13a90729c60115`

## Status

**PASS — targeted CTR correction implemented; no broad metadata rewrite.**

Search Console volume remains low. The first review batch used the required 10-impression / position-5–30 candidate threshold, then lowered the impression threshold to 5 because no candidate reached 10 impressions. Only one deterministic presentation defect was worth fixing: the water-bottle page rendered `Low Low MOQ` in its H1 and WebPage/Breadcrumb names.

The title and meta description were not changed. The corporate-gifting, gift-set and 40oz pages were reviewed but did not have enough query-level evidence to justify a new title, description or opening-copy rewrite.

## Search Console periods and baseline

| Period | Dates | Clicks | Impressions | CTR | Average position | Query rows |
|---|---|---:|---:|---:|---:|---:|
| Previous 28 days | 2026-06-30 to 2026-07-27 | 2 | 165 | 1.2% | 15.2 | 17 |
| Last 28 days | 2026-07-28 to 2026-08-24 | 5 | 380 | 1.3% | 22.2 | 23 |
| Last 3 months | 2026-06-01 to 2026-08-24 | 9 | 765 | 1.2% | 18.2 | 40 |

The Search Console CSV export control opened a Chrome-blocked export endpoint in the signed-in browser. The figures above and the query/page/country/device values below were read from the live Search Console tables, with the visible CTR and position columns preserved. No synthetic data or external keyword estimates were used.

## Query review

The last-three-month query table contained 40 rows. The four rows meeting the lowered 5-impression review threshold were:

| Query | Intent | Priority | Clicks | Impressions | CTR | Position | Tier | Landing-page mapping |
|---|---|---|---:|---:|---:|---:|---|---|
| `custom bottles low moq` | Transactional / commercial investigation | P1 | 0 | 8 | 0% | 24.3 | B | `/custom-water-bottles-with-logo/` (4) and `/case-studies/low-moq-custom-water-bottles-for-startup-brand/` (4) |
| `custom drinkware suppliers retail corporate gifting` | Commercial investigation | P1 | 0 | 7 | 0% | 6.6 | A | `/sourcing-guides/custom-drinkware-for-corporate-gifts/` (7) |
| `which drinkware sets come in gift packaging for corporate events?` | Commercial investigation | P1 | 0 | 6 | 0% | 7.2 | A | `/sourcing-guides/custom-drinkware-for-corporate-gifts/` (4) and `/custom-drinkware-gift-sets/` (2) |
| `40oz tumbler china solutions` | Commercial investigation | P2 | 0 | 5 | 0% | 46.2 | C | `/custom-40oz-tumbler-manufacturer/` (5) |

Tier counts for the evidence-qualified batch: **A = 2, B = 1, C = 1**. The other 36 three-month query rows had fewer than 5 impressions or were too weakly positioned to support a safe CTR rewrite. Representative lower-volume themes included LFGB/testing, HS codes, sports bottles and sourcing questions; they remain monitoring inputs rather than optimization instructions.

### Selected page review

| Page | Last 28 days | Previous 28 days | Observed issue / decision |
|---|---:|---:|---|
| `/custom-water-bottles-with-logo/` | 0 clicks / 48 impressions / 0% CTR / position 15.5 | not in the previous-period top 10 | Relevant low-MOQ query; H1 contained a duplicated word. Corrected the H1 and generated schema names. |
| `/sourcing-guides/custom-drinkware-for-corporate-gifts/` | query-level 7 impressions / position 6.6 | not in the previous-period top 10 | Intent is a good match, but 7 impressions and 0 clicks do not support a second title rewrite after the existing page already answers the query. |
| `/custom-drinkware-gift-sets/` | query-level 2 impressions in the gift-set split | previous-period page row: 0 / 15 / 0% / position 4.6 | Correctly distinct gift-set route; no change. |
| `/custom-40oz-tumbler-manufacturer/` | 0 clicks / 40 impressions / 0% CTR / position 11.9 | 0 / 37 / 0% / position 18.2 | Strongest page-level CTR monitoring candidate, but the only mapped query above threshold was position 46.2. Existing title/meta/H1 are already tightly aligned; no speculative rewrite. |
| `/` | 2 clicks / 41 impressions / 4.9% CTR / position 6.1 | 2 / 34 / 5.9% / position 5.7 | Homepage reviewed; no CTR defect. |
| `/contact/` | 2 / 15 / 13.3% / position 16.1 | not in previous-period top 10 | Conversion page reviewed; no SEO rewrite. |
| `/custom-drinkware-quality-control-checklist/` | 1 / 1 / 100% / position 5.0 | not in previous-period top 10 | Insufficient evidence; no change. |

Countries and devices were reviewed for the three-month and last-28-day ranges. Three-month totals were led by the United States (8 clicks / 497 impressions) and desktop (8 / 698). Last-28-day totals were also led by the United States (5 / 225) and desktop (5 / 332). The remaining countries and mobile/tablet segments are too small to justify geo- or device-specific copy.

## Change made

- Corrected the water-bottle page H1 from `Custom Water Bottles with Logo — Low Low MOQ on selected models` to `Custom Water Bottles with Logo — Low MOQ on selected models`.
- Regenerated the page's WebPage and Breadcrumb JSON-LD names from the corrected H1.
- Added an exact-match generator rule so the source phrase `Low MOQ from 200 pcs` is normalized once, without creating the duplicate `Low Low` token.
- Added a narrow protected-production normalization for this one known migration typo so future generator writes can safely reconcile the existing production output.
- Title, meta description, opening paragraph, CTA, internal links and all other pages were left unchanged.

## Cannibalization review

Two mild splits were observed: the low-MOQ bottle query split between the product page and a representative case-study page, and the gift-packaging query split between the corporate-gifting guide and the gift-set page. The page roles and copy are materially different, so this is not enough evidence for consolidation or canonical changes. Multiple ranking pages can be normal for exploratory B2B queries.

## Indexation and technical regression

- Sitemap: **70 / 70 / 70** — 70 sitemap URLs, 70 indexable pages, 70 HTTP 200 pages.
- Canonicals: 70 self-canonical indexable pages; robots remain `index, follow`.
- Schema: validation passed for 70 pages and 176 JSON-LD blocks; 0 Product, 0 Offer and 0 FAQPage blocks; no broken image references.
- Internal links: same Phase 4D methodology and result — 0 pages with 0 inbound links, 0 pages with 1 inbound link, 20 pages with 2 inbound links, 49 pages with 3+ inbound links, 0 orphans, 1,740 HTML link occurrences to indexable targets. This remains consistent with the documented 18 → 0 weak-link reconciliation and +8 occurrences from the pre-Phase-4D baseline.
- GA4/consent/RFQ: consent, analytics PII-safety and RFQ form-name-clobbering tests passed.
- Phase 3C–4D regression: generator check, site validation, schema validation, form analytics, consent foundation and internal-link audit all passed.

## Request indexing

The materially changed URL is:

- `https://www.hdsdrinkware.com/custom-water-bottles-with-logo/`

Request indexing was not submitted during this pass because the signed-in Search Console action requires an immediate user confirmation immediately before submission. The URL is technically eligible for the request and is already in the sitemap.

## Monitoring plan

Recheck after 28–42 days, using the same Search Console ranges and query/page mapping:

1. `custom bottles low moq`: impressions, CTR and page split between the product page and case study.
2. Corporate-gifting and gift-packaging queries: whether the guide earns clicks without a new title rewrite.
3. `/custom-40oz-tumbler-manufacturer/`: page-level CTR at positions 5–15 and any new 40oz query cluster.
4. Homepage/contact/QC checklist: retain current conversion-oriented behavior; do not optimize from one-impression rows.

Next phase: **Phase 4F — conversion/lead-quality review only after a larger evidence window**, unless new Search Console data creates a clearly supported SEO opportunity sooner.
