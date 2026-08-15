const form = document.querySelector(".quote-form");
const formStatus = document.querySelector(".form-status");
const salesEmail = "hds.drinkware@gmail.com";
const whatsappUrl = "https://wa.me/8613994271614?text=Hello%20HDS%20Drinkware%2C%20I%20would%20like%20to%20request%20a%20custom%20drinkware%20quotation.";
const catalogGrid = document.querySelector("#catalog-grid");
window.dataLayer = window.dataLayer || [];

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
  window.dataLayer.push({ event: eventName, ...params });
};

const attributionParameterNames = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "msclkid",
];

const readSessionValue = (key) => {
  try {
    return window.sessionStorage.getItem(key) || "";
  } catch (error) {
    return "";
  }
};

const writeSessionValue = (key, value) => {
  if (!value) return;
  try {
    if (!window.sessionStorage.getItem(key)) {
      window.sessionStorage.setItem(key, value);
    }
  } catch (error) {
    // Attribution still works for the current page when storage is unavailable.
  }
};

const currentSearchParameters = new URLSearchParams(window.location.search);
writeSessionValue("hds_landing_page", `${window.location.pathname}${window.location.search}`);
writeSessionValue("hds_initial_referrer", document.referrer || "(direct)");
attributionParameterNames.forEach((name) => {
  writeSessionValue(`hds_${name}`, currentSearchParameters.get(name) || "");
});

const getAttributionData = () => {
  const values = {
    page_url: window.location.href,
    page_path: window.location.pathname,
    landing_page: readSessionValue("hds_landing_page") || `${window.location.pathname}${window.location.search}`,
    initial_referrer: readSessionValue("hds_initial_referrer") || document.referrer,
  };

  attributionParameterNames.forEach((name) => {
    values[name] = readSessionValue(`hds_${name}`) || currentSearchParameters.get(name) || "";
  });

  return values;
};

const getAnalyticsContext = () => {
  const attribution = getAttributionData();
  let initialReferrerDomain = "";
  try {
    initialReferrerDomain = attribution.initial_referrer && attribution.initial_referrer !== "(direct)"
      ? new URL(attribution.initial_referrer).hostname
      : "(direct)";
  } catch (error) {
    initialReferrerDomain = "";
  }
  const safeCampaignValue = (value) => String(value || "").replace(/[\r\n]/g, " ").slice(0, 100);
  return {
    page_path: window.location.pathname,
    landing_page: String(attribution.landing_page || "").split("?")[0],
    initial_referrer_domain: initialReferrerDomain,
    utm_source: safeCampaignValue(attribution.utm_source),
    utm_medium: safeCampaignValue(attribution.utm_medium),
    utm_campaign: safeCampaignValue(attribution.utm_campaign),
  };
};

const getFormName = (formElement) => formElement.getAttribute("name") || "";

const getFormEventParameters = (formElement) => ({
  form_name: getFormName(formElement) || "unknown",
  form_location: window.location.pathname === "/contact/" ? "contact_page" : "site_page",
  ...getAnalyticsContext(),
});

document.querySelectorAll(".mobile-navigation").forEach((menu) => {
  const summary = menu.querySelector("summary");
  summary?.addEventListener("keydown", (event) => {
    if (!["Enter", " ", "Spacebar"].includes(event.key)) return;
    event.preventDefault();
    menu.open = !menu.open;
  });
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.removeAttribute("open"));
  });
});

const setHiddenFormValue = (formElement, name, value) => {
  let input = formElement.querySelector(`input[type="hidden"][name="${name}"]`);
  if (!input) {
    input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    formElement.appendChild(input);
  }
  input.value = value;
};

const prepareFormAttribution = (formElement) => {
  const attribution = getAttributionData();
  setHiddenFormValue(formElement, "lead_form", getFormName(formElement) || "unknown");
  Object.entries(attribution).forEach(([name, value]) => {
    setHiddenFormValue(formElement, name, value);
  });
  return attribution;
};

if (catalogGrid) {
  catalogGrid.innerHTML = catalogProducts
    .map(([name, tag, image]) => {
      const message = encodeURIComponent(
        `Hello HDS Drinkware, I am interested in ${name}. Please send MOQ, price range, logo options, sample details, and packaging options.`
      );

      return `
        <article class="catalog-card">
          <img src="assets/catalog/${image}" alt="${name} for custom logo drinkware sourcing" width="900" height="900" loading="lazy" decoding="async" />
          <div>
            <span class="tag">${tag}</span>
            <h3>${name}</h3>
            <p>${catalogCopy}</p>
            <div class="product-actions">
              <a class="product-whatsapp" href="https://wa.me/8613994271614?text=${message}" target="_blank" rel="noopener" data-track-event="whatsapp_click" data-track-label="${name}">Ask Price on WhatsApp</a>
              <a class="product-quote" href="#inquiry" data-track-label="${name}">Request Quote</a>
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
    `Destination: ${data.get("country") || data.get("destination_country") || ""}`,
    `Product Interest: ${data.get("product") || ""}`,
    `Quantity: ${data.get("quantity") || ""}`,
    `Customization Requirement: ${data.get("customization_requirements") || data.get("logo_requirement") || ""}`,
    `Packaging Requirement: ${data.get("packaging_requirements") || data.get("packaging_requirement") || ""}`,
    `Shipping Term: ${data.get("shipping_term") || ""}`,
    `Product Photo / Link: ${data.get("photo_link_upload") || ""}`,
    `Source Page: ${data.get("page_url") || ""}`,
    `Landing Page: ${data.get("landing_page") || ""}`,
    `Initial Referrer: ${data.get("initial_referrer") || ""}`,
    `Campaign: ${data.get("utm_campaign") || ""}`,
    "",
    "Message:",
    data.get("message") || data.get("details") || "",
  ];

  const subject = encodeURIComponent("HDS custom drinkware RFQ");
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${salesEmail}?subject=${subject}&body=${body}`;
};

// Generic form submit handler for Web3Forms static hosting compatibility
document.querySelectorAll("form").forEach((formElement) => {
  prepareFormAttribution(formElement);

  formElement.addEventListener("focusin", () => {
    if (formElement.dataset.formStarted === "true") return;
    formElement.dataset.formStarted = "true";
    trackConversionEvent("form_start", getFormEventParameters(formElement));
  });

  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }
    prepareFormAttribution(formElement);
    const formName = getFormName(formElement);
    if (formName === "drinkware-inquiry") {
      trackConversionEvent("rfq_submit", getFormEventParameters(formElement));
    }

    const data = new FormData(formElement);
    const submitButton = formElement.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    let statusText = "Sending your request...";
    let successText = "Thank you! Your submission has been received successfully.";

    // Custom success texts based on form
    if (formName === "catalog-download") {
      statusText = "Preparing your catalog...";
      successText = "Thank you! Your catalog request has been received. We will email the catalog to you shortly.";
    } else if (formName === "sample-request") {
      statusText = "Checking sample availability...";
      successText = "Thank you! Your stock sample request has been received. We will contact you to coordinate shipping.";
    } else if (formName === "drinkware-inquiry") {
      statusText = "Sending your inquiry...";
      successText = "Thank you. Your RFQ has been received. The HDS team will review the details and follow up using your preferred contact method.";
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
      trackConversionEvent("form_submit_success", getFormEventParameters(formElement));
    } catch (error) {
      statusDisplay.classList.add("is-error");
      statusDisplay.style.color = "var(--coral)";
      if (formName === "drinkware-inquiry") {
        statusDisplay.textContent = "Opening email as a backup. You can send the prepared inquiry directly.";
        window.location.href = buildMailtoUrl(data);
      } else {
        statusDisplay.textContent = "Submission failed. Please email us directly at hds.drinkware@gmail.com";
      }
      trackConversionEvent("form_submit_error", getFormEventParameters(formElement));
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href], button");
  if (!link) return;

  let href = link.getAttribute("href") || "";
  if (href.includes("wa.me")) {
    try {
      const whatsappLink = new URL(href);
      const message = whatsappLink.searchParams.get("text") || "";
      if (!message.includes("Source page:")) {
        whatsappLink.searchParams.set(
          "text",
          `${message}\nSource page: ${window.location.origin}${window.location.pathname}`.trim()
        );
        href = whatsappLink.toString();
        link.setAttribute("href", href);
      }
    } catch (error) {
      // Keep the original WhatsApp link if URL parsing fails.
    }
  }
  const eventName = href.includes("wa.me") ? "whatsapp_click" : href.startsWith("mailto:") ? "email_click" : "";
  if (!eventName) return;

  const linkLocation = link.closest(".site-footer")
    ? "footer"
    : link.closest(".site-header")
      ? "header"
      : link.closest("#rfq-form")
        ? "rfq_form"
        : link.closest(".contact-rfq-section")
          ? "contact_page"
          : link.closest(".catalog-card")
            ? "product_card"
            : "page_content";

  trackConversionEvent(eventName, {
    page_path: window.location.pathname,
    link_location: linkLocation,
    contact_method: eventName === "whatsapp_click" ? "whatsapp" : "email",
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
