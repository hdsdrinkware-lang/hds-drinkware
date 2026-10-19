# RFQ secure upload backend

This change adds Cloudflare Pages Functions for private RFQ design references. It is code-complete for mocked tests, but it is not production-ready until the required Preview bindings and secrets are configured and verified.

## Routes

- `POST /api/rfq/upload`: accepts one PDF, JPG/JPEG, PNG or WEBP file up to 10 MiB. It validates multipart content type, request size, extension, MIME type and file signature before writing a random `rfq/YYYY/MM/<uuid>.<extension>` key to R2.
- `GET /api/rfq/download`: validates a seven-day HMAC-SHA-256 signature, an allowed key prefix and expiry. It always returns `application/octet-stream` with `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff` and private no-store caching.
- `DELETE /api/rfq/upload`: accepts only a separate short-lived signed cleanup URL so a Web3Forms failure can remove the newly stored object.

## Required Preview configuration

Configure these in the Cloudflare Pages project for the Preview environment, then redeploy the branch:

| Name | Type | Purpose |
| --- | --- | --- |
| `RFQ_UPLOADS` | Private R2 bucket binding | Stores files; do not enable public access or `r2.dev` exposure. |
| `RFQ_UPLOAD_LIMITER` | Workers Rate Limiting binding | Anonymous upload protection; start with a conservative per-client limit such as 5 calls per 60 seconds and review observed traffic. |
| `RFQ_DOWNLOAD_SIGNING_SECRET` | Secret | HMAC-SHA-256 signing key; use a new high-entropy value per environment. |
| `TURNSTILE_SECRET_KEY` | Secret | Server-side Turnstile verification secret. |

The public Turnstile site key is not committed here. Configure a Preview-only widget for the Preview hostname and call `window.hdsSetTurnstileToken(token)` from the widget callback. The server rejects uploads when the secret, token, R2 binding or rate-limit binding is absent; it never defaults to allow.

## Retention and cleanup

The upload response contains a seven-day download URL. Configure an R2 lifecycle rule to delete `rfq/` objects after a documented retention period (recommended: 14 days) and retain the signed cleanup path for immediate Web3Forms failure cleanup. A lifecycle rule is not active until it is configured on the bucket.

## Production separation

Do not reuse Preview secrets or a Preview bucket for Production. Configure separate Production bindings only after the Preview flow, Web3Forms notification, consent regression and operational review are approved. This change does not create a bucket, rate-limit namespace, Turnstile widget, secret, DNS record or production configuration.

## Pricing references

- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/): Standard storage is listed at $0.015/GB-month, Class A at $4.50/million requests, Class B at $0.36/million requests, with a published free tier of 10 GB-month, 1M Class A and 10M Class B per month.
- [Cloudflare Turnstile plans](https://developers.cloudflare.com/turnstile/plans/): the Free plan is listed for most production applications; no paid resource is required by this code.
- [Cloudflare Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/): bindings are configured separately for Preview and Production.
- [Cloudflare Workers Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/): rate-limit bindings use a namespace and a simple limit/period configuration; the API is eventually consistent and locality-scoped.
