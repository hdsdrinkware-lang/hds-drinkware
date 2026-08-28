# Phase 5B — CTA & RFQ Conversion Architecture

Project: HDS Drinkware
Previous production baseline: `491afee`
Scope: CTA hierarchy, RFQ path, source context, consent-safe click measurement and responsive conversion access.

## Before State

- The homepage hero did not expose the primary RFQ action early enough on mobile and desktop.
- The homepage carried a full `drinkware-inquiry` form while `/contact/#rfq-form` carried a second full RFQ form.
- Commercial-page detail CTAs commonly routed to the homepage `#inquiry` section, adding an avoidable detour.
- Mobile navigation had no dedicated RFQ action because the desktop header CTA is hidden at the mobile breakpoint.
- The site tracked WhatsApp/email and form events, but had no normalized `cta_click` event and pushed data-layer events before consent readiness.

## CTA Hierarchy

The site now uses this hierarchy across commercial surfaces:

1. Primary: `Request a Quote` → `/contact/#rfq-form`.
2. Secondary: `WhatsApp Us` or a contextual WhatsApp action.
3. Tertiary: email/contact navigation or product exploration.

Existing catalog and stock-sample microforms remain available as separate non-RFQ lead hooks; they do not duplicate the canonical B2B RFQ.

## Homepage Hero

The hero now places `Request a Quote` and `Explore Products` before the main explanatory copy. Local responsive QA measured both links inside the initial viewport at `1280×720` and `390×844`.

## Mobile RFQ

The mobile menu receives a visible `Request a Quote` link to `/contact/#rfq-form`. No large sticky bar was added. Local QA confirmed the menu link is visible after opening the menu and that the page has no horizontal overflow.

## Commercial Page Routing

All former static `#inquiry` CTA links were changed to direct canonical RFQ links, including one- and two-level relative paths and root-absolute paths. Representative local QA on `/custom-40oz-tumbler-manufacturer/` confirmed the primary CTA goes directly to `/contact/#rfq-form`.

On click, the shared script appends non-PII context to the RFQ URL:

- `source_page`: current pathname
- `inquiry_type`: normalized page intent
- `product`: static catalog/product label when available

The parameters are also copied into hidden fields on the canonical form for lead review.

## RFQ Consolidation

`/contact/index.html#rfq-form` is the single canonical B2B RFQ experience. The homepage’s full duplicate RFQ was removed while catalog and sample request microforms were preserved. The contact RFQ remains on the existing Web3Forms endpoint and keeps its existing access-key configuration.

Required fields are now limited to the four minimum qualification inputs:

- Name
- Business Email
- Product
- Estimated Quantity

Country/destination, company, WhatsApp, customization, packaging and message details remain available but optional for the first quote.

## Analytics Events

`cta_click` is emitted with only normalized, non-PII parameters:

`cta_type`, `cta_label`, `page_path`, `destination_type`, `placement`

The existing `form_start`, `rfq_submit`, `form_submit_success`, `form_submit_error`, `whatsapp_click` and `email_click` events remain. Confirmed RFQ success continues to emit exactly one `generate_lead`; no `qualified_rfq` event is emitted by frontend code.

## Consent and PII Safety

`trackConversionEvent` now returns before writing to `dataLayer` or calling GA4 unless `window.hdsAnalyticsReady === true` and `gtag` is available. The focused CTA test verifies that denied/not-ready analytics produce no event. Form analytics regression tests verify that name, email, WhatsApp, country, product, quantity and message values do not enter GA4 or the analytics data layer.

No WhatsApp message, email, RFQ submission or file upload was sent during validation.

## Validation Record

- Focused CTA analytics test: PASS.
- Existing form analytics regression test: PASS.
- Consent foundation test: PASS.
- Site validator: PASS — 70 indexable pages, 70 sitemap URLs and 74 HTML files.
- Schema validator: PASS — 70 pages, 176 JSON-LD blocks, 69 breadcrumbs, 20 articles and 15 services.
- Desktop homepage QA (`1280×720`): PASS — RFQ and product actions visible in hero.
- Mobile homepage QA (`390×844`): PASS — hero actions visible, RFQ menu action available, no horizontal overflow.
- Mobile contact QA (`390×844`): PASS — canonical form begins at approximately `1022px` document position; required fields are name, email, product and quantity.
- Desktop contact QA (`1280×720`): PASS — canonical form begins at approximately `727px` document position.
- Representative commercial route QA: PASS — direct canonical RFQ route and source-context query handoff verified.

## SEO Regression

Titles, descriptions, canonicals, H1 counts, sitemap URLs, robots behavior and JSON-LD validation remain green. The repository’s generator drift check already reports all 74 static outputs as differing from its protected/stale generator source at the `491afee` baseline; this pre-existing condition is recorded separately and was not expanded by the Phase 5B architecture. The site and schema validators are the release checks used for this change.

## Changes Made

- Added above-fold homepage RFQ/product actions.
- Removed the duplicate homepage full RFQ and retained catalog/sample microforms.
- Reordered the contact RFQ before supporting visual/context sections.
- Made country/destination optional on the canonical RFQ.
- Routed commercial `#inquiry` links directly to the canonical RFQ.
- Added a mobile-menu RFQ action without a sticky conversion bar.
- Added normalized, consent-safe `cta_click` tracking and regression coverage.
- Added RFQ source-page, intent and product context fields.
- Updated the site validator to enforce the unified RFQ architecture.

## Known Limitations

- No production RFQ was submitted, so lead delivery and response-time performance still require monitoring.
- GA4 numeric conversion volume is not available from this implementation-only pass.
- Artwork and reference files remain a post-submit email/WhatsApp handoff rather than a form upload.
- Generator source/output drift predates Phase 5B and remains a maintenance item.

## Recommended Phase 5C

Monitor `cta_click` → RFQ starts → RFQ submissions → confirmed lead quality by page intent. Then test one controlled trust/response-time module and one catalog/sample follow-up path without adding competing primary CTAs.
