const form = document.querySelector(".quote-form");
const formStatus = document.querySelector(".form-status");
const salesEmail = "hds.drinkware@gmail.com";
const whatsappUrl = "https://wa.me/8613994271614?text=Hello%20HDS%20Drinkware%2C%20I%20would%20like%20to%20request%20a%20custom%20drinkware%20quotation.";
const catalogGrid = document.querySelector("#catalog-grid");

const catalogProducts = [
  ["40oz Handle Tumbler", "40oz series", "40oz-handle-tumbler.jpg"],
  ["40oz Ice Tumbler", "40oz series", "40oz-ice-tumbler.jpg"],
  ["Blue 40oz Tumbler", "40oz series", "blue-40oz-tumbler.jpg"],
  ["20oz Stainless Tumbler", "20oz series", "20oz-stainless-tumbler.jpg"],
  ["20oz Straight Tumbler", "20oz series", "20oz-straight-tumbler.jpg"],
  ["30oz Car Tumbler", "Car cup", "30oz-car-tumbler.jpg"],
  ["30oz Stainless Cup", "30oz series", "30oz-stainless-cup.jpg"],
  ["32oz Space Bottle", "32oz series", "32oz-space-bottle.jpg"],
  ["12oz Stainless Cup", "12oz series", "12oz-stainless-cup.jpg"],
  ["2oz Stainless Mini Cup", "Mini cup", "2oz-stainless-mini-cup.jpg"],
  ["Bone China Camping Mug", "Camping mug", "bone-china-camping-mug.jpg"],
  ["800ml Cartoon Water Bottle", "Kids and gift", "800ml-cartoon-water-bottle.jpg"],
  ["Bear Glass Cup", "Glass cup", "bear-glass-cup.jpg"],
];

const catalogCopy =
  "Logo, color, packaging, sample, and bulk quotation support available for wholesale and gift buyers.";

const trackConversionEvent = (eventName, params = {}) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};

if (catalogGrid) {
  catalogGrid.innerHTML = catalogProducts
    .map(([name, tag, image]) => {
      const message = encodeURIComponent(
        `Hello HDS Drinkware, I am interested in ${name}. Please send MOQ, price range, logo options, sample details, and packaging options.`
      );

      return `
        <article class="catalog-card">
          <img src="assets/catalog/${image}" alt="${name} for custom logo drinkware sourcing" loading="lazy" />
          <div>
            <span class="tag">${tag}</span>
            <h3>${name}</h3>
            <p>${catalogCopy}</p>
            <div class="product-actions">
              <a class="product-whatsapp" href="https://wa.me/8613994271614?text=${message}" target="_blank" rel="noopener" data-track-event="whatsapp_click" data-track-label="${name}">Ask Price on WhatsApp</a>
              <a class="product-quote" href="#inquiry" data-track-event="quote_click" data-track-label="${name}">Request Quote</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

const buildMailtoUrl = (data) => {
  const email = data.get("email") || "";
  const whatsapp = data.get("whatsapp") || "";
  const contact = [email, whatsapp].filter(Boolean).join(" / ") || data.get("contact") || "";
  const lines = [
    "New drinkware inquiry for Shanxi Huandingsheng Industry and Trade Co., Ltd. / HDS Drinkware",
    "",
    `Name: ${data.get("name") || ""}`,
    `Company: ${data.get("company") || ""}`,
    `Email or WhatsApp: ${contact}`,
    `Country: ${data.get("country") || ""}`,
    `Destination: ${data.get("destination_country") || ""}`,
    `Product Interest: ${data.get("product") || ""}`,
    `Quantity: ${data.get("quantity") || ""}`,
    `Logo Requirement: ${data.get("logo_requirement") || ""}`,
    `Packaging Requirement: ${data.get("packaging_requirement") || ""}`,
    `Shipping Term: ${data.get("shipping_term") || ""}`,
    `Product Photo / Link: ${data.get("photo_link_upload") || ""}`,
    "",
    "Message:",
    data.get("details") || "",
  ];

  const subject = encodeURIComponent("HDS custom drinkware RFQ");
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${salesEmail}?subject=${subject}&body=${body}`;
};

// Generic form submit handler for Web3Forms static hosting compatibility
document.querySelectorAll("form").forEach((formElement) => {
  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    trackConversionEvent("contact_form_submit", {
      form_name: formElement.getAttribute("name") || "unknown",
      page_path: window.location.pathname,
    });

    const data = new FormData(formElement);
    let statusText = "Sending your request...";
    let successText = "Thank you! Your submission has been received successfully.";

    // Custom success texts based on form
    if (formElement.name === "catalog-download") {
      statusText = "Preparing your catalog...";
      successText = "Thank you! Your download request has been received. We will email the catalog to you shortly.";
    } else if (formElement.name === "sample-request") {
      statusText = "Checking sample availability...";
      successText = "Thank you! Your stock sample request has been received. We will contact you to coordinate shipping.";
    } else if (formElement.name === "drinkware-inquiry") {
      statusText = "Sending your inquiry...";
      successText = "Thank you. Our sales team will contact you within 12 hours.";
    }

    // Set status message
    let statusDisplay = formElement.querySelector(".form-status");
    if (!statusDisplay) {
      statusDisplay = document.createElement("p");
      statusDisplay.className = "form-status";
      formElement.appendChild(statusDisplay);
    }
    statusDisplay.classList.remove("is-error");
    statusDisplay.style.color = "inherit";
    statusDisplay.textContent = statusText;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Form submission failed");
      }

      formElement.reset();
      statusDisplay.textContent = successText;
      statusDisplay.style.color = "var(--teal)";
      trackConversionEvent("lead_submit_success", {
        form_name: formElement.getAttribute("name") || "unknown",
        page_path: window.location.pathname,
      });
    } catch (error) {
      statusDisplay.classList.add("is-error");
      statusDisplay.style.color = "var(--coral)";
      if (formElement.name === "drinkware-inquiry") {
        statusDisplay.textContent = "Opening email as a backup. You can send the prepared inquiry directly.";
        window.location.href = buildMailtoUrl(data);
      } else {
        statusDisplay.textContent = "Submission failed. Please email us directly at hds.drinkware@gmail.com";
      }
    }
  });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href], button");
  if (!link) return;

  const href = link.getAttribute("href") || "";
  const explicitEvent = link.dataset.trackEvent;
  const eventName = explicitEvent || (href.includes("wa.me") ? "whatsapp_click" : href.includes("#inquiry") ? "quote_click" : "");
  if (!eventName) return;

  trackConversionEvent(eventName, {
    link_text: link.textContent.trim().slice(0, 80),
    link_url: href,
    label: link.dataset.trackLabel || "",
    page_path: window.location.pathname,
  });
});

const revealItems = document.querySelectorAll(
  ".section-heading, .product-card, .facts-grid article, .process-grid article, .buyer-grid article, .faq-grid article, .quality-image, .quality-copy, .factory-copy, .factory-gallery, .market-copy, .market-image, .brand-logo-panel, .brand-story .intro-copy"
  + ", .line-grid article, .catalog-card, .capability-copy, .capability-grid article, .timeline-grid article, .why-card, .proof-card, .ai-answer-copy, .ai-answer-grid article, .ai-rfq-panel, .landing-detail article, .landing-faq article, .landing-cta-band"
);

revealItems.forEach((item) => item.classList.add("reveal-on-scroll"));

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const whatsappWidget = document.querySelector(".whatsapp-widget");
const whatsappToggle = document.querySelector(".whatsapp-toggle");
const whatsappPanel = document.querySelector(".whatsapp-panel");

whatsappToggle?.addEventListener("click", () => {
  if (window.matchMedia("(max-width: 760px)").matches) {
    window.open(whatsappUrl, "_blank", "noopener");
    return;
  }

  const isOpen = whatsappWidget?.classList.toggle("is-open") || false;
  whatsappToggle.setAttribute("aria-expanded", String(isOpen));
  whatsappPanel?.setAttribute("aria-hidden", String(!isOpen));
});
