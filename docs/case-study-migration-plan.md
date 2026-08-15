# Scenario and customer-project migration plan

This document is a proposal only. Phase 1 does not change scenario URLs, index directives, titles, H1s or redirects.

## Current state

- Hub: `/case-studies/`
- Five child URLs remain under `/case-studies/`.
- The content is illustrative RFQ planning material, not verified customer evidence.
- Navigation uses the label **RFQ Planning Examples**.

## Proposed scenario presentation

- Hub title: `Custom Drinkware RFQ Planning Examples | HDS Drinkware`
- Hub H1: `RFQ Planning Examples for Custom Drinkware Buyers`
- Child titles: `[Use case] RFQ Planning Example | HDS Drinkware`
- Child H1s: `[Use case]: Sourcing Scenario and RFQ Checklist`

Keep the current URLs initially to avoid unnecessary redirects and preserve any existing link or crawl history. Update internal anchor text at the same time as the future title/H1 release so no link implies a verified customer outcome.

The hub can remain indexable if it remains useful and clearly labelled. The five illustrative child pages should be considered for `noindex, follow` until they are materially differentiated or supported by verifiable project evidence. This recommendation requires a separate approval before execution.

## Future verified evidence

Publish verified, permissioned customer evidence under `/customer-projects/`. Do not mix it with illustrative scenarios. Each future project must have evidence for the described product, scope and outcome, plus approval for any customer-identifying information.

No redirects are needed while scenario URLs remain unchanged. If a later release moves scenarios to `/rfq-planning-examples/`, create the destination pages first, update canonicals, sitemap and internal links, and then add one-to-one permanent redirects. Do not redirect unrelated scenarios to a generic hub.
