# Entity and Evidence Governance

This document governs factual entity, operational and customer-project claims published by HDS Drinkware. The machine-readable sources are `tools/business-facts.json`, `tools/evidence-registry.json` and the non-public records under `tools/customer-projects/`.

## Publication rules

1. Existing website text is not evidence.
2. AI output is not evidence.
3. Customer and project claims require source records and explicit publication permission.
4. Factory photos require a documented facility relationship, provenance and public-use permission.
5. Numeric claims require verification, scope and qualification. An exceptional project must not become a universal promise.
6. Certifications require approved supporting documents for the exact entity or product scope claimed.
7. Customer outcomes require completion evidence. Delivery, satisfaction, launch, sales, repeat-order and performance claims remain unpublished until verified.
8. Active projects must never be described as completed.
9. Confidential customer identity, quotation pricing, private registration identifiers and complete private addresses must remain protected.
10. Unknown facts stay `pending` rather than being guessed.

Only a fact marked `public: true` with status `verified` or `qualified` may be rendered automatically. Records marked `pending` or `not-public` must never be published. A `not-applicable` record may only be used to explain that a broader claim is not approved—for example, that HDS does not make a company-wide certification claim.

## Facility evidence

Approved factory photos show activity at long-term manufacturing-partner facilities in Yongkang, Zhejiang, China. They support only what is visibly demonstrated and the owner-confirmed partner relationship. They do not prove HDS ownership, laboratory testing, ISO systems, certification, capacity, fixed inspection frequency or universal availability for every product.

Public captions and alt text must use relationship-safe wording such as “at an HDS manufacturing partner in Yongkang” and avoid “our factory” or “HDS-owned production line.”

## Customer projects

Internal customer-project records must separate owner approval, publication permission and project status. A record with `publicPage: false` must not generate a page, appear in navigation, enter the sitemap or be included in public AI-reference files. Sensitive source documents are registered by hash and evidence ID; their filesystem locations, personal data and prices are not stored in the public repository.

## Review workflow

Before publishing a new claim:

1. Add or update the evidence record.
2. Set the fact or project scope, status, public flag and evidence IDs.
3. Review privacy and customer-identification risk.
4. Update the generator source, never only generated HTML.
5. Run generator, schema, SEO regression, image and business-claim validation.
6. Review the staged diff before normal fast-forward deployment.
