# Analytics and RFQ measurement specification

## Current production architecture

The approved temporary production path is:

`website dataLayer → direct Google tag → GA4 G-2ST51EB9GY`

The site preserves a neutral `window.dataLayer` contract, but it does not load GTM in this release. The reserved future container is `GTM-5TKCQVL`. Its published container must remain inactive until it contains a reviewed Google tag and event mappings.

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

This release does not add a cookie banner or third-party consent-management platform. The temporary direct Google tag starts before a consent-management layer and may use Google Analytics first-party identifiers and cookies, including `_ga` and property-specific `_ga_*` cookies, when analytics storage is available. It also transmits ordinary measurement metadata such as page URL, referrer, device/browser information and pseudonymous identifiers to Google. The approved custom event parameters remain limited to the non-PII list above.

Before treating analytics as a permanent UK/EU production setup, the owner must approve a consent approach and privacy disclosure. The intended integration point is before the analytics loader in `<head>`. A future consent implementation should set the default consent state before Google tags load, update that state from an owner-approved CMP or first-party consent interface, and be verified with Google Tag Assistant. Do not add a CMP or claim UK/EU consent compliance without owner approval and legal review.

If analytics must be disabled pending consent review, remove or feature-disable the temporary direct loader through `siteConfig.analytics.mode`, regenerate the site and redeploy. Do not merely hide UI while leaving the loader active.

The privacy policy will need to disclose at least: the analytics purpose; Google as the measurement provider; categories of technical and event data; cookies or local identifiers used; retention settings; relevant international data transfers; the applicable legal basis and consent mechanism; how visitors can withdraw consent or disable analytics; and a contact route for privacy requests. Google documents Analytics cookie usage at https://developers.google.com/tag-platform/security/guides/cookies and Consent Mode at https://support.google.com/tagmanager/answer/10000067.
