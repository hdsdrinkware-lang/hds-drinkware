# Phase 5A — CRO Baseline & Conversion Path Audit

**Project:** HDS Drinkware
**Production site:** https://www.hdsdrinkware.com/
**Audit date:** 2026-08-28 (Asia/Shanghai)
**Production baseline:** `491afee` (`491afee7381dc85c82bb3ea52e3785e5e5c6ebdf`)
**Scope:** On-site B2B conversion-rate baseline only. No authority, link-building, outreach, profile, membership, directory or off-site account work was performed.

## Decision

**Baseline established — defer broad CRO copy and CTA changes until one canonical RFQ route and the missing conversion events are instrumented.**

No confirmed P0 hard blocker was observed. The highest-impact problems are path fragmentation, above-the-fold CTA visibility, mobile RFQ discoverability, inconsistent form schemas, and incomplete CTA measurement. The current site is usable for a motivated buyer, but it makes the buyer choose between several differently worded paths and sometimes sends the lower-friction “details” path back to a very long homepage instead of a canonical RFQ form.

## Audit method and evidence boundary

- Inspected the live production DOM and screenshots at the default desktop viewport (`1280 × 720`) and a mobile viewport (`390 × 844`) for the homepage, Contact page and commercial landing pages.
- Reviewed local production source at the stated baseline, including [`index.html`](/Users/haizhang/Documents/独立站/index.html), [`contact/index.html`](/Users/haizhang/Documents/独立站/contact/index.html), [`script.js`](/Users/haizhang/Documents/独立站/script.js), [`styles.css`](/Users/haizhang/Documents/独立站/styles.css), [`tools/test-form-analytics.mjs`](/Users/haizhang/Documents/独立站/tools/test-form-analytics.mjs), and [`tools/test-consent-foundation.mjs`](/Users/haizhang/Documents/独立站/tools/test-consent-foundation.mjs).
- Sampled these commercial routes: `/oem-drinkware-supplier-china/`, `/wholesale-drinkware-supplier-china/`, `/custom-40oz-tumbler-manufacturer/`, `/custom-stainless-steel-tumblers/`, `/custom-drinkware-gift-sets/`, and `/low-moq-custom-drinkware/`.
- Did not submit a live RFQ, send WhatsApp/email, upload a file, or create an external side effect. The success path is therefore verified from source and regression tests, not from a production submission.
- Existing business facts and evidence remain the boundary for trust language. No new commercial claim is proposed as a fact.

## 1. Executive baseline

| Area | Current baseline | CRO interpretation |
| --- | --- | --- |
| Primary business conversion | Qualified OEM/ODM inquiry | Correctly reflected in the presence of RFQ, WhatsApp and email routes, but not consistently prioritized. |
| Homepage first screen | Clear H1 and B2B/OEM/ODM positioning; desktop hero CTA is below the 720 px viewport; mobile hero CTA is below the 844 px viewport. | A buyer can understand the category and audience, but cannot immediately act through the main RFQ path without scrolling. |
| Commercial pages | Strong intent-specific H1s and commercial information; sampled pages contain no local form. | Landing pages depend on WhatsApp or a second-hop route to Contact/homepage. This is acceptable for WhatsApp-first buyers but weak for form-first buyers. |
| Canonical RFQ route | Both homepage `#inquiry` and `/contact/#rfq-form` are active form destinations. | Two schemas and two locations make reporting and optimization harder. |
| Form count | Homepage: 3 forms (main RFQ, catalog request, sample request). Contact: 1 RFQ form. Other sampled commercial pages: 0 forms. | Multiple lead hooks add choices and duplicate the conversion model. |
| Form fields | Homepage main RFQ: 13 visible controls, 4 required. Contact RFQ: 10 visible controls, 5 required. | Homepage is relatively low-friction on required fields; Contact incorrectly makes Name required and uses a different field schema. |
| Success state | Inline status after Web3Forms success; form resets; RFQ message explains that HDS will follow up through the preferred contact method. | There is a usable confirmation, but no separate confirmation URL or measurable post-submit next-step state. |
| Trust at conversion | Verified legal/business context, partner-network wording, sample/QC/shipping process language and project-qualified MOQ language exist. | The evidence is mostly below the first CTA; there is no verified customer outcome or certification claim, which should remain unchanged. |
| Mobile | Header retains WhatsApp and menu; the header Request Quote button is hidden at widths ≤760 px. Inputs/buttons meet practical size targets; no horizontal overflow observed. | Mobile WhatsApp is easy to reach, but the form path is less discoverable and Contact’s form is far down the page. |
| Analytics | Consent-first direct GA4 foundation for `G-2ST51EB9GY`; GTM remains inactive. Form, WhatsApp and email events exist. | Baseline implementation is present, but generic CTA clicks and contextual CTA labels are not measured. Strict “no event object before consent” compliance also needs clarification/fix. |
| Numeric performance baseline | Not available in this audit because no GA4 report data was accessible. | Do not compare experiments using raw lead counts until a fixed date window, attribution rules and event definitions are recorded. |

## 2. Current conversion paths

### Path A — homepage, WhatsApp-first

`Homepage → hero/category/content WhatsApp CTA → wa.me → buyer continues externally`

This is the shortest path and is well suited to buyers who prefer chat. The site appends the current source page to the WhatsApp message in [`script.js`](/Users/haizhang/Documents/独立站/script.js:290), which is useful for attribution. The trade-off is that the external continuation is not a confirmed lead or quote submission; it is only a contact-intent event.

### Path B — homepage, RFQ-first

`Homepage → “Send Product Photo for Quote” / “Get Quote” → homepage #inquiry → main RFQ → Web3Forms → inline success message`

The form collects product type, quantity, destination and email as required on the homepage. The form is deep in a very long page, and the homepage also places catalog and sample micro-forms in the same conversion section. This increases choice and makes the exact form reached by a generic `#inquiry` link less obvious.

### Path C — header/contact RFQ

`Any page header “Request Quote” → /contact/#rfq-form → Contact page context/images → RFQ form → Web3Forms → inline success message`

The header route is semantically clear, but the form is far below the Contact hero. In the measured mobile view, the form begins around page Y=2921 px. The anchor should scroll there, but the buyer still lands in a long form section after a substantial amount of preceding content.

### Path D — commercial landing page, WhatsApp-first

`Commercial page → intent-specific WhatsApp CTA → wa.me → buyer continues externally`

Sampled pages use relevant labels such as “Request Custom Drinkware Quote”, “Request Wholesale Quote”, “Request Gift Set Plan” and “Request Low MOQ Test Quote”. These are useful intent signals, but they are all counted as the same `whatsapp_click` event without a reliable CTA label or product/intent parameter.

### Path E — commercial landing page, details-first

`Commercial page → “Send Quote Details” / “Send OEM/ODM Details” / similar → ../#inquiry → long homepage → homepage RFQ`

This is the most important path defect. On the sampled OEM, wholesale, 40oz tumbler, stainless tumbler, gift-set and low-MOQ pages, the secondary details CTA points to the homepage `#inquiry` rather than the Contact RFQ. A buyer who has already shown high intent is sent away from the page and into the longest route.

### Path F — direct email

`Homepage/Contact → mailto:hds.drinkware@gmail.com → buyer’s email client`

The email link is measurable as `email_click`, but an email click is not a delivered inquiry. The fallback mailto generated after an RFQ network failure includes the submitted data in the email body; this behavior is source-verified but was not triggered against production.

## 3. Homepage audit

### What works

- Within the H1 and introductory copy, the homepage clearly communicates custom drinkware, China sourcing, OEM/ODM support and B2B buyer types.
- The qualified “selected models / around 200 pcs” wording is consistent with the approved business-fact boundary; it does not make a universal 200-piece promise.
- Product-category navigation, sample-before-bulk language, packaging support, project-specific QC language and DDP/DDU coordination are all relevant to commercial buyers.
- The header provides persistent desktop WhatsApp and Request Quote actions.

### Friction and gaps

1. **Hero action is late.** At `1280 × 720`, the desktop hero shows the headline and part of the supporting copy, while the main hero buttons are below the viewport. At `390 × 844`, the mobile hero shows the image, headline and supporting copy, while the main hero CTA remains below the first screen. The floating WhatsApp control is visible, but it is not a substitute for a visible RFQ action.
2. **CTA hierarchy is ambiguous.** The hero and later sections use combinations of WhatsApp, Send Product Photo, Request Custom Logo Sample, Get Packaging Plan, Get Quote and email. The buyer is repeatedly asked to choose among actions without one consistently named primary RFQ action.
3. **The first-screen trust proof is light.** Verified trust signals exist in the page, but partner-network production evidence and more detailed process proof occur later. The first-screen area would benefit from a compact, factual trust strip adjacent to the CTA, using only existing approved facts.
4. **The homepage is overextended as a conversion surface.** It includes a long product/category library, factory/process evidence, capability content, buyer-type content, FAQ, a main RFQ, catalog capture and sample capture. This is valuable as a resource page but makes `#inquiry` an imprecise destination.
5. **Homepage Product Type is preselected.** The first product option is already selected, so the required select can pass without an explicit product choice. This reduces qualification quality and makes “required” less meaningful.

## 4. Commercial landing-page audit

### Strengths

- Sampled pages have clear intent-specific H1s: OEM/ODM, wholesale, 40oz tumblers, stainless tumblers, gift sets and low-MOQ testing.
- Commercial content covers buyer-relevant quote inputs: product reference, quantity, MOQ qualification, logo method, packaging, sample, QC scope, timing and destination-specific shipping discussion.
- The pages use qualified language such as “selected models”, “project-specific” and “confirmed in the quotation”. This should be preserved.
- Hero WhatsApp actions are visible on mobile in the sampled 40oz page at approximately Y=562 px, so product-page chat access is stronger than homepage RFQ access.

### High-intent weaknesses

- The sampled commercial pages contain no embedded or nearby RFQ form. The buyer must either leave for WhatsApp or follow a second-hop details CTA.
- The secondary CTA labels are contextual, but their destination is not: “Send Quote Details”, “Send OEM/ODM Details”, “Send Wholesale Order Details”, “Send Gift Packaging Details” and “Send Test Order Details” generally resolve to the homepage `#inquiry` form.
- CTA copy varies widely across the site. A sitewide scan found repeated variants including `Request Quote`, `Get Quote`, `Request Custom Drinkware Quote`, `Request OEM Project Review`, `Request Wholesale Quote`, `Request Gift Set Plan`, `Request Low MOQ Test Quote`, `Send Quote Details`, `Send OEM/ODM Details`, `Send RFQ Details` and `Use Quote Form`.
- The landing-page pages do not provide an explicit response-time expectation. This is a trust gap, but no response-time promise should be invented; add one only after the business verifies an SLA.
- Tables are wrapped for horizontal scrolling with a `680px` minimum width. This prevents page-wide overflow, but on mobile the buyer must discover the horizontal scroll and compare columns manually.

## 5. RFQ flow and field recommendations

### Current form structure

| Form | Visible controls | Required controls | Main differences |
| --- | ---: | ---: | --- |
| Homepage `drinkware-inquiry` | 13 | 4 | Uses `destination_country`, optional name/company/WhatsApp, optional logo/packaging/shipping/photo/details. Product has a default selected option. |
| Contact `drinkware-inquiry` | 10 | 5 | Uses `country`, requires Name, omits destination-city distinction, shipping term and reference-link field, and uses three textareas. |
| Homepage `catalog-download` | 1 | 1 | Business email only. |
| Homepage `sample-request` | 2 | 2 | Business email plus product name/photo link. |

### Recommended canonical schema

Use one RFQ schema and one canonical form route. The recommendation below is a CRO baseline, not an instruction to change production in this audit.

| Field | Recommendation | Reason |
| --- | --- | --- |
| Business email | **Required** | Stable follow-up channel and current form basis. |
| WhatsApp | **Optional**, or require email/WhatsApp as an either/or pair | Preserve chat-first buyers without making both channels mandatory. If implementing either/or, validate it explicitly. |
| Product type or product reference | **Required** | Needed to qualify the request. Use a true placeholder so the buyer actively chooses, or allow a reference link/photo description. |
| Approximate quantity | **Required** | Essential for MOQ and quote routing. Accept ranges such as `200–500` as well as a number. |
| Destination country / warehouse | **Required** | Needed for shipping discussion. Combine buyer country and destination unless the business needs both operationally. |
| Name | **Optional** | Contact currently requires it; it is not necessary to start a qualified B2B review. |
| Company | **Optional** | Useful qualification signal, but not worth blocking an early inquiry. |
| Logo method | **Optional** | Many buyers need advice; keep an “Unsure / need advice” option. |
| Packaging | **Optional** | Important for quote accuracy but not required to begin. |
| Shipping term | **Optional** | Keep as a helpful qualifier, not a blocker. |
| Product photo / reference link | **Optional but encouraged** | The current no-upload approach avoids upload friction. Keep a link field or support reply-by-email/WhatsApp as a fallback. |
| Project details | **Optional** | Prefer one clearly labelled field covering customization, packaging, launch timing and other notes. |
| Separate Contact-page customization, packaging and message textareas | **Remove or consolidate** | The current three-box structure adds vertical length and duplicates the homepage model. |

### RFQ success state baseline

The current JavaScript behavior is sensible: it disables the submit button, posts to Web3Forms, resets after confirmed success, shows an inline live status, and emits `form_submit_success` followed by `generate_lead`. The current copy says the RFQ was received and that HDS will follow up using the preferred contact method.

Recommended future confirmation content should add only verified process guidance:

- confirmation that the request was received;
- a short reminder of the information HDS reviews (product, quantity, destination, customization and packaging);
- a clear option to reply with artwork/reference files or continue on WhatsApp;
- no unverified response-time promise and no claim that the inquiry is already qualified.

## 6. CTA inventory and proposed hierarchy

### Current CTA families

| Family | Current examples | Current role |
| --- | --- | --- |
| RFQ/form | `Request Quote`, `Get Quote`, `Send Quote Details`, `Send Product Photo for Quote`, `Send RFQ Details` | Sometimes opens Contact; sometimes opens homepage `#inquiry`. |
| WhatsApp | `WhatsApp`, `Get Quote on WhatsApp`, `Ask Price on WhatsApp`, `Request Custom Drinkware Quote`, `Request Wholesale Quote` | Low-friction contact intent; opens an external chat. |
| Project-specific | `Request OEM Project Review`, `Request Gift Set Plan`, `Request Low MOQ Test Quote`, `Request Custom Logo Sample` | Good relevance, but not consistently connected to a specific form or event label. |
| Other capture | `Request Catalog`, `Request Sample Details`, `Get Packaging Plan` | Useful secondary capture; should remain visually subordinate to the qualified RFQ. |
| Email | `Send Inquiry by Email`, `Send RFQ by Email`, visible email address | Alternative contact path; not a confirmed lead. |

### Recommended hierarchy for future controlled changes

- **Primary CTA:** `Request a B2B Quote` → one canonical RFQ form, preferably `/contact/#rfq-form` after the form is consolidated.
- **Secondary CTA:** `Chat on WhatsApp` → contextual WhatsApp message with page/intent attribution.
- **Low-friction CTA:** `Ask About MOQ / Samples` → WhatsApp or a short, clearly labelled micro-form.

Keep intent-specific supporting copy around the CTA, but avoid making every CTA a different conversion concept. Standardize the destination and add a measured `cta_click` event before comparing wording.

## 7. Trust at point of conversion

### Verified evidence that can safely support conversion copy

The existing site and [`tools/business-facts.json`](/Users/haizhang/Documents/独立站/tools/business-facts.json) support the following qualified trust points:

- HDS Drinkware is the custom drinkware sourcing/OEM/ODM business operated by Shanxi Huandingsheng Industry and Trade Co., Ltd.; public location is Taiyuan, Shanxi, China.
- HDS works with long-term manufacturing partners in Yongkang and Jinhua, Zhejiang, coordinating product sourcing, customization, production follow-up, quality control, packaging and international shipping.
- Selected-model low MOQ may be around 200 pcs; the final MOQ depends on the product, color, decoration, packaging and production route.
- Samples, logo proofs, packaging and project-specific QC can be discussed and confirmed by project.
- DDP/DDU shipping coordination can be discussed by destination and project.

### Trust gaps to test, not fill with invented claims

- There is no verified public customer-name/testimonial/outcome module in the audited conversion path.
- There is no verified company-wide FDA, LFGB, SGS or ISO certification claim; the current governance correctly keeps compliance product- and project-specific.
- There is no verified universal response-time promise. Add an SLA only after owner confirmation.
- Partner-facility photos are useful evidence, but must retain partner-network wording and must not imply HDS owns every factory or line.

The safest near-term trust experiment is a compact “What you can confirm before bulk order” strip beside a CTA, using existing sample, written-specification, logo-proof, packaging and project-QC language.

## 8. Mobile CRO findings

| Finding | Severity | Evidence and implication |
| --- | --- | --- |
| Homepage RFQ action is below first screen | P1 | At `390 × 844`, the homepage first screen shows the hero image, H1 and supporting copy; the main hero buttons are below the viewport. WhatsApp remains available. |
| Mobile header hides Request Quote | P1 | At widths ≤760 px, CSS hides `.header-cta`, leaving WhatsApp and the menu. Form-first users must open the menu or scroll. |
| Commercial-page hero actions are visible | Pass / baseline | Sampled 40oz page showed both hero actions within the mobile viewport, but the form-first action still points to homepage `#inquiry`. |
| Contact RFQ is deep | P1 | The mobile Contact form begins around Y=2921 px because the page places product visuals and company context before the form. The anchor works conceptually, but the route is long. |
| Tap targets and inputs | Pass / baseline | Mobile header/menu/CTA controls and form controls are approximately 42–52 px high. No horizontal page overflow was observed. |
| Tables | P2 | Table wrappers intentionally scroll horizontally and use a 680 px minimum width. Add a visible scroll cue or a mobile comparison alternative in a future experiment. |
| Branding consistency | P2 | Homepage uses the image logo; Contact and sampled landing pages render a text `HDS` mark in the header. This is a small but visible trust inconsistency. |

## 9. Analytics and conversion measurement

### Current implementation coverage

The consent-first direct GA4 foundation is present in the page shells:

`website dataLayer → consent-first direct Google tag → GA4 G-2ST51EB9GY`

GTM remains inactive. The existing tests passed for:

- default consent denied;
- no GA4 loader before an analytics choice;
- accept loads/configures GA4 once;
- reject keeps GA4 blocked;
- withdrawal disables future GA4;
- RFQ event order and `generate_lead` only after confirmed success;
- no form values in the tested analytics payload.

Current event model:

| Event | Current coverage | CRO use |
| --- | --- | --- |
| `form_start` | First focus in any form | Form engagement and form-start denominator. |
| `rfq_submit` | Valid `drinkware-inquiry` submit before request | Submission attempt, not a lead. |
| `form_submit_success` | Web3Forms returns success | Delivered form submission. |
| `generate_lead` | Fired only after `form_submit_success` | Primary measured lead event for form submissions. |
| `form_submit_error` | Network/API failure | Operational failure monitoring. |
| `whatsapp_click` | `wa.me` link activation | Contact intent, not a confirmed lead. |
| `email_click` | `mailto:` activation | Contact intent, not a confirmed lead. |
| Primary CTA click | **Missing** | Cannot compare hero/header/product CTA performance. |

### Measurement gaps

1. **No generic CTA event.** The delegated click handler in [`script.js`](/Users/haizhang/Documents/独立站/script.js:305) only emits WhatsApp and email events. Hash links and internal `Request Quote` links are not measured.
2. **Unused tracking attributes.** Generated product WhatsApp links include `data-track-event` and `data-track-label`, but the click handler does not read them. Product/CTA-level reporting is therefore incomplete.
3. **Context is too coarse.** WhatsApp/email events capture page path and broad link location, but not a stable CTA label, intent family or product slug.
4. **Pre-consent dataLayer semantics need a strict review.** `trackConversionEvent()` pushes an event object to `window.dataLayer` before checking `window.hdsAnalyticsReady`. GA4 transport is gated, and the tests confirm GA4 is blocked before consent, but a strict requirement that no analytics event object be created before valid consent would still classify this as a gap. Preserve the consent architecture while deciding whether to buffer/drop pre-consent events.
5. **No production numeric baseline was captured.** No GA4 report values were available in this audit. Establish a fixed 28- or 30-day baseline before experiments.

### Required measurement contract before experiments

Add or approve a stable event contract with at least:

- `cta_click`: `cta_name`, `cta_role`, `cta_destination`, `page_path`, `intent_family`;
- `form_view` or a documented denominator for form starts;
- existing `form_start`, `rfq_submit`, `form_submit_success`, `generate_lead`, `form_submit_error`;
- existing `whatsapp_click` and `email_click`, augmented with stable CTA/page context;
- consent-safe behavior for every event.

Do not send form values, email addresses, WhatsApp numbers, names, company names or free-text RFQ content to GA4.

## 10. Prioritized issue register

| ID | Priority | Issue | Evidence | Recommended action |
| --- | --- | --- | --- | --- |
| CRO-01 | P1 | Commercial details CTAs route to homepage `#inquiry` | Sampled high-intent pages use `../#inquiry`; sampled pages have no local form. | Route all form-first details CTAs to one canonical RFQ form after schema consolidation. |
| CRO-02 | P1 | Homepage RFQ CTA is below first screen | Desktop and mobile screenshots/viewport measurements. | Test a shorter first-screen hero or place the canonical RFQ CTA beside the opening value proposition. |
| CRO-03 | P1 | Mobile header hides Request Quote | `.header-cta { display: none; }` at ≤760 px. | Test a compact dual action: Request Quote + WhatsApp, or keep a clearly labelled RFQ action in the mobile header/menu. |
| CRO-04 | P1 | Two different RFQ schemas | Homepage has 13 controls/4 required; Contact has 10/5 required and different names. | Consolidate to one schema and make Name optional. |
| CRO-05 | P1 | CTA clicks are not independently measured | No generic internal CTA tracking in `script.js`. | Add consent-safe `cta_click` before changing wording or layout. |
| CRO-06 | P1 | Strict pre-consent event interpretation is unresolved | `trackConversionEvent()` pushes to dataLayer before readiness check. | Review whether pre-consent in-memory event objects are permitted; buffer/drop if strict no-event policy applies. |
| CRO-07 | P2 | CTA wording and roles are inconsistent | Wide inventory of `Request`, `Get`, `Send`, `Ask`, `Plan` variants. | Standardize primary/secondary/low-friction roles while preserving intent context in supporting copy. |
| CRO-08 | P2 | Trust proof is not adjacent to most first CTAs | Verified process/evidence modules occur later in page flow. | Add a factual proof strip using only approved facts and partner-safe language. |
| CRO-09 | P2 | Product context is lost between landing page and form | `../#inquiry` does not prefill product/intent. | Test passing a non-PII product slug or selected product context into the canonical form. |
| CRO-10 | P2 | Mobile tables require discovery of horizontal scroll | `min-width: 680px` within overflow wrappers. | Test mobile cards/stacked comparisons or a visible scroll affordance. |
| CRO-11 | P2 | Header brand mark differs by page family | Homepage uses logo image; Contact/landing headers use text mark. | Normalize the approved logo treatment across conversion pages. |
| CRO-12 | P3 | Catalog/sample micro-forms compete with the main RFQ | Homepage has three forms in the inquiry region. | Keep them secondary and compare their lead quality against the main RFQ before expanding capture. |

## 11. Experiment backlog

The backlog is intentionally measurement-first. “Expected impact” is directional, not a forecast of a guaranteed uplift.

| Rank | Experiment | Hypothesis | Page | Change | Expected impact | Risk | Primary metric |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | Canonical RFQ destination | Sending high-intent buyers directly to one RFQ reduces path abandonment. | All commercial landing pages | Change secondary details CTAs from homepage `#inquiry` to `/contact/#rfq-form` or the approved canonical route. | High | May reduce homepage engagement or WhatsApp starts. | Details CTA → `form_start` → `generate_lead`. |
| 2 | Homepage hero action visibility | Buyers who see a clear RFQ action immediately are more likely to start a qualified inquiry. | Homepage | Shorten/rebalance hero content so RFQ and WhatsApp actions appear in the first desktop and mobile view. | High | Less visual storytelling above fold. | Hero `cta_click` rate and RFQ `form_start` rate by device. |
| 3 | Mobile dual CTA | Mobile users need both a form path and a chat path without opening navigation. | All mobile commercial pages | Test compact `Request Quote` + `WhatsApp` actions in the sticky header or bottom action bar. | High | Occlusion and reduced content area. | Mobile CTA click rate, RFQ starts, WhatsApp clicks. |
| 4 | Form schema simplification | Removing nonessential blocks and the required Name field increases completion without materially reducing qualification. | Canonical RFQ | Require email, product/reference, quantity and destination; make Name/company/WhatsApp and project details optional. | High | More low-quality or incomplete leads. | Start-to-submit rate and qualified-lead rate. |
| 5 | Product-context handoff | A preselected product/intent reduces repeated typing and improves lead relevance. | 40oz, stainless, gift-set, OEM/wholesale pages | Pass a non-PII page/product context into the RFQ form and show it for confirmation. | Medium-high | Incorrect context can misroute a request. | Form completion, correction rate, qualified-lead rate. |
| 6 | CTA naming hierarchy | One consistent primary action makes the next step easier to understand. | Homepage and commercial pages | Primary `Request a B2B Quote`; secondary `Chat on WhatsApp`; low-friction `Ask About MOQ / Samples`. | Medium-high | Generic wording may reduce intent relevance. | `cta_click` by role and downstream lead rate. |
| 7 | Trust strip at conversion | Factual reassurance near the action reduces perceived supplier risk. | Homepage hero; commercial-page hero | Add selected-model MOQ qualification, sample-before-bulk, project-specific QC and partner-network wording near CTA. | Medium | More copy density or legal review overhead. | CTA click-to-lead rate; scroll depth as secondary. |
| 8 | WhatsApp context quality | A clearer prefilled message reduces follow-up questions while retaining low friction. | WhatsApp CTAs | Standardize message fields: product/intent, quantity, logo, packaging and destination; keep source page attribution. | Medium | Long URL/message and buyer editing burden. | WhatsApp click rate and manually reviewed lead quality. |
| 9 | Direct response confirmation | Clear next-step guidance reduces uncertainty after submission. | RFQ success state | Add what HDS reviews next and how to send artwork/reference files; do not add an unverified SLA. | Medium | Overlong confirmation state. | Success-to-secondary-contact rate; support questions. |
| 10 | Catalog/sample capture positioning | Keeping micro-forms subordinate prevents diversion from the main qualified RFQ. | Homepage inquiry section | Move or visually de-emphasize catalog/sample forms and compare against the primary RFQ. | Medium | Lower catalog/sample volume. | Qualified RFQ share and lead quality by form. |
| 11 | Mobile table alternative | Easier comparison helps buyers reach the CTA after understanding options. | Commercial landing pages | Test stacked comparison cards or a visible scroll cue. | Low-medium | More page length and maintenance. | CTA reach/click rate after table section. |
| 12 | Brand consistency | Consistent identity treatment improves perceived legitimacy at the point of inquiry. | Contact and commercial pages | Use the approved logo image treatment in all conversion-page headers. | Low-medium | Small layout shift on narrow screens. | Form starts and qualitative trust feedback. |

## 12. Measurement baseline to capture before the next release

Because this audit did not have GA4 report access, the following values remain **TBD** and should be captured for a fixed 28- or 30-day window before the first experiment:

| Metric | Definition |
| --- | --- |
| Eligible sessions | Sessions landing on homepage or a sampled commercial page, split by device and landing page. |
| Primary CTA click rate | `cta_click` for the primary role ÷ eligible sessions. |
| WhatsApp click rate | `whatsapp_click` ÷ eligible sessions. |
| Email click rate | `email_click` ÷ eligible sessions. |
| RFQ start rate | `form_start` for `drinkware-inquiry` ÷ sessions reaching the canonical RFQ view. |
| RFQ completion rate | `form_submit_success` ÷ `form_start`. |
| RFQ error rate | `form_submit_error` ÷ RFQ submit attempts. |
| Generate-lead rate | `generate_lead` ÷ eligible sessions and ÷ RFQ starts. |
| Qualified-lead rate | CRM/manual review outcome ÷ delivered RFQs; this cannot be inferred from frontend events. |
| Path split | Share of contact intents from RFQ, WhatsApp and email, reported separately. |

Before comparing variants, freeze event names, form names, canonical route, consent behavior, attribution-window rules and the definition of a qualified lead. Do not use `rfq_submit` or `whatsapp_click` as if they were confirmed qualified leads.

## 13. Verification record

The following local checks passed on 2026-08-28:

```text
Validated RFQ form-name clobbering regression and analytics PII safety.
Validated consent foundation: default denied, reject blocked, accept loaded once, and withdrawal disabled future GA4.
Validated 70 indexable pages, 70 sitemap URLs and 74 HTML files.
```

No production form was submitted during the audit. The next safe step is to approve the canonical RFQ route and event contract, then run a controlled implementation review before changing CTA copy, layout or field requirements.
