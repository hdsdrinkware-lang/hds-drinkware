# Phase 4G — Authority, Trust & Off-Site SEO

**Production site:** https://www.hdsdrinkware.com
**Audit date:** 2026-08-28 (Asia/Shanghai)
**Previous production commit:** `16fa5073a5d532732af56cea6c8106134d32dffc`
**Scope:** authority, trust, public entity evidence, external-link evidence, and off-site opportunity planning. This phase does not create profiles, submit directories, contact media, request links, request indexing, or expand on-site content.

## Final decision

**PASS — analysis and documentation only, with monitoring.**

The site has no external-link data in the inspected Search Console property and no manual action. Public search confirms that the HDS entity is discoverable, but it does not establish a meaningful earned-link profile. One relevant third-party sourcing article links to HDS Drinkware; this is recorded as a public mention, not as a Search Console-confirmed backlink. No disavow file or removal request is justified.

## Production baseline and change control

| Check | Result |
| --- | --- |
| Local `HEAD` | `16fa5073a5d532732af56cea6c8106134d32dffc` |
| `origin/main` | `16fa5073a5d532732af56cea6c8106134d32dffc` |
| Local branch | `phase1-reconcile` tracking `origin/main`; preserved as provided |
| Tracked production files before this document | Clean |
| Site code change required | No |
| New production page | None |
| External account/profile action | None |
| Outreach or link placement | None |
| Indexing request | None |

The checkout contains unrelated untracked user files. They were not inspected for this phase and are not included in the Phase 4G change.

## Search Console evidence

Property: `sc-domain:hdsdrinkware.com`
Report checked: Search Console **Links** report, 2026-08-28.

### External links

| Search Console field | Observed value |
| --- | ---: |
| External links total | **0** |
| Top linked pages | No data |
| Top linking sites | No data |
| Top linking text | No data |
| Export | The visible report showed no external rows to export |

The report is a sampled Search Console view, not a complete backlink database. “0” means no external-link rows were available in this property/report at audit time; it does not prove that the web contains no link to the domain. No backlink-tool subscription or complete link index was available, so domain authority, referring-domain counts, dofollow/nofollow totals, and historical link velocity are **not measured**.

### Manual actions

Search Console **Manual actions** displayed **“No issues detected”**. No reconsideration request, disavow file, or removal request is recommended.

## External-link and anchor assessment

Because Search Console returned no external rows, the following distributions are currently unquantified:

- external links by target page;
- referring domains by relevance and trust;
- anchor text by branded, URL, partial-match, exact-match, and generic classes;
- follow/nofollow or sponsored/UGC attributes;
- link age, velocity, and concentration;
- spam or scraper-link proportion.

The current known external-link baseline is therefore **0 Search Console rows / 0 measurable anchor rows**, with one separately observed public third-party citation documented below. Internal links are not backlinks and are intentionally excluded from this section.

## Public brand, entity, and mention audit

### Observed public results

| Source | Classification | Evidence and action |
| --- | --- | --- |
| HDS Drinkware homepage and official pages | A — owned, highly relevant | Publicly describes HDS Drinkware as the custom drinkware business operated by Shanxi Huandingsheng Industry and Trade Co., Ltd. This is the primary entity source. |
| BottleForge, “Custom Tumbler RFQ Guide” | B — legitimate, highly relevant | The article links to HDS Drinkware while discussing specification, supplier comparison, production-route verification, samples, QC, compliance, and landed cost. Record as an earned/public mention; do not assume Search Console has counted it. [Source](https://bottleforge.com/blog/custom-tumbler-rfq-guide-specifications-samples-qc-and-landed-cost.html) |
| Alibaba results for Shanxi Huandingsheng Industry and Trade Co., Ltd. | C — marketplace/profile candidate | Public search returned an Alibaba supplier/product result using the legal company name. Marketplace ownership, current account control, and exact product scope were not independently verified; do not add it to `sameAs` without first-party confirmation. [Observed result](https://www.alibaba.com/countrysearch/CN/water-old.html) |
| LinkedIn result for “HDS Marketing Inc” | E — unrelated/ambiguous | This is a different promotional-products business. It is excluded from HDS Drinkware’s entity graph and must not be cited as the HDS Drinkware profile. |
| D&B result for “Shanxi Heding Industry and Trade Co., Ltd.” | E — name collision | The legal name differs from Shanxi Huandingsheng Industry and Trade Co., Ltd. It is excluded from entity matching. |

Searches for `"HDS Drinkware"`, `"hdsdrinkware.com"`, and `"Shanxi Huandingsheng Industry and Trade Co., Ltd."` did not produce a verified LinkedIn, Facebook, Instagram, or YouTube profile controlled by HDS Drinkware. No reliable third-party unlinked mention count can be derived from public search alone; this remains **unquantified**.

### Entity consistency

The consistent public identity to use in any future first-party or partner profile is:

- **Public brand:** HDS Drinkware
- **Approved English business name:** Shanxi Huandingsheng Industry and Trade Co., Ltd.
- **Chinese legal name shown on the site:** 山西寰鼎盛工贸有限公司
- **Public location:** Taiyuan, Shanxi, China
- **Business description:** custom drinkware sourcing and OEM/ODM support for tumblers, bottles, cups, gift sets, packaging, samples, QC, and shipping coordination
- **Supply-chain qualifier:** manufacturing partners in Yongkang/Jinhua, Zhejiang; the site does not claim ownership of every partner factory or production line shown

Before any future listing is created or updated, match the legal name, public brand, domain, contact route, public location, and project-specific business scope. Do not publish private registration identifiers or a full street address unless the business owner explicitly approves them.

## Existing profile audit and `sameAs`

| Profile type | Status | Decision |
| --- | --- | --- |
| Official website | Verified and controlled | Keep as the canonical entity source |
| Alibaba | Public exact-name result; control not verified | Candidate only; verify ownership and account details before use |
| LinkedIn | No exact verified HDS Drinkware profile found | Do not create or claim |
| Facebook | No exact verified HDS Drinkware profile found | Do not create or claim |
| Instagram | No exact verified HDS Drinkware profile found | Do not create or claim |
| YouTube | No exact verified HDS Drinkware profile found | Do not create or claim |
| `sameAs` in current site output | None found | Correctly leave absent until an official controlled profile is verified |

No profile was created, edited, claimed, or contacted in this phase.

## Legitimate off-site opportunity research

These are business-development candidates, not backlink orders. Each should be pursued only if the commercial fit, eligibility, cost, and ability to provide accurate company information are confirmed by the business owner.

### Directories and marketplaces (maximum five candidates)

| Candidate | Fit | Opportunity score | Safe next step |
| --- | --- | ---: | --- |
| PPAI Industry Directory / Supplier membership | High for promotional drinkware and corporate-gift buyers; PPAI defines suppliers to include manufacturers, importers, decorators, and processors of promotional products | 9/10 | Confirm international-supplier eligibility, reference requirements, category fit, and total membership cost; then consider one accurate supplier profile. [PPAI membership](https://www.ppai.org/members/) |
| ASI supplier network / ESP+ | High for distributor-led promotional-product demand; ASI positions supplier membership as access to its distributor network | 9/10 | Request current supplier eligibility, product-data, and fee requirements; compare qualified leads, not link value. [ASI supplier membership](https://members.asicentral.com/supplier) |
| Alibaba supplier profile | High for China sourcing and existing exact-name discovery | 8/10 | Verify that the account is controlled by the business, that the legal entity/payment beneficiary matches, and that product claims are current. Do not duplicate listings. |
| Global Sources | Medium-high for trade-show and verified-supplier discovery | 7/10 | Check drinkware category, exhibitor costs, verification requirements, and whether participation would produce qualified buyer conversations. [Global Sources](https://www.globalsources.com/) |
| Made-in-China | Medium for China supplier discovery | 5/10 | Research only; proceed only after verifying paid-profile terms, entity controls, product evidence, and lead quality. No exact HDS profile was confirmed in this audit. |

Directory quality test: legitimate audience and buyer intent, transparent ownership, accurate entity data, editorial or verification standards, real commercial value, no requirement for keyword-stuffed anchor text, and no dependence on reciprocal or paid-link schemes.

### Associations and events

| Candidate | Relevance | Opportunity score | Notes |
| --- | --- | ---: | --- |
| PPAI / PPAI Expo | Promotional products, branded merchandise, corporate gifts | 9/10 | PPAI Expo 2027 is listed for Jan 12–14, 2027 in Las Vegas, with PPAI Advance on Jan 11. Confirm international supplier acceptance and exhibitor/member requirements. [Official event](https://www.ppai.org/expo/) |
| ASI Show and hosted-buyer events | Promotional distributors and supplier relationships | 8/10 | The official 2026 calendar includes future dates such as Louisville, Nashville, Phoenix, and Power House events; verify current availability and buyer qualification before budgeting. [Official event calendar](https://www.asishow.com/supplier/events-at-a-glance/) |
| HKTDC Hong Kong Gifts & Premium Fair | Gifts, premiums, housewares, and export buyers | 8/10 | The 2026 fair listing includes a searchable exhibitor list and supplier participation; monitor the next cycle and verify drinkware category placement. [Official exhibitor list](https://www.hktdc.com/event/hkgiftspremiumfair/en/exhibitor-list) |
| Ambiente, Messe Frankfurt | International consumer goods, tableware, gifting, and housewares | 7/10 | The official site lists Jan 29–Feb 2, 2027 in Frankfurt. Confirm product section and buyer profile before exhibiting. [Official event](https://ambiente.messefrankfurt.com/frankfurt/en.html) |
| Canton Fair | Large export-buyer ecosystem and China sourcing visibility | 7/10 | Use only if product category, phase, budget, and buyer-meeting plan justify it. Confirm the latest official phase/category information before registration. [Official fair site](https://cief.cantonfair.org.cn/) |

No membership, booth, sponsorship, exhibitor application, or event registration was made.

## Linkable assets and partner strategy

### Existing assets that can earn natural citations

The strongest existing assets are practical buyer resources rather than generic product pages:

1. custom tumbler RFQ and quotation guidance;
2. factory/supply-chain verification and production-route explanation;
3. drinkware quality-control checklist and inspection framework;
4. landed-cost, carton-data, and DDP/DDU planning guidance;
5. FDA vs. LFGB and destination-market compliance decision guidance;
6. representative case-study scenarios, clearly labeled as planning scenarios rather than customer testimonials;
7. product-specific pages for 40oz tumblers, logo bottles, stainless tumblers, gift sets, and corporate gifting.

The highest-value earned-link angle is a documented, genuinely useful buyer framework: a downloadable RFQ/QC checklist, original anonymized aggregate data, or a transparent case study with permission and evidence. Do not use invented customer names, unverifiable performance claims, or a manufactured “research” statistic.

### Partner and customer strategy

Prioritize relationships that already have a reason to cite HDS:

- promotional distributors and gift agencies that use HDS for a real customer project;
- packaging, inspection, freight, and compliance partners willing to reference a jointly documented workflow;
- customers who voluntarily publish a supplier case study after receiving permission to name the project;
- trade-show or association profiles that accurately describe HDS’s supplier role;
- industry educators and B2B publishers who need an expert explanation of MOQ, sample approval, QC, or landed-cost risk.

Natural anchor examples include `HDS Drinkware`, `custom drinkware sourcing guide`, `tumbler RFQ checklist`, `drinkware QC checklist`, and the naked domain. Avoid exact-match repetition such as “best custom drinkware supplier China” across multiple placements.

## Digital PR, expert contribution, and journalist-source opportunities

No outreach was performed. Suitable future channels include:

- PPAI/ASI trade-media commentary about promotional drinkware procurement;
- expert contributions on supplier verification, samples, compliance scope, packaging, and landed-cost comparison;
- Qwoted, which connects journalists with expert sources;
- Featured, which provides expert directories and media quote requests;
- Help a B2B Writer, which connects B2B writers with subject-matter sources.

These platforms are opportunities for genuine expertise, not link acquisition. A response should be specific, attributable, evidence-bounded, and useful even if no link is provided. [Qwoted](https://www.qwoted.com/), [Featured](https://featured.com/experts), and [Help a B2B Writer](https://helpab2bwriter.com/?locale=en_GB) were verified as active public services during this audit.

Recommended expert topics:

- how to compare tumbler quotes on the same specification;
- what a decorated sample does and does not prove;
- how to request exact-SKU compliance evidence;
- how carton dimensions change landed-cost comparisons;
- how startups can use selected stock models without confusing low MOQ with low risk.

## Competitor pattern review (maximum five)

This is a qualitative public-page review, not a backlink-count study. No third-party backlink index was available.

| Public competitor/resource | Pattern observed | Ethical HDS response |
| --- | --- | --- |
| Haers | Manufacturer-led sourcing guides, OEM/ODM explanations, factory evaluation, and product collections | Keep building evidence-led buyer guidance and show the boundary between sourcing coordination and factory ownership. [Example](https://www.haers.com/a-guide-for-brands-to-find-tumbler-supplier/) |
| STWADD | Buyer-resource hub covering manufacturer choice, material comparison, factory verification, MOQ, and lead time | Make HDS’s RFQ/QC/landed-cost framework easy to cite and download. [Resource hub](https://www.stwadd.com/guides/index.html) |
| Tombora Tumblers | Product collections supported by buying and export-packing guides | Pair commercial product pages with concise, genuinely useful buyer checklists. [Official site](https://www.sstumblers.com/) |
| Drinkware Supply Co. | Audience/event landing pages, quote path, gift packaging, and fulfillment positioning | Use only real audience-specific proof and project facts; do not copy unsupported client counts or testimonials. [Corporate gifting page](https://drinkwaresupply.com/corporate-gifts-drinkware) |
| JOOYO Drinkware | OEM, logo, packaging, QC, and certification topics presented as supplier education | Keep compliance language product- and market-specific, with document scope and evidence boundaries. [Official page](https://zsjooyo.com/fr/) |

Observed competitor patterns are content and commercial positioning patterns, not evidence of their backlink counts or authority. No competitor link replication campaign is recommended.

## Target-page strategy for future earned links

| Target page | Why it can earn a natural link | Preferred anchor family |
| --- | --- | --- |
| `/sourcing-guides/how-to-source-custom-tumblers-from-china/` | Broad supplier-evaluation and RFQ reference | branded, descriptive, naked URL |
| `/custom-drinkware-quality-control-checklist/` | Practical QC reference for buyers and partners | `drinkware QC checklist`, branded |
| `/sourcing-guides/how-to-calculate-landed-cost-importing-drinkware-china/` | Useful logistics and quote-comparison reference | `landed-cost guide`, descriptive |
| `/sourcing-guides/understanding-fda-vs-lfgb-standards-stainless-steel-drinkware/` | Compliance scope and destination-market explainer | `FDA vs. LFGB guide`, branded |
| `/factory-supply-chain/` | Entity and production-route verification context | `HDS supply chain`, branded |
| `/custom-drinkware-gift-sets/` | Packaging and corporate/event gifting examples | `custom drinkware gift sets`, descriptive |

Do not route every future mention to the homepage. Select the page that directly supports the citation, use natural anchors, and accept unlinked brand mentions where a link is not editorially appropriate.

## Monitoring plan

| Cadence | Check | Record |
| --- | --- | --- |
| Monthly | Search Console Links report | External total, top pages, linking sites, linking text, and export availability |
| Monthly | Search Console Manual actions | Status and any new issue details |
| Monthly | Brand/entity searches | Exact brand, domain, legal name, false positives, new profiles, and public citations |
| Quarterly | Profile/entity consistency | Domain, legal name, location, description, ownership, and `sameAs` eligibility |
| Quarterly | Opportunity pipeline | Directory eligibility, membership cost, event fit, accepted profile, qualified leads, and citation outcome |
| Quarterly | Earned-link quality | Relevance, editorial context, target page, anchor, link attribute, and whether the relationship is genuine |

Use a dated evidence log. Search Console samples and public search results can change; preserve the date, query, URL, and observed snippet for any future decision.

## Phase 4G required report

- **PHASE 4G status:** PASS — analysis/documentation only; monitor authority growth.
- **Previous production commit:** `16fa5073a5d532732af56cea6c8106134d32dffc`.
- **New production commit:** None; this phase adds documentation only.
- **Code change required:** No.
- **Deployment:** No site deployment required.
- **Current page count:** 70 sitemap/indexable pages at the Phase 4F baseline.
- **GSC link stats:** 0 external links; no top linked pages, linking sites, or linking text rows; 275 internal links in the separate internal report.
- **Top linked pages/domains/anchors:** None available from the external report.
- **Manual action:** None detected.
- **External-linked page count:** 0 pages in the external report.
- **Referring-domain count:** 0 in the external report; complete-web count unavailable.
- **Anchor profile:** 0 measurable external anchors; no distribution can be claimed.
- **Public mentions:** One relevant third-party HDS citation found; unlinked-mention count unquantified.
- **Profiles:** Official website verified; Alibaba exact-name marketplace result is unverified; no verified official social profiles found.
- **`sameAs`:** None added; no verified controlled profile qualifies.
- **Directory candidates:** PPAI, ASI, Alibaba, Global Sources, Made-in-China, subject to eligibility and ownership checks.
- **Associations/events:** PPAI/Expo, ASI events, HKTDC Gifts & Premium Fair, Ambiente, Canton Fair.
- **Linkable assets:** RFQ, QC, landed-cost, compliance, supply-chain, product, and clearly labeled scenario resources.
- **PR/expert/journalist:** PPAI/ASI trade media; Qwoted; Featured; Help a B2B Writer. No outreach performed.
- **Competitor patterns:** Resource hubs, audience/event pages, product collections, and supplier education; no backlink counts available.
- **Opportunity scores:** 5/10 to 9/10; highest fit is PPAI/ASI plus evidence-led buyer resources.
- **Target pages:** RFQ, QC, landed-cost, compliance, supply-chain, and gift-set pages listed above.
- **Request/indexing:** None.
- **Documentation:** This file, `docs/seo/authority-trust-phase-4g.md`.
- **Blockers:** Search Console external report is empty; no complete backlink index or verified official social profiles were available; these limit quantification but do not block safe planning.
- **Next phase:** Recheck external links and manual actions after genuine business relationships, profiles, events, or earned citations exist; keep authority work separate from manipulative link building and on-site content expansion.
