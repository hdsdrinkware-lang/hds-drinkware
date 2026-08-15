# Site generation governance

`tools/generate-seo-site.mjs` is the controlled source for generated pages, shared schemas, navigation, asset versions, crawler files, sitemaps and AI-reference files.

## Commands

- `node tools/generate-seo-site.mjs --check` is read-only and fails when an output differs from its source.
- `node tools/generate-seo-site.mjs --write` writes controlled outputs only after protected-production checks pass.
- Running the generator without an argument is equivalent to `--check`.

The write guard blocks changes to existing indexable titles, meta descriptions, canonicals and JSON-LD. It also blocks changes to commercial `<main>` content, including the two manually authored specialist landing pages. The expected sitemap must contain exactly 70 unique URLs and all registered manual URLs.

## Ownership

- Product, guide, information and scenario templates remain in `tools/generate-seo-site.mjs`.
- Production improvements that pre-dated governance are stored as structured source records in `tools/page-sources/` and rendered through the shared page shell.
- Site constants, asset versions, manual-page registration and reconciled source ownership are in `tools/site-config.mjs`.
- The homepage, recycled-tumbler page, sublimation-tumbler page and German EPR guide retain manually authored content. The generator controls their shared header and asset versions without rewriting their `<main>` content.

Do not edit a generator-owned HTML output directly. Edit its generator data or reconciled source record, run `--write`, then run `--check` and `node tools/validate-site.mjs`.

## Regression baseline

`tools/seo-regression-baseline.json` records known duplicate paragraphs, excessive heading counts and numeric-claim contexts. Validation allows existing debt but fails when a repeated block spreads, heading counts increase, or a new numeric claim appears.

Only update the baseline after reviewing the full diff and confirming that it reflects an accepted content decision. Use:

`node tools/validate-site.mjs --write-baseline`

Structural failures, broken links, schema errors, sitemap errors, missing dimensions and inconsistent asset versions cannot be baselined.
