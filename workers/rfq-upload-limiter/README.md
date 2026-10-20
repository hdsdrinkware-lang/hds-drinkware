# Preview RFQ upload limiter Worker

This Worker is the compatibility layer for the Pages Function. Pages Functions
call it through the `RFQ_UPLOAD_LIMITER_SERVICE` Service Binding; only this
Worker owns the native Workers `RFQ_UPLOAD_LIMITER` Rate Limiting binding.

The source accepts only `POST /__internal/rfq/upload/limit` with the exact
protocol header and a single, server-generated `rfq-upload:<sha256>` key. It
has no public route requirement, emits no customer or IP logs, and fails closed
for malformed requests, missing bindings, binding exceptions, and malformed
binding responses.

## Account-gated setup

1. Check the current Wrangler CLI and Cloudflare account configuration.
2. Verify an unused positive integer namespace ID for this account. Do not
   guess or reuse an ID; the example config intentionally contains no usable
   namespace ID.
3. Copy `wrangler.toml.example` to `wrangler.toml`, replace the placeholder,
   uncomment the `ratelimits` block, and validate with `wrangler deploy --dry-run`.
4. Deploy only the Preview Worker with `workers_dev = false`.
5. Add a Preview-only Pages Service Binding named
   `RFQ_UPLOAD_LIMITER_SERVICE` pointing to this Worker, then redeploy Pages.

Production bindings and secrets are intentionally out of scope.
