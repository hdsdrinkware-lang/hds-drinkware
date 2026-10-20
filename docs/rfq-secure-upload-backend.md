# RFQ secure upload backend

This change adds Cloudflare Pages Functions for private RFQ design references. It is code-complete for mocked tests, but it is not production-ready until the required Preview bindings and secrets are configured and verified.

## Routes

- `POST /api/rfq/upload`: accepts one PDF, JPG/JPEG, PNG or WEBP file up to 10 MiB. It validates multipart content type, request size, extension, MIME type and file signature before writing a random `rfq/YYYY/MM/<uuid>.<extension>` key to R2.
- `GET /api/rfq/download`: validates a seven-day HMAC-SHA-256 signature, an allowed key prefix and expiry. It always returns `application/octet-stream` with `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff` and private no-store caching.
- `DELETE /api/rfq/upload`: accepts only a separate short-lived signed cleanup URL so a Web3Forms failure can remove the newly stored object.
- `GET /api/rfq/turnstile-config`: returns only the Preview environment's public `TURNSTILE_SITE_KEY` with `Cache-Control: no-store`; it never returns a secret.

## Required Preview configuration

Configure these in the Cloudflare Pages project for the Preview environment, then redeploy the branch:

| Name | Type | Purpose |
| --- | --- | --- |
| `RFQ_UPLOADS` | Private R2 bucket binding | Stores files; do not enable public access or `r2.dev` exposure. |
| `RFQ_UPLOAD_LIMITER_SERVICE` | Preview-only Pages Service Binding | Calls the dedicated `workers/rfq-upload-limiter` Worker before multipart parsing. |
| `RFQ_DOWNLOAD_SIGNING_SECRET` | Secret | HMAC-SHA-256 signing key; use a new high-entropy value per environment. |
| `TURNSTILE_SECRET_KEY` | Secret | Server-side Turnstile verification secret. |
| `TURNSTILE_SITE_KEY` | Public environment variable | Public site key returned by `/api/rfq/turnstile-config`; configure it only in the intended Preview environment. |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Environment variable | Optional comma-separated exact hostnames accepted from Siteverify; no wildcard values are accepted. The current request hostname is always accepted when Siteverify returns that same hostname. |

The contact page loads the official Turnstile script with explicit rendering, fetches the public site key at runtime, and calls `window.hdsSetTurnstileToken(token)` only from the widget success callback. Expired, errored and timed-out challenges clear the hidden token. The server rejects uploads when the secret, token, hostname, R2 binding or rate-limit binding is absent; it never defaults to allow.

Request protection is ordered as follows: the Pages Function calculates the existing hashed client key and calls `RFQ_UPLOAD_LIMITER_SERVICE` before any multipart parsing; the dedicated Worker applies its native Workers Rate Limiting binding, then the Pages request body is read through a bounded stream capped at `MAX_REQUEST_BYTES` (10 MiB plus 128 KiB multipart overhead), and only then is `formData()` called. Service failures and malformed responses fail closed with 503; a valid deny returns 429. This protects requests that omit `Content-Length` or provide an untrusted smaller value.

## Pages compatibility architecture

Cloudflare's Pages Functions bindings documentation lists only a subset of
bindings for Pages and does not list the Workers `ratelimits` binding. The
Workers Rate Limiting API is therefore isolated in a dedicated Worker. The
Worker is configured by `workers/rfq-upload-limiter/wrangler.toml.example` with
`workers_dev = false` and a conservative 5-per-60-second starting limit. The
example intentionally has no usable `namespace_id`: an unused positive integer
must be checked for this account before the config can be copied and deployed.
The Worker has no required public route and accepts only its internal protocol.

The repository has no installed Wrangler binary or package manifest. The
account-gated deployment must use Wrangler 4.36.0 or later, validate the real
configuration with `wrangler deploy --dry-run`, deploy only the Preview Worker,
and then add the Preview-only Pages Service Binding. No Worker, namespace,
binding or Production resource was created by this change.

## Retention and cleanup

The upload response contains a seven-day download URL. Configure an R2 lifecycle rule to delete `rfq/` objects after a documented retention period (recommended: 14 days) and retain the signed cleanup path for immediate Web3Forms failure cleanup. A lifecycle rule is not active until it is configured on the bucket.

## Production separation

Do not reuse Preview secrets or a Preview bucket for Production. Configure separate Production bindings only after the Preview flow, Web3Forms notification, consent regression and operational review are approved. This change does not create a bucket, rate-limit namespace, Turnstile widget, secret, DNS record or production configuration.

## Pricing references

- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/): Standard storage is listed at $0.015/GB-month, Class A at $4.50/million requests, Class B at $0.36/million requests, with a published free tier of 10 GB-month, 1M Class A and 10M Class B per month.
- [Cloudflare Turnstile plans](https://developers.cloudflare.com/turnstile/plans/): the Free plan is listed for most production applications; no paid resource is required by this code.
- [Cloudflare Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/): Pages supports a subset of bindings and documents Service Bindings for calling a Worker.
- [Cloudflare Workers Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/): rate-limit bindings use a namespace and a simple limit/period configuration; the API is eventually consistent and locality-scoped.
