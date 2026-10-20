# RFQ design reference workflow

The HDS Drinkware RFQ form does not upload files directly and does not depend on Cloudflare R2, an upload Worker, upload-specific Turnstile, or a file-upload backend.

Customers can submit an inquiry without a design file. When a design or product reference is available online, the optional `design_link` field accepts a shareable HTTPS URL. The link should give the HDS team permission to access the file; links that require an additional sign-in may not be accessible. The form validates the URL format and HTTPS scheme but does not claim to verify that the external file is reachable.

If the design file is saved on the customer's device, submit the RFQ first, then email the file to [hds.drinkware@gmail.com](mailto:hds.drinkware@gmail.com) or send it via WhatsApp. Include the customer's name and product so the HDS team can match the file to the inquiry.

The normal submission path is:

1. Complete the required customer, product, quantity and contact fields.
2. Optionally provide an HTTPS design or product reference link.
3. Submit through the existing Web3Forms channel.
4. After Web3Forms reports success, use the email or WhatsApp follow-up route for any local design file.

This workflow keeps file contents, file names and local paths out of the website analytics payload. GA4 remains consent-gated and receives only the existing non-PII attribution and conversion events.
