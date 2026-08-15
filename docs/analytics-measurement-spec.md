# RFQ measurement specification

The site exposes a neutral `window.dataLayer` contract. No analytics vendor is installed.

| Event | Trigger | Interpretation |
| --- | --- | --- |
| `form_start` | First focus inside a form, once per form per page load | Form engagement, not a lead |
| `rfq_submit` | A valid `drinkware-inquiry` form is submitted immediately before the network request | RFQ attempt, not delivery or qualification |
| `form_submit_success` | Web3Forms returns an HTTP success response with `success: true` | Delivered form submission, not a qualified RFQ |
| `form_submit_error` | The endpoint rejects the request, returns an unsuccessful result, or the network request fails | Failed submission |
| `whatsapp_click` | A visitor activates a `wa.me` link | Contact intent, not a successful lead |
| `email_click` | A visitor activates a `mailto:` link | Contact intent, not a successful lead |

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
