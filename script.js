const form = document.querySelector(".quote-form");
const formStatus = document.querySelector(".form-status");
const salesEmail = "hds.drinkware@gmail.com";
const whatsappUrl = "https://wa.me/8613994271614?text=Hello%20HDS%20Drinkware%2C%20I%20would%20like%20to%20request%20a%20custom%20drinkware%20quotation.";
const catalogGrid = document.querySelector("#catalog-grid");

const catalogProducts = [
  ["Portable 304 Sport Thermos", "Stainless steel", "portable-304-sport-thermos.jpg"],
  ["Cute Plastic Water Cup", "Plastic drinkware", "cute-plastic-water-cup.jpg"],
  ["Straight Tumbler", "Tumbler series", "straight-tumbler.jpg"],
  ["Cartoon Vacuum Thermos", "Kids and gift", "cartoon-vacuum-thermos.jpg"],
  ["Gradient Cup Set", "Gift set", "gradient-cup-set.jpg"],
  ["Powder Coated 304 Thermos", "Custom finish", "powder-coated-304-thermos.jpg"],
  ["Dark Green Plastic Bottle", "Plastic bottle", "plastic-water-bottle-dark-green.jpg"],
  ["Multi-color Thermal Cup", "Color options", "multi-color-thermal-cup.jpg"],
  ["Classic 304 Thermos", "Stainless steel", "classic-304-thermos.jpg"],
  ["Gift Drinkware Assortment", "Gift program", "gift-drinkware-assortment.jpg"],
  ["Multi-color 40oz Tumbler", "40oz series", "multi-color-40oz-tumbler.jpg"],
  ["2oz Stainless Mini Cup", "Mini cup", "2oz-stainless-mini-cup.jpg"],
  ["20oz Stainless Tumbler", "20oz series", "20oz-stainless-tumbler.jpg"],
  ["30oz Car Tumbler", "Car cup", "30oz-car-tumbler.jpg"],
  ["Portable Handle Sport Bottle", "Sports bottle", "portable-handle-sport-bottle.jpg"],
  ["PP Plastic Water Cup", "PP plastic", "pp-plastic-water-cup.jpg"],
  ["Large Modern Thermos", "Large capacity", "large-modern-thermos.jpg"],
  ["12oz Stainless Cup", "12oz series", "12oz-stainless-cup.jpg"],
  ["Phone Holder Tumbler", "Functional tumbler", "phone-holder-tumbler.jpg"],
  ["20oz Straight Tumbler", "20oz series", "20oz-straight-tumbler.jpg"],
  ["Giant Straight Thermos", "Large capacity", "giant-straight-thermos.jpg"],
  ["Coffee Mug", "Coffee cup", "coffee-mug.jpg"],
  ["Bone China Camping Mug", "Camping mug", "bone-china-camping-mug.jpg"],
  ["800ml Cartoon Water Bottle", "Kids and gift", "800ml-cartoon-water-bottle.jpg"],
  ["Square Cup", "Compact cup", "square-cup.jpg"],
  ["Temperature Display Coffee Cup", "Smart display", "temperature-display-coffee-cup.jpg"],
  ["Portable Stainless Thermos", "Stainless steel", "portable-stainless-thermos.jpg"],
  ["Tun Tun Ice Tumbler", "Ice tumbler", "tun-tun-ice-tumbler.jpg"],
  ["Blue 40oz Tumbler", "40oz series", "blue-40oz-tumbler.jpg"],
  ["Flip Lid 304 Thermos", "Flip lid", "flip-lid-304-thermos.jpg"],
  ["32oz Space Bottle", "32oz series", "32oz-space-bottle.jpg"],
  ["Plastic Water Cup Series", "Plastic drinkware", "plastic-water-cup-series.jpg"],
  ["Full Screen Temperature Cup", "Smart display", "full-screen-temperature-cup.jpg"],
  ["Gradient Double Wall Thermos", "Custom finish", "gradient-double-wall-thermos.jpg"],
  ["Novelty Sport Bottle", "Sports bottle", "novelty-sport-bottle.jpg"],
  ["Car Plastic Drink Cup", "Car cup", "car-plastic-drink-cup.jpg"],
  ["Folding Cup", "Portable cup", "folding-cup.jpg"],
  ["Cycling Plastic Bottle", "Sports bottle", "cycling-plastic-bottle.jpg"],
  ["Gold Rim Straw Tumbler", "Gift tumbler", "gold-rim-straw-tumbler.jpg"],
  ["Color Handle 40oz Tumbler", "40oz series", "color-handle-40oz-tumbler.jpg"],
  ["Stainless Beer Cup", "Beer cup", "stainless-beer-cup.jpg"],
  ["Butterfly Plastic Cup", "Plastic drinkware", "butterfly-plastic-cup.jpg"],
  ["Ice Tumbler", "Ice tumbler", "ice-tumbler.jpg"],
  ["40oz Ice Tumbler", "40oz series", "40oz-ice-tumbler.jpg"],
  ["Outdoor Double Wall Thermos", "Outdoor cup", "outdoor-double-wall-thermos.jpg"],
  ["Third Generation 40oz", "40oz series", "third-generation-40oz.jpg"],
  ["Fitness Plastic Water Bottle", "Fitness bottle", "fitness-plastic-water-bottle.jpg"],
  ["Glass Party Mug", "Party cup", "glass-party-mug.jpg"],
  ["30oz Stainless Cup", "30oz series", "30oz-stainless-cup.jpg"],
  ["Bear Glass Cup", "Glass cup", "bear-glass-cup.jpg"],
  ["Colorful Plastic Cups", "Plastic drinkware", "colorful-plastic-cups.jpg"],
  ["Pocket Cup 200ml", "Mini cup", "pocket-cup-200ml.jpg"],
  ["Kids Plastic Water Bottle", "Kids bottle", "kids-plastic-water-bottle.jpg"],
  ["Stainless Vacuum Thermos", "Stainless steel", "stainless-vacuum-thermos.jpg"],
  ["Fifth Generation 40oz", "40oz series", "fifth-generation-40oz.jpg"],
  ["40oz Handle Tumbler", "40oz series", "40oz-handle-tumbler.jpg"],
  ["Plastic Glass Cup", "Plastic drinkware", "plastic-glass-cup.jpg"],
  ["Wide Mouth Sport Bottle", "Sports bottle", "wide-mouth-sport-bottle.jpg"],
  ["Bottle Opener Beer Cup", "Beer cup", "bottle-opener-beer-cup.jpg"],
];

const catalogCopy =
  "Logo, color, packaging, sample, and bulk quotation support available for wholesale and gift buyers.";

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
              <a class="product-whatsapp" href="https://wa.me/8613994271614?text=${message}" target="_blank" rel="noopener">Ask Price on WhatsApp</a>
              <a class="product-quote" href="#inquiry">Request Quote</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

const buildMailtoUrl = (data) => {
  const lines = [
    "New drinkware inquiry for Shanxi Huandingsheng Industry and Trade Co., Ltd. / HDS Drinkware",
    "",
    `Name: ${data.get("name") || ""}`,
    `Email or WhatsApp: ${data.get("contact") || ""}`,
    `Product Interest: ${data.get("product") || ""}`,
    `Quantity: ${data.get("quantity") || ""}`,
    "",
    "Message:",
    data.get("details") || "",
  ];

  const subject = encodeURIComponent("Drinkware sourcing inquiry");
  const body = encodeURIComponent(lines.join("\n"));
  return `mailto:${salesEmail}?subject=${subject}&body=${body}`;
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);

  formStatus?.classList.remove("is-error");
  if (formStatus) {
    formStatus.textContent = "Sending your inquiry...";
  }

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    form.reset();
    if (formStatus) {
      formStatus.textContent = "Thank you. Our sales team will contact you within 12 hours.";
    }
  } catch (error) {
    if (formStatus) {
      formStatus.classList.add("is-error");
      formStatus.textContent = "Opening email as a backup. You can send the prepared inquiry directly.";
    }
    window.location.href = buildMailtoUrl(data);
  }
});

const revealItems = document.querySelectorAll(
  ".section-heading, .product-card, .facts-grid article, .process-grid article, .buyer-grid article, .faq-grid article, .quality-image, .quality-copy, .factory-copy, .factory-gallery, .market-copy, .market-image, .brand-logo-panel, .brand-story .intro-copy"
  + ", .line-grid article, .catalog-card, .capability-copy, .capability-grid article, .timeline-grid article, .why-card, .proof-card, .landing-detail article, .landing-faq article, .landing-cta-band"
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
