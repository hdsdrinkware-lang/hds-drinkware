# Reconciled page sources

These JSON records preserve approved production improvements that existed before generator governance. They contain page-specific metadata, hero markup, body content and page schemas; `generate-seo-site.mjs` renders them through the shared shell.

Edit these records rather than their generated HTML outputs. A generator write is blocked if it would change protected metadata, schemas or commercial `<main>` content without an explicit source change and review.
