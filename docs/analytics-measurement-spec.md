# Analytics and RFQ measurement specification

## Current production architecture

The approved temporary production path is:

`website dataLayer → consent-first direct Google tag → GA4 G-2ST51EB9GY`

The site preserves a neutral `window.dataLayer` contract and does not load GTM in this release. The reserved future container is `GTM-5TKCQVL`; its published container must remain inactive until it contains reviewed mappings.

Before a visitor chooses, the shared bootstrap sets `analytics_storage`, `ad_storage`, `ad_user_data` and `ad_personalization` to `denied`, and does not append the GA4 loader or send page views/events. `Accept Analytics` stores only `{choice, updatedAt}` in local storage for 180 days, then loads the direct tag once. `Reject Optional` stores the rejection and keeps GA4 blocked. Cookie Settings can grant or withdraw the choice; withdrawal disables future GA4 collection on that browser. Advertising storage remains denied in every state.

There must be exactly one analytics consumer. Before migrating to `website dataLayer → GTM → GA4`, remove the temporary direct Google tag, publish the reviewed GTM container, and validate that page views and lead events are not duplicated.

| Event | Trigger | Interpretation |
| --- | --- | --- |
| `form_start` | First focus inside a form, once per form per page load | Form engagement, not a lead |
| `rfq_submit` | A valid `drinkware-inquiry` form is submitted immediately before the network request | RFQ attempt, not delivery or qualification |
| `form_submit_success` | Web3Forms returns an HTTP success response with `success: true` | Delivered form submission, not a qualified RFQ |
| `form_submit_error` | The endpoint rejects the request, returns an unsuccessful result, or the network request fails | Failed submission |
| `whatsapp_click` | A visitor activates a `wa.me` link | Contact intent, not a successful lead |
| `email_click` | A visitor activates a `mailto:` link | Contact intent, not a successful lead |

Direct GA4 receives the six neutral events above. It receives one additional recommended event, `generate_lead`, only after `form_submit_success`. A click, submission attempt, WhatsApp click or email click must never emit `generate_lead`.

## Approved parameters

- `form_name`
- `form_location`
- `page_path`
- `landing_page` without query parameters
- `initial_referrer_domain`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `link_location`
- `contact_method`

Do not send names, companies, email addresses, phone numbers, form messages, artwork links, WhatsApp message bodies or complete destination URLs into analytics.

For `email_click` and `whatsapp_click`, use only `page_path`, a fixed `link_location` category and `contact_method`. Do not derive analytics values from link text, `mailto:` links, WhatsApp URLs or their prefilled messages.

## Qualified RFQ

`qualified_rfq` must not fire from frontend code.

A qualified RFQ is a genuine B2B sourcing inquiry with a valid contact method, identifiable product requirement, approximate or confirmed quantity, and sufficient purchasing intent for HDS to evaluate quotation feasibility.

Qualification is manual until a future CRM or server-side workflow is approved. A future implementation should record the original submission identifier and send the event from the trusted CRM/server environment, without placing customer PII in analytics.

## Consent and privacy readiness

**PRIVACY FOLLOW-UP REQUIRED**

This release adds a lightweight first-party consent banner and persistent Cookie Settings link. It is not a third-party CMP and does not claim full UK/EU consent compliance. When accepted, Google Analytics may use first-party identifiers such as `_ga` and property-specific `_ga_*` cookies and transmit ordinary measurement metadata such as page path, referrer domain, device/browser information and pseudonymous identifiers. The approved custom event parameters remain limited to the non-PII list above.

The RFQ form remains an independent Web3Forms business-processing path. Buyer-entered name, email, phone, WhatsApp number, company details, message and artwork fields may be sent to Web3Forms as required to process the inquiry; they are not analytics parameters. No RFQ form content, full mailto URL, full WhatsApp URL or user-entered value may be sent to GA4. The owner should also disable GA4 Enhanced Measurement outbound-click collection if the property would otherwise transmit complete contact URLs.

Before treating analytics as a permanent UK/EU production setup, the owner must approve a consent approach and privacy disclosure. The intended integration point is before the analytics loader in `<head>`. A future consent implementation should set the default consent state before Google tags load, update that state from an owner-approved CMP or first-party consent interface, and be verified with Google Tag Assistant. Do not add a CMP or claim UK/EU consent compliance without owner approval and legal review.

If analytics must be disabled pending consent review, set the stored choice to rejected or feature-disable the direct loader through `siteConfig.analytics.mode`, regenerate the site and redeploy. Do not merely hide UI while leaving the loader active.

The factual implementation page is `/privacy-policy/` and remains `noindex` pending owner/legal approval. The final privacy policy will need to disclose at least: the analytics purpose; Google as the measurement provider; categories of technical and event data; cookies or local identifiers used; retention settings; relevant international data transfers; the applicable legal basis and consent mechanism; how visitors can withdraw consent or disable analytics; Web3Forms as a separate RFQ processor; and a contact route for privacy requests. Google documents Analytics cookie usage at https://developers.google.com/tag-platform/security/guides/cookies and Consent Mode at https://support.google.com/tagmanager/answer/10000067.
