import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const site = "https://www.hdsdrinkware.com";
const email = "hds.drinkware@gmail.com";
const whatsapp = "8613994271614";
const displayPhone = "+86 13994271614";
const updated = "2026-06-06";

const wa = (text) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
const esc = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cap = (value) => value.replace(/\b\w/g, (m) => m.toUpperCase());
const metaProduct = (page) => `${page.h1}. Low MOQ from 200 pcs, custom logo, packaging, samples and DDP/DDU shipping support from HDS Drinkware.`;
const metaInfo = (title) => `${title} from HDS Drinkware: China custom drinkware OEM/ODM support for logo tumblers, bottles, packaging, samples and shipping.`;

const productPages = [
  ["custom-40oz-tumbler-manufacturer", "Custom 40oz Tumbler Manufacturer China", "Custom 40oz Tumbler Manufacturer for Marketplace Sellers and Gift Buyers", "40oz handle tumblers, straw tumblers, gradient tumblers and rhinestone gift tumblers", "Amazon sellers, TikTok Shop sellers, Shopify brands, gift companies and distributors", "stainless steel, powder coated stainless steel and decorated tumbler options"],
  ["custom-stainless-steel-tumblers", "Custom Stainless Steel Tumblers Manufacturer", "Custom Stainless Steel Tumblers with Logo for Wholesale and Gift Buyers", "vacuum insulated tumblers, travel cups, coffee tumblers and stainless steel drinkware", "Amazon sellers, corporate gift buyers, distributors and wholesale buyers", "304 stainless steel inner options, powder coating, metallic finish and gradient color"],
  ["custom-water-bottles-with-logo", "Custom Water Bottles with Logo Supplier", "Custom Water Bottles with Logo for E-commerce, Events and Wholesale", "PC water bottles, sports bottles, 64oz bottles, kids bottles and daily hydration bottles", "fitness brands, schools, promotional buyers, Amazon sellers and wholesalers", "PC, PP, PETG, Tritan-style plastic options and stainless steel bottle options"],
  ["custom-plastic-water-bottles", "Custom Plastic Water Bottles Supplier China", "Custom Plastic Water Bottles with Logo and Packaging Support", "PC bottles, PP bottles, PETG bottles, straw bottles, kids bottles and promotional bottles", "schools, fitness programs, event buyers, social commerce sellers and promotional companies", "PC, PP, PETG and Tritan-style plastic options by project"],
  ["custom-sports-water-bottles", "Custom Sports Water Bottles Supplier", "Custom Sports Water Bottles for Gyms, Teams and Outdoor Buyers", "1000ml sports bottles, wide mouth bottles, cycling bottles and large hydration bottles", "gyms, teams, outdoor brands, distributors and Amazon sellers", "PC, PP, PETG, Tritan-style plastic and stainless steel options"],
  ["custom-coffee-travel-mugs", "Custom Coffee Travel Mugs Supplier", "Custom Coffee Travel Mugs with Logo for Brands and Gifts", "coffee mugs, travel mugs, insulated coffee cups and office drinkware", "coffee brands, corporate buyers, event buyers, Shopify stores and wholesalers", "stainless steel, ceramic-style options and insulated cup structures"],
  ["custom-kids-water-bottles", "Custom Kids Water Bottles Supplier", "Custom Kids Water Bottles for Schools, Gifts and Retail Programs", "kids plastic bottles, cartoon bottles, straw bottles and school gift drinkware", "schools, family retail buyers, gift companies and promotional buyers", "PP, PC, PETG and selected stainless steel kids bottle options"],
  ["custom-promotional-drinkware", "Custom Promotional Drinkware Supplier", "Custom Promotional Drinkware for Campaigns, Events and Brand Giveaways", "logo cups, tumblers, plastic bottles, sports bottles and promotional gift sets", "promotional companies, event buyers, distributors and corporate gift buyers", "plastic, stainless steel and mixed drinkware material options"],
  ["promotional-drinkware-supplier", "Promotional Drinkware Supplier China", "Promotional Drinkware Supplier for Logo Gifts and Campaign Buyers", "logo cups, tumblers, plastic bottles, sports bottles and promotional gift sets", "promotional companies, event buyers, distributors, brand teams and corporate gift buyers", "plastic, stainless steel and mixed drinkware material options"],
  ["custom-drinkware-gift-sets", "Custom Drinkware Gift Sets Supplier", "Custom Drinkware Gift Sets with Logo and Packaging Support", "drinkware gift sets, tumbler bundles, bottle gift boxes and Zenvyra gift solutions", "gift companies, corporate buyers, wedding favor buyers and holiday program buyers", "stainless steel, plastic, gift box, tote bag, card and insert options"],
  ["custom-drinkware-for-amazon-sellers", "Custom Drinkware for Amazon Sellers", "Custom Drinkware for Amazon Sellers Testing and Scaling Products", "40oz tumblers, stainless steel tumblers, sports bottles, plastic bottles and gift bundles", "Amazon sellers and private label teams", "stainless steel, plastic, PC, PP and packaging-ready product options"],
  ["custom-drinkware-for-tiktok-shop-sellers", "Custom Drinkware for TikTok Shop Sellers", "Custom Drinkware for TikTok Shop Sellers and Live Commerce Tests", "visual tumblers, colorful bottles, gift cups and trend-ready drinkware", "TikTok Shop sellers, live commerce teams and social sellers", "stainless steel, plastic, rhinestone decoration and colorful finish options"],
  ["custom-drinkware-for-shopify-brands", "Custom Drinkware for Shopify Brands", "Custom Drinkware for Shopify Brands and Private Label Stores", "private label tumblers, water bottles, coffee cups and branded gift sets", "Shopify brands, DTC teams and online store owners", "stainless steel, plastic, logo-ready and packaging-ready options"],
  ["custom-drinkware-for-corporate-gifts", "Custom Drinkware for Corporate Gifts", "Custom Drinkware for Corporate Gifts, Events and Client Programs", "logo tumblers, coffee cups, water bottles and curated gift sets", "corporate gift buyers, event teams, HR teams and gift companies", "stainless steel, plastic, gift box and Zenvyra bundle options"],
  ["custom-drinkware-for-wedding-favors", "Custom Drinkware for Wedding Favors", "Custom Drinkware for Wedding Favors and Guest Gifts", "small tumblers, coffee cups, gift bottles and personalized drinkware sets", "wedding favor buyers, event planners and gift companies", "stainless steel, plastic, gift box, card and label options"],
  ["custom-drinkware-for-event-gifts", "Custom Drinkware for Event Gifts", "Custom Drinkware for Events, Conferences and Brand Giveaways", "event tumblers, logo bottles, coffee mugs and promotional drinkware", "event buyers, conference organizers and promotional companies", "plastic, stainless steel, standard box and event packaging options"],
  ["custom-drinkware-for-distributors", "Custom Drinkware for Distributors", "Custom Drinkware for Distributors and Wholesale Buyers", "assorted tumblers, sports bottles, plastic bottles and coffee cups", "distributors, wholesalers and import buyers", "stainless steel, plastic, mixed carton and repeat order options"],
  ["custom-drinkware-for-promotional-companies", "Custom Drinkware for Promotional Companies", "Custom Drinkware for Promotional Companies and Campaign Buyers", "promotional cups, tumblers, sports bottles and logo gift drinkware", "promotional companies, agencies, event buyers and brand teams", "plastic, stainless steel, labels, silk screen and gift packaging options"],
  ["low-moq-custom-drinkware", "Low MOQ Custom Drinkware Supplier", "Low MOQ Custom Drinkware from 200 pcs for B2B Buyers", "tumblers, water bottles, coffee cups, sports bottles and gift drinkware sets", "Amazon sellers, TikTok sellers, Shopify brands and gift buyers", "stainless steel, plastic, PC, PP and packaging-ready options"],
  ["logo-drinkware-manufacturer", "Logo Drinkware Manufacturer China", "Logo Drinkware Manufacturer for Tumblers, Bottles and Gift Cups", "drinkware with laser, silk screen, UV printing, labels and packaging branding", "private label buyers, promotional companies and corporate gift buyers", "stainless steel, plastic and custom packaging materials"],
  ["private-label-drinkware-supplier", "Private Label Drinkware Supplier", "Private Label Drinkware Supplier for Online Brands and Wholesale Buyers", "private label tumblers, bottles, cups and gift sets", "Shopify brands, Amazon sellers, distributors and gift companies", "logo-ready stainless steel, plastic and packaging options"],
  ["oem-drinkware-supplier-china", "OEM Drinkware Supplier China", "OEM Drinkware Supplier China for Custom Tumblers and Bottles", "OEM tumblers, ODM bottle projects, custom cups and drinkware gift sets", "brands, distributors, promotional companies and import buyers", "stainless steel, plastic, color finish and packaging options"],
  ["wholesale-drinkware-supplier-china", "Wholesale Drinkware Supplier China", "Wholesale Drinkware Supplier China with Logo and Packaging Support", "wholesale tumblers, bottles, sports bottles, coffee mugs and gift sets", "wholesale buyers, distributors, importers and gift companies", "stainless steel, plastic and mixed product options"],
  ["custom-tumbler-supplier-china", "Custom Tumbler Supplier China", "Custom Tumbler Supplier China for Logo and Gift Packaging Projects", "40oz tumblers, stainless steel tumblers, coffee tumblers and gift tumblers", "Amazon sellers, corporate buyers, distributors and Shopify brands", "stainless steel, powder coating, laser logo and gift box options"],
  ["custom-water-bottle-supplier-china", "Custom Water Bottle Supplier China", "Custom Water Bottle Supplier China for Logo Bottles and Sports Bottles", "plastic water bottles, sports bottles, kids bottles and large capacity bottles", "fitness brands, schools, Amazon sellers, distributors and promotional buyers", "PC, PP, PETG, Tritan-style and stainless steel options"],
  ["drinkware-sourcing-agent-china", "Drinkware Sourcing Agent China", "Drinkware Sourcing Agent China for Custom Drinkware Buyers", "sourcing support for tumblers, bottles, coffee cups, packaging and shipping coordination", "overseas buyers, Amazon sellers, gift companies and distributors", "multi-factory supply chain resources across stainless steel and plastic drinkware"],
  ["low-moq-custom-tumblers-with-logo", "Low MOQ Custom Tumblers with Logo", "Low MOQ Custom Tumblers with Logo for Retailers and Brands", "low MOQ custom tumblers, logo engraving, wholesale tumblers", "retailers, online brands, startups and gift buyers", "304 stainless steel, vacuum insulated wall, powder coating and custom gift box options"],
  ["custom-water-bottles-for-corporate-gifts", "Custom Water Bottles for Corporate Gifts", "Custom Water Bottles for Corporate Gifts, Conferences and Events", "corporate logo water bottles, custom sports bottles, promotional hydration cups", "corporate HR buyers, event organizers, brand managers and gift companies", "BPA-free plastic, double-wall stainless steel and custom box solutions"],
  ["private-label-stainless-steel-tumblers-china", "Private Label Stainless Steel Tumblers China", "Private Label Stainless Steel Tumblers from China Manufacturer", "private label tumblers, custom logo insulated cups, China supplier", "Shopify DTC brands, Amazon sellers, wholesalers and distributors", "304 / 316 surgical stainless steel, double-wall vacuum, custom packaging"],
  ["custom-tumbler-packaging-guide", "Custom Tumbler Packaging Guide", "Custom Tumbler Packaging Guide for E-commerce and Gift Brands", "custom tumbler boxes, retail packaging, FBA barcode carton markings", "Amazon sellers, Shopify brands, gift agencies and distributors", "paperboard gift box, custom printed color boxes, cardboard inserts and cardboard dividers"],
  ["ddp-shipping-for-custom-drinkware-orders", "DDP Shipping for Custom Drinkware Orders", "DDP and DDU Shipping Support for Custom Drinkware Buyers", "DDP shipping, customs clearance, door-to-door freight, container consolidation", "global importers, Amazon FBA sellers, gift buyers and wholesale distributors", "door-to-door duty-paid sea, air, and train freight coordination"],
  ["custom-drinkware-quality-control-checklist", "Custom Drinkware Quality Control Checklist", "Custom Drinkware Quality Control Checklist for B2B Sourcing", "drinkware QC inspection checklist, food-safety certification, cross-hatch tape tests", "overseas brands, B2B importers, QA managers and purchasing agents", "strict ISO 9001-aligned incoming, in-process, and pre-shipment auditing rules"],
  ["custom-drinkware-gift-set-ideas-for-wholesale-buyers", "Custom Drinkware Gift Set Ideas for Wholesale Buyers", "Curated Custom Drinkware Gift Set Ideas for Wholesale and B2B Buyers", "custom drinkware gift sets, wholesale gift bundles, retail gift packaging", "corporate HR teams, gift distributors, wedding planners and brand agencies", "premium gift boxes, canvas tote bags, custom cardboard inserts and matching cards"],
];

const guides = [
  ["how-to-source-custom-tumblers-from-china", "How to Source Custom Tumblers from China: A Practical Guide for B2B Buyers", "custom tumbler sourcing from China"],
  ["how-to-choose-logo-method-for-custom-drinkware", "How to Choose the Right Logo Method for Custom Drinkware", "logo method selection for drinkware"],
  ["laser-engraving-vs-silk-screen-vs-uv-printing", "Laser Engraving vs Silk Screen vs UV Printing for Custom Tumblers", "logo method comparison"],
  ["what-is-moq-for-custom-drinkware", "What MOQ Means for Custom Drinkware Orders", "MOQ planning for custom drinkware"],
  ["custom-tumblers-for-amazon-sellers", "How Amazon Sellers Can Test Custom Tumblers with Low MOQ", "custom tumbler testing for Amazon sellers"],
  ["custom-drinkware-for-corporate-gifts", "Best Custom Drinkware Ideas for Corporate Gifts", "custom drinkware corporate gifts"],
  ["artwork-preparation-for-custom-drinkware", "How to Prepare Artwork for Custom Drinkware Production", "artwork preparation for custom drinkware"],
  ["custom-drinkware-packaging-options", "Custom Drinkware Packaging Options for Gift Companies", "drinkware packaging options"],
  ["stainless-steel-vs-plastic-water-bottles", "Stainless Steel vs Plastic Water Bottles: Which Is Better for Your Market?", "stainless steel vs plastic water bottles"],
  ["custom-drinkware-production-timeline", "How Long Does Custom Drinkware Production Take?", "custom drinkware production timeline"],
  ["what-to-provide-before-requesting-quote", "What Information Should Buyers Provide Before Requesting a Custom Drinkware Quote?", "quote preparation for custom drinkware"],
  ["ddp-ddu-shipping-for-custom-drinkware", "DDP/DDU Shipping for Custom Drinkware Buyers: What to Know", "DDP and DDU shipping for drinkware"],
  ["how-to-calculate-landed-cost-importing-drinkware-china", "How to Calculate Landed Cost of Importing Drinkware from China", "landed cost calculation for importing drinkware"],
  ["understanding-fda-vs-lfgb-standards-stainless-steel-bottles", "FDA vs LFGB Food Grade Standards for Stainless Steel Bottles", "FDA and LFGB compliance for stainless steel drinkware"],
];

const guideSeoTitles = {
  "how-to-source-custom-tumblers-from-china": "Source Custom Tumblers from China",
  "how-to-choose-logo-method-for-custom-drinkware": "Choose a Custom Drinkware Logo Method",
  "laser-engraving-vs-silk-screen-vs-uv-printing": "Laser vs Screen vs UV Printing",
  "custom-tumblers-for-amazon-sellers": "Low MOQ Custom Tumblers for Amazon",
  "artwork-preparation-for-custom-drinkware": "Prepare Artwork for Custom Drinkware",
  "custom-drinkware-packaging-options": "Custom Drinkware Packaging Options",
  "stainless-steel-vs-plastic-water-bottles": "Stainless Steel vs Plastic Water Bottles",
  "custom-drinkware-production-timeline": "Custom Drinkware Production Timeline",
  "what-to-provide-before-requesting-quote": "Custom Drinkware Quote Checklist",
  "ddp-ddu-shipping-for-custom-drinkware": "DDP/DDU Shipping for Drinkware Buyers",
};

const guideFocus = {
  "how-to-source-custom-tumblers-from-china": {
    h2: "Supplier Evaluation Points",
    text: "Before comparing price, buyers should confirm whether the supplier understands capacity, lid structure, coating, logo area, packaging and export packing. A useful quote should separate product cost, logo setup, packaging and shipping instead of giving only a single vague number.",
    bullets: ["Ask for real product photos or available sample options.", "Confirm whether the MOQ applies to one color or mixed colors.", "Check whether carton data can be shared before shipping quotation."],
  },
  "how-to-choose-logo-method-for-custom-drinkware": {
    h2: "Logo Method Decision Points",
    text: "The right logo method depends on material, surface shape, artwork color and the buyer channel. Laser engraving is often stable for stainless steel, silk screen works for simple artwork, and UV printing is useful when a colorful logo needs stronger visual presentation.",
    bullets: ["Match logo method to product surface and finish.", "Request a logo sample for curved or textured surfaces.", "Confirm logo size and position before mass production."],
  },
  "laser-engraving-vs-silk-screen-vs-uv-printing": {
    h2: "Practical Method Comparison",
    text: "Laser engraving, silk screen and UV printing solve different problems. Buyers should compare durability, color needs, unit cost, setup cost and sample timing rather than choosing only by appearance.",
    bullets: ["Laser is clean and durable for many stainless steel items.", "Silk screen is practical for simple one-color branding.", "UV printing can show richer artwork but needs sample review."],
  },
  "what-is-moq-for-custom-drinkware": {
    h2: "What Changes MOQ",
    text: "MOQ is affected by product stock, raw material, color, logo method, packaging and factory schedule. A lower MOQ is easier when the buyer accepts stock colors, standard packing and a simple logo process.",
    bullets: ["Ask whether the MOQ is per SKU, per color or per logo.", "Use stock product options for first market tests.", "Keep packaging simple when validating demand."],
  },
  "custom-tumblers-for-amazon-sellers": {
    h2: "Amazon Seller Planning",
    text: "Amazon sellers usually need a balance between low MOQ testing and repeatable product quality. The first order should validate color demand, product photos, packaging size and shipping cost before a larger restock plan.",
    bullets: ["Confirm barcode, carton mark and packaging needs early.", "Choose colors that support listing variation testing.", "Review sample photos before approving production."],
  },
  "custom-drinkware-for-corporate-gifts": {
    h2: "Corporate Gift Buying Notes",
    text: "Corporate gift buyers care about logo approval, event timing and presentation. Gift box, insert card and outer carton details should be confirmed early because they affect both unit cost and delivery timing.",
    bullets: ["Prepare event date and delivery deadline.", "Confirm logo approval process with the end client.", "Use packaging samples for important gift programs."],
  },
  "artwork-preparation-for-custom-drinkware": {
    h2: "Artwork Files Buyers Should Prepare",
    text: "Clear artwork preparation reduces sampling delays. Vector files are preferred for many logo methods, while color references, logo placement and approximate print size help the supplier judge feasibility.",
    bullets: ["Send AI, EPS, PDF or high-resolution artwork when available.", "Mark logo size and position on a product reference image.", "Provide Pantone or clear color expectations if color matching matters."],
  },
  "custom-drinkware-packaging-options": {
    h2: "Packaging Choice Tradeoffs",
    text: "Packaging affects product presentation, damage risk, carton volume and freight cost. Amazon, Shopify, corporate gift and distributor buyers often need different packaging paths for the same drinkware product.",
    bullets: ["Standard boxes are practical for sample and wholesale orders.", "Color boxes support retail and e-commerce presentation.", "Gift boxes need earlier sample review and carton planning."],
  },
  "stainless-steel-vs-plastic-water-bottles": {
    h2: "Material Choice by Market",
    text: "Stainless steel bottles usually support a higher perceived value and insulation story, while plastic bottles can fit lighter, colorful and lower-cost promotional programs. The best choice depends on buyer channel, target price and product use.",
    bullets: ["Use stainless steel for premium gifts and insulation demand.", "Use plastic for lightweight sports, school and event programs.", "Compare carton weight and freight impact before deciding."],
  },
  "custom-drinkware-production-timeline": {
    h2: "Timeline Control Points",
    text: "Most delays happen before production starts: unclear artwork, unconfirmed packaging, slow sample approval or missing shipping details. A cleaner quote packet helps the supplier plan sample and bulk timing more realistically.",
    bullets: ["Confirm product, logo and packaging before sample approval.", "Leave buffer for artwork revision and shipping booking.", "Ask for practical timing instead of only the fastest possible date."],
  },
  "what-to-provide-before-requesting-quote": {
    h2: "Quote Information Checklist",
    text: "A good quote request should make the product, quantity, logo, packaging and destination clear. If the buyer is still exploring, target market and price range can help HDS suggest workable options.",
    bullets: ["Send product photo, quantity and destination country.", "Share logo file, logo method preference and packaging request.", "Explain sales channel: Amazon, Shopify, gifts, events or wholesale."],
  },
  "ddp-ddu-shipping-for-custom-drinkware": {
    h2: "Shipping Discussion Points",
    text: "DDP and DDU shipping discussions depend on carton size, gross weight, destination country and delivery timing. Buyers should confirm whether they need door delivery, importer support, or their own forwarder before comparing options.",
    bullets: ["Ask for carton dimensions and gross weight after packing plan.", "Compare DDP/DDU with FOB if using your own forwarder.", "Confirm destination address type before final shipping quote."],
  },
};

const commonFaq = [
  ["What is the MOQ for custom drinkware?", "The MOQ starts from 200 pcs for selected custom drinkware projects, depending on product type, logo method, packaging requirements and current material availability."],
  ["Can I order samples before bulk production?", "Yes. Buyers can request stock samples or logo samples before bulk production. Sample timing depends on stock status, artwork, logo method and packaging complexity."],
  ["What logo methods do you support?", "Common logo methods include laser engraving, silk screen printing, UV printing, heat transfer, labels, inserts and custom packaging branding."],
  ["Do you support DDP/DDU shipping coordination?", "Yes. HDS can coordinate DDP/DDU shipping options by project and destination market, while also supporting FOB or EXW discussions when needed."],
];

const productMedia = {
  "custom-40oz-tumbler-manufacturer": [
    ["assets/catalog/40oz-handle-tumbler.jpg", "40oz handle tumbler for custom logo bulk orders"],
    ["assets/catalog/color-handle-40oz-tumbler.jpg", "Color handle 40oz tumblers for marketplace sellers"],
    ["assets/line-rhinestone-40oz.jpeg", "Rhinestone 40oz tumbler for custom gift drinkware programs"],
  ],
  "custom-stainless-steel-tumblers": [
    ["assets/catalog/20oz-stainless-tumbler.jpg", "20oz stainless steel tumbler for custom logo wholesale orders"],
    ["assets/catalog/straight-tumbler.jpg", "Straight stainless steel tumbler for private label drinkware"],
    ["assets/catalog/powder-coated-304-thermos.jpg", "Powder coated 304 stainless steel insulated cup"],
  ],
  "custom-water-bottles-with-logo": [
    ["assets/catalog/32oz-space-bottle.jpg", "32oz custom water bottle with logo-ready surface"],
    ["assets/catalog/plastic-water-bottle-dark-green.jpg", "Plastic water bottle for custom logo promotional projects"],
    ["assets/catalog/wide-mouth-sport-bottle.jpg", "Wide mouth sports water bottle for wholesale buyers"],
  ],
  "custom-plastic-water-bottles": [
    ["assets/catalog/plastic-water-cup-series.jpg", "Plastic water bottle series for low MOQ custom orders"],
    ["assets/catalog/pp-plastic-water-cup.jpg", "PP plastic water cup for promotional drinkware buyers"],
    ["assets/catalog/cute-plastic-water-cup.jpg", "Cute plastic water cup for custom gift programs"],
  ],
  "custom-sports-water-bottles": [
    ["assets/catalog/fitness-plastic-water-bottle.jpg", "Fitness plastic sports water bottle for custom logo orders"],
    ["assets/catalog/cycling-plastic-bottle.jpg", "Cycling plastic bottle for team and outdoor brand buyers"],
    ["assets/catalog/portable-handle-sport-bottle.jpg", "Portable handle sports bottle for gym and event programs"],
  ],
  "custom-coffee-travel-mugs": [
    ["assets/catalog/coffee-mug.jpg", "Coffee travel mug for custom logo wholesale buyers"],
    ["assets/catalog/temperature-display-coffee-cup.jpg", "Temperature display coffee cup for branded gift orders"],
    ["assets/catalog/bone-china-camping-mug.jpg", "Camping mug for custom coffee drinkware projects"],
  ],
  "custom-kids-water-bottles": [
    ["assets/catalog/kids-plastic-water-bottle.jpg", "Kids plastic water bottle for school and gift programs"],
    ["assets/catalog/800ml-cartoon-water-bottle.jpg", "Cartoon water bottle for custom kids drinkware buyers"],
    ["assets/catalog/cartoon-vacuum-thermos.jpg", "Cartoon vacuum thermos for kids bottle programs"],
  ],
  "custom-promotional-drinkware": [
    ["assets/catalog/colorful-plastic-cups.jpg", "Colorful plastic cups for promotional drinkware orders"],
    ["assets/catalog/butterfly-plastic-cup.jpg", "Butterfly plastic cup for custom event giveaways"],
    ["assets/catalog/glass-party-mug.jpg", "Party mug for logo promotional drinkware programs"],
  ],
  "promotional-drinkware-supplier": [
    ["assets/catalog/colorful-plastic-cups.jpg", "Promotional drinkware cups for logo printing campaigns"],
    ["assets/catalog/folding-cup.jpg", "Folding cup for promotional gift buyers"],
    ["assets/catalog/bottle-opener-beer-cup.jpg", "Bottle opener beer cup for custom campaign gifts"],
  ],
  "custom-drinkware-gift-sets": [
    ["assets/catalog/gift-drinkware-assortment.jpg", "Custom drinkware gift set assortment with packaging"],
    ["assets/catalog/gradient-cup-set.jpg", "Gradient cup set for branded gift drinkware projects"],
    ["assets/trust-proof/packaging.jpg", "Gift box packaging for custom drinkware sets"],
  ],
  "custom-drinkware-for-amazon-sellers": [
    ["assets/catalog/40oz-ice-tumbler.jpg", "40oz ice tumbler for Amazon private label testing"],
    ["assets/catalog/20oz-straight-tumbler.jpg", "20oz straight tumbler for Amazon drinkware sellers"],
    ["assets/trust-proof/shipping-cartons.jpg", "Carton packing for Amazon custom drinkware orders"],
  ],
  "custom-drinkware-for-tiktok-shop-sellers": [
    ["assets/catalog/multi-color-40oz-tumbler.jpg", "Multi-color 40oz tumbler for TikTok Shop sellers"],
    ["assets/catalog/gold-rim-straw-tumbler.jpg", "Gold rim straw tumbler for social commerce drinkware launches"],
    ["assets/catalog/blue-40oz-tumbler.jpg", "Blue 40oz tumbler for fast visual product testing"],
  ],
  "custom-drinkware-for-shopify-brands": [
    ["assets/catalog/gradient-double-wall-thermos.jpg", "Gradient double wall thermos for Shopify private label brands"],
    ["assets/catalog/classic-304-thermos.jpg", "Classic 304 thermos for branded online stores"],
    ["assets/trust-proof/logo-customization.jpg", "Custom logo tumbler sample for Shopify brands"],
  ],
  "custom-drinkware-for-corporate-gifts": [
    ["assets/catalog/gift-drinkware-assortment.jpg", "Corporate gift drinkware set with custom packaging options"],
    ["assets/catalog/12oz-stainless-cup.jpg", "12oz stainless cup for corporate logo gift orders"],
    ["assets/trust-proof/packaging.jpg", "Gift box packaging for corporate drinkware programs"],
  ],
  "custom-drinkware-for-wedding-favors": [
    ["assets/catalog/bear-glass-cup.jpg", "Bear glass cup for custom wedding favor drinkware"],
    ["assets/catalog/gold-rim-straw-tumbler.jpg", "Gold rim straw tumbler for personalized event gifts"],
    ["assets/catalog/gradient-cup-set.jpg", "Gradient cup set for wedding and party gift programs"],
  ],
  "custom-drinkware-for-event-gifts": [
    ["assets/catalog/glass-party-mug.jpg", "Party mug for custom event gift drinkware"],
    ["assets/catalog/colorful-plastic-cups.jpg", "Colorful cups for conference and event giveaways"],
    ["assets/catalog/stainless-beer-cup.jpg", "Stainless beer cup for branded event gifts"],
  ],
  "custom-drinkware-for-distributors": [
    ["assets/catalog/multi-color-thermal-cup.jpg", "Multi-color thermal cup assortment for drinkware distributors"],
    ["assets/catalog/portable-stainless-thermos.jpg", "Portable stainless thermos for wholesale drinkware distribution"],
    ["assets/trust-proof/shipping-cartons.jpg", "Wholesale drinkware cartons for distributor orders"],
  ],
  "custom-drinkware-for-promotional-companies": [
    ["assets/catalog/colorful-plastic-cups.jpg", "Colorful plastic cups for promotional company campaigns"],
    ["assets/catalog/bottle-opener-beer-cup.jpg", "Bottle opener beer cup for logo promotional projects"],
    ["assets/catalog/folding-cup.jpg", "Folding cup for custom promotional giveaways"],
  ],
  "low-moq-custom-drinkware": [
    ["assets/catalog/20oz-stainless-tumbler.jpg", "Low MOQ stainless steel tumbler for custom logo testing"],
    ["assets/catalog/plastic-water-cup-series.jpg", "Low MOQ plastic water cup series for market testing"],
    ["assets/trust-proof/sample-cases.jpg", "Custom drinkware sample cases before bulk production"],
  ],
  "logo-drinkware-manufacturer": [
    ["assets/trust-proof/logo-customization.jpg", "Custom logo application on tumbler samples"],
    ["assets/catalog/straight-tumbler.jpg", "Logo-ready straight tumbler for private label orders"],
    ["assets/catalog/plastic-glass-cup.jpg", "Plastic glass cup for custom logo drinkware programs"],
  ],
  "private-label-drinkware-supplier": [
    ["assets/catalog/gradient-double-wall-thermos.jpg", "Private label gradient thermos for online brands"],
    ["assets/catalog/20oz-stainless-tumbler.jpg", "Private label stainless steel tumbler for repeat orders"],
    ["assets/trust-proof/packaging.jpg", "Private label drinkware packaging support"],
  ],
  "oem-drinkware-supplier-china": [
    ["assets/catalog/classic-304-thermos.jpg", "OEM 304 stainless steel thermos for custom drinkware buyers"],
    ["assets/catalog/large-modern-thermos.jpg", "Large modern thermos for OEM drinkware projects"],
    ["assets/trust-proof/production-line.jpg", "Drinkware production line for OEM order coordination"],
  ],
  "wholesale-drinkware-supplier-china": [
    ["assets/catalog/multi-color-thermal-cup.jpg", "Wholesale thermal cup assortment for import buyers"],
    ["assets/catalog/30oz-stainless-cup.jpg", "30oz stainless cup for wholesale drinkware orders"],
    ["assets/trust-proof/shipping-cartons.jpg", "Carton packing for wholesale custom drinkware shipments"],
  ],
  "custom-tumbler-supplier-china": [
    ["assets/catalog/40oz-handle-tumbler.jpg", "Custom tumbler supplier China 40oz handle tumbler"],
    ["assets/catalog/20oz-straight-tumbler.jpg", "Straight tumbler for China custom tumbler sourcing"],
    ["assets/catalog/fifth-generation-40oz.jpg", "Fifth generation 40oz tumbler for custom logo projects"],
  ],
  "custom-water-bottle-supplier-china": [
    ["assets/catalog/wide-mouth-sport-bottle.jpg", "Custom water bottle supplier China wide mouth bottle"],
    ["assets/catalog/portable-handle-sport-bottle.jpg", "Portable handle water bottle for logo orders"],
    ["assets/catalog/plastic-water-bottle-dark-green.jpg", "Dark green plastic water bottle for custom sourcing"],
  ],
  "drinkware-sourcing-agent-china": [
    ["assets/trust-proof/sample-cases.jpg", "Drinkware sourcing samples for overseas buyers"],
    ["assets/trust-proof/qc-inspection.jpg", "Drinkware QC inspection before export shipment"],
    ["assets/trust-proof/shipping-cartons.jpg", "Custom drinkware shipping cartons for export coordination"],
  ],
  "low-moq-custom-tumblers-with-logo": [
    ["https://sc02.alicdn.com/kf/H8a8ddd94712e422fbc822ac72646a077w.jpg", "Low MOQ custom logo tumblers packaged and labeled for shipping"],
    ["assets/catalog/40oz-ice-tumbler.jpg", "Custom 40oz tumblers with logo sample"],
    ["assets/trust-proof/packaging.jpg", "Logo tumblers packed in individual retail boxes"]
  ],
  "ddp-shipping-for-custom-drinkware-orders": [
    ["https://sc02.alicdn.com/kf/Hc2dd8ffcd4ec4f529fce437a0ecd93deM.jpg", "Full container cargo truck with HMM container ready for DDP export delivery"],
    ["https://sc02.alicdn.com/kf/Hd4c80ddf2a684a77a6d8d966173716a4r.jpg", "Pallets of custom drinkware cartons labeled and ready for container loading"],
    ["https://sc02.alicdn.com/kf/H8a8ddd94712e422fbc822ac72646a077w.jpg", "FBA-compliant carton packing in delivery truck"]
  ],
};

const defaultProductMedia = [
  ["assets/catalog/20oz-stainless-tumbler.jpg", "Custom stainless steel tumbler for B2B drinkware buyers"],
  ["assets/catalog/plastic-water-cup-series.jpg", "Custom plastic water cup series for logo orders"],
  ["assets/trust-proof/logo-customization.jpg", "Custom drinkware logo sample before bulk production"],
];

const productIntent = {
  "custom-40oz-tumbler-manufacturer": ["40oz tumbler manufacturing and bulk customization", "Buyers comparing handle tumblers, straw tumblers and trend-led 40oz styles for marketplace or gift programs.", "This page should not compete with general water bottle pages; it is focused on 40oz tumbler projects."],
  "custom-stainless-steel-tumblers": ["stainless steel tumbler manufacturing", "Buyers who need vacuum insulated tumblers, travel cups or stainless steel drinkware with logo and packaging support.", "This page is for tumbler product selection, not broad sourcing-agent service searches."],
  "custom-water-bottles-with-logo": ["custom logo water bottle sourcing", "Buyers comparing plastic, sports and large-capacity bottles where logo placement and sales channel matter.", "This page targets product-with-logo intent, while the China supplier page targets supplier evaluation."],
  "custom-plastic-water-bottles": ["plastic water bottle customization", "Schools, fitness programs, event buyers and promotional teams looking for lighter and lower-cost bottle options.", "This page should not overlap with stainless steel bottle comparisons; it stays focused on plastic materials."],
  "custom-sports-water-bottles": ["sports bottle sourcing for teams and fitness channels", "Gyms, teams, outdoor brands and Amazon sellers comparing wide mouth, cycling and large hydration bottles.", "This page is for sport and outdoor use cases, not general corporate gift drinkware."],
  "custom-coffee-travel-mugs": ["custom coffee mug and travel mug sourcing", "Coffee brands, office gift buyers and wholesale teams comparing insulated coffee cups and branded mugs.", "This page is focused on coffee and travel mug use, not general tumblers."],
  "custom-kids-water-bottles": ["kids water bottle customization", "Schools, family retail buyers and gift companies that need kids-friendly bottle styles, colors and packaging.", "This page avoids competing with adult sports or corporate bottle pages."],
  "custom-promotional-drinkware": ["promotional product category selection", "Buyers comparing cups, tumblers, bottles and gift sets for campaigns, events or brand giveaways.", "This page is product-category oriented; the promotional supplier page is supplier-selection oriented."],
  "promotional-drinkware-supplier": ["promotional drinkware supplier evaluation", "Promotional companies and brand teams looking for a China supplier that can coordinate logo gifts and campaign orders.", "This page is supplier-facing rather than a broad catalog page."],
  "custom-drinkware-gift-sets": ["custom drinkware gift set packaging", "Gift companies and corporate buyers planning boxed sets, inserts, cards, sleeves or bundled drinkware programs.", "This page is about gift set presentation rather than single-product sourcing."],
  "custom-drinkware-for-amazon-sellers": ["Amazon private label drinkware testing", "Amazon sellers who need low MOQ, sample review, packaging discussion and restock-friendly product choices.", "This page is marketplace-channel specific, not a generic product category page."],
  "custom-drinkware-for-tiktok-shop-sellers": ["TikTok Shop visual product testing", "Live commerce and social sellers looking for visual tumblers, colorful bottles and small-batch launch options.", "This page is about fast visual commerce tests, not distributor repeat-order planning."],
  "custom-drinkware-for-shopify-brands": ["Shopify private label drinkware", "DTC brands that need product consistency, packaging direction and repeatable private label supply.", "This page is brand-store focused, not campaign giveaway focused."],
  "custom-drinkware-for-corporate-gifts": ["corporate gift drinkware sourcing", "Corporate buyers, HR teams and gift companies that need logo approval, presentation and event timing support.", "This page is for gifting programs, not general wholesale distribution."],
  "custom-drinkware-for-wedding-favors": ["wedding favor drinkware customization", "Event planners and gift buyers looking for personalized cups, small tumblers or packaged wedding favor drinkware.", "This page is event-gift focused and should not compete with corporate gift procurement."],
  "custom-drinkware-for-event-gifts": ["event and conference giveaway drinkware", "Conference organizers, event buyers and promotional companies planning deadline-driven branded giveaways.", "This page focuses on event timing and practical giveaway packing."],
  "custom-drinkware-for-distributors": ["distributor and wholesale repeat-order sourcing", "Distributors, importers and wholesalers that care about stable assortments, carton data and repeat order planning.", "This page is not for small social-commerce tests; it focuses on wholesale operations."],
  "custom-drinkware-for-promotional-companies": ["promotional agency drinkware sourcing", "Promotional agencies and campaign buyers that need logo method comparison, fast samples and campaign-ready packaging.", "This page serves agency workflows rather than end-brand product category browsing."],
  "low-moq-custom-drinkware": ["low MOQ custom drinkware testing", "New sellers and buyers validating demand before larger repeat orders, usually starting from selected 200 pcs projects.", "This page owns low-MOQ intent and links buyers onward to the right product category."],
  "logo-drinkware-manufacturer": ["logo application and decoration methods", "Buyers who already know they need drinkware with logo and want to compare laser, screen, UV, labels and packaging branding.", "This page focuses on logo execution rather than one product family."],
  "private-label-drinkware-supplier": ["private label drinkware supply", "Amazon, Shopify and distributor buyers building a repeatable branded drinkware line with packaging consistency.", "This page focuses on private label systems, not one-off promotional giveaways."],
  "oem-drinkware-supplier-china": ["OEM/ODM drinkware supplier search", "Brands and import buyers looking for China OEM/ODM coordination across product, logo, sample and packaging requirements.", "This page owns OEM/ODM supplier intent and should not be reduced to a single tumbler page."],
  "wholesale-drinkware-supplier-china": ["wholesale drinkware supply from China", "Importers, wholesalers and distributors comparing mixed product options, cartons and repeat order support.", "This page focuses on wholesale supply rather than low MOQ testing."],
  "custom-tumbler-supplier-china": ["China custom tumbler supplier evaluation", "Buyers looking specifically for tumbler supply, including 40oz, stainless steel and coffee tumbler options.", "This page supports supplier evaluation for tumblers rather than one exact 40oz style."],
  "custom-water-bottle-supplier-china": ["China custom water bottle supplier evaluation", "Buyers looking for a bottle supplier that can support plastic, sports, kids and large-capacity bottle projects.", "This page is supplier-evaluation focused, while logo water bottles is product-with-logo focused."],
  "drinkware-sourcing-agent-china": ["China drinkware sourcing agent service", "Overseas buyers who need sourcing coordination across factories, products, samples, QC, packaging and export details.", "This page is service-oriented rather than a product landing page."],
};

const relatedClusters = {
  "custom-40oz-tumbler-manufacturer": [["Stainless steel tumblers", "/custom-stainless-steel-tumblers/"], ["TikTok Shop drinkware", "/custom-drinkware-for-tiktok-shop-sellers/"], ["Low MOQ custom drinkware", "/low-moq-custom-drinkware/"], ["Logo method guide", "/sourcing-guides/how-to-choose-logo-method-for-custom-drinkware/"]],
  "custom-stainless-steel-tumblers": [["40oz tumbler manufacturer", "/custom-40oz-tumbler-manufacturer/"], ["Logo drinkware manufacturer", "/logo-drinkware-manufacturer/"], ["Private label drinkware", "/private-label-drinkware-supplier/"], ["Stainless vs plastic bottles", "/sourcing-guides/stainless-steel-vs-plastic-water-bottles/"]],
  "custom-water-bottles-with-logo": [["Water bottle supplier China", "/custom-water-bottle-supplier-china/"], ["Plastic water bottles", "/custom-plastic-water-bottles/"], ["Sports water bottles", "/custom-sports-water-bottles/"], ["Quote checklist", "/sourcing-guides/what-to-provide-before-requesting-quote/"]],
  "custom-promotional-drinkware": [["Promotional supplier", "/promotional-drinkware-supplier/"], ["Promotional companies", "/custom-drinkware-for-promotional-companies/"], ["Event gifts", "/custom-drinkware-for-event-gifts/"], ["Packaging options", "/sourcing-guides/custom-drinkware-packaging-options/"]],
  "promotional-drinkware-supplier": [["Promotional drinkware categories", "/custom-promotional-drinkware/"], ["Logo drinkware manufacturer", "/logo-drinkware-manufacturer/"], ["Corporate gifts", "/custom-drinkware-for-corporate-gifts/"], ["Logo method guide", "/sourcing-guides/how-to-choose-logo-method-for-custom-drinkware/"]],
  "low-moq-custom-drinkware": [["Amazon seller drinkware", "/custom-drinkware-for-amazon-sellers/"], ["TikTok Shop drinkware", "/custom-drinkware-for-tiktok-shop-sellers/"], ["MOQ guide", "/sourcing-guides/what-is-moq-for-custom-drinkware/"], ["Request quote checklist", "/sourcing-guides/what-to-provide-before-requesting-quote/"]],
  "oem-drinkware-supplier-china": [["Private label drinkware", "/private-label-drinkware-supplier/"], ["Wholesale supplier China", "/wholesale-drinkware-supplier-china/"], ["Factory and supply chain", "/factory-supply-chain/"], ["Production timeline", "/sourcing-guides/custom-drinkware-production-timeline/"]],
  "wholesale-drinkware-supplier-china": [["Distributors drinkware", "/custom-drinkware-for-distributors/"], ["OEM drinkware supplier", "/oem-drinkware-supplier-china/"], ["Shipping support", "/shipping-support/"], ["DDP/DDU shipping guide", "/sourcing-guides/ddp-ddu-shipping-for-custom-drinkware/"]],
  "drinkware-sourcing-agent-china": [["Factory supply chain", "/factory-supply-chain/"], ["Quality control", "/quality-control/"], ["OEM drinkware supplier", "/oem-drinkware-supplier-china/"], ["How to source tumblers", "/sourcing-guides/how-to-source-custom-tumblers-from-china/"]],
};

const conversionProfiles = {
  "oem-drinkware-supplier-china": {
    primary: "Request OEM Project Review",
    secondary: "Send OEM/ODM Details",
    heading: "Ready to discuss an OEM/ODM drinkware project?",
    copy: "Send product reference, target material, logo method, packaging concept, sample needs and estimated order quantity. HDS will review feasibility and suggest a practical project path.",
    message: "Hello HDS Drinkware, I would like an OEM/ODM project review. Product reference: , quantity: , logo method: , packaging: , destination: .",
    checklistTitle: "OEM/ODM project details HDS needs first.",
    checklistIntro: "OEM/ODM projects move faster when product structure, sample expectations and packaging direction are clear before quotation.",
    items: ["Product reference, target capacity, material and lid or accessory requirements.", "Estimated order quantity, sample quantity and target launch timing.", "Logo artwork, decoration method, color/finish direction and packaging concept.", "Any private label requirements such as barcode, insert, manual or carton marks.", "Destination country and preferred shipping term: DDP, DDU, FOB or EXW."],
  },
  "wholesale-drinkware-supplier-china": {
    primary: "Request Wholesale Quote",
    secondary: "Send Wholesale Order Details",
    heading: "Ready to plan a wholesale drinkware order?",
    copy: "Send product mix, target quantities, carton requirements, destination and repeat-order expectations so HDS can compare practical wholesale options.",
    message: "Hello HDS Drinkware, I need a wholesale drinkware quote. Product mix: , quantity: , carton/packing needs: , destination: .",
    checklistTitle: "Wholesale order details HDS needs first.",
    checklistIntro: "Wholesale quotes depend on stable product choice, packing method, carton data and shipping destination.",
    items: ["Product categories or SKU list, with estimated quantity per item.", "Target material, capacity, color mix and packaging level.", "Carton mark, barcode, pallet or warehouse receiving requirements if any.", "Repeat-order plan, target price range and seasonal timing.", "Destination country, address type and preferred shipping term."],
  },
  "low-moq-custom-drinkware": {
    primary: "Request Low MOQ Test Quote",
    secondary: "Send Test Order Details",
    heading: "Ready to test a custom drinkware idea with low MOQ?",
    copy: "Send your product idea, test quantity, logo and packaging needs. HDS will help compare a low MOQ path before you scale repeat orders.",
    message: "Hello HDS Drinkware, I want to test a low MOQ custom drinkware order. Product: , test quantity: , logo: , packaging: , destination: .",
    checklistTitle: "Low MOQ test order details HDS needs first.",
    checklistIntro: "Low MOQ projects work best when buyers keep the first test clear, simple and measurable.",
    items: ["Product photo or reference link for the first test style.", "Test quantity and whether mixed colors are needed.", "Simple logo method preference: laser, silk screen, UV, label or packaging branding.", "Packaging choice for the test: standard box, color box or gift box.", "Target sales channel and what would trigger a repeat order."],
  },
  "logo-drinkware-manufacturer": {
    primary: "Request Logo Method Advice",
    secondary: "Send Logo Artwork",
    heading: "Need help choosing the right logo method?",
    copy: "Send product material, surface photo and artwork. HDS will compare laser engraving, silk screen, UV printing, labels or packaging branding.",
    message: "Hello HDS Drinkware, please advise the best logo method. Product: , material: , logo colors: , quantity: , destination: .",
    checklistTitle: "Logo customization details HDS needs first.",
    checklistIntro: "Logo quality depends on artwork, surface shape, finish, print size and order quantity.",
    items: ["Logo file or screenshot, preferably vector artwork if available.", "Product photo, material and surface finish.", "Logo size, position and number of colors.", "Preferred method if known: laser, silk screen, UV, heat transfer or label.", "Sample requirement before mass production."],
  },
  "custom-drinkware-gift-sets": {
    primary: "Request Gift Set Plan",
    secondary: "Send Gift Packaging Details",
    heading: "Ready to plan custom drinkware gift sets?",
    copy: "Send the drinkware style, gift box idea, insert/card needs, target event and budget range so HDS can compare a realistic packaging path.",
    message: "Hello HDS Drinkware, I need a custom drinkware gift set plan. Product: , quantity: , gift box/insert: , event date: , destination: .",
    checklistTitle: "Gift set details HDS needs first.",
    checklistIntro: "Gift set quotes depend on product combination, presentation, box structure and event timing.",
    items: ["Drinkware product type and any bundled accessories.", "Gift box, sleeve, card, insert, tote bag or label requirements.", "Logo placement on product and packaging.", "Event date, target delivery window and destination country.", "Budget range or target channel: corporate gifts, holiday sets, weddings or retail."],
  },
  "custom-drinkware-for-amazon-sellers": {
    primary: "Request Amazon Test Quote",
    secondary: "Send Amazon Product Details",
    heading: "Planning a custom drinkware launch for Amazon?",
    copy: "Send target product, quantity, packaging, barcode or carton mark needs and destination. HDS will help compare test order and restock paths.",
    message: "Hello HDS Drinkware, I need an Amazon custom drinkware quote. Product: , quantity: , packaging/barcode: , destination warehouse/country: .",
    checklistTitle: "Amazon seller details HDS needs first.",
    checklistIntro: "Amazon projects need product, packaging and carton information early so launch and restock planning stay realistic.",
    items: ["Target product, capacity, color variation and test quantity.", "Logo artwork and packaging direction.", "Barcode, label, carton mark or FBA-related requirements if known.", "Sample review needs before bulk order.", "Destination country, warehouse type and target launch timing."],
  },
  "custom-drinkware-for-distributors": {
    primary: "Request Distributor Supply Quote",
    secondary: "Send Distributor Order Plan",
    heading: "Need stable drinkware options for distribution?",
    copy: "Send product assortment, carton needs, repeat-order timing and destination so HDS can compare wholesale-friendly supply options.",
    message: "Hello HDS Drinkware, I need distributor drinkware supply support. Product assortment: , quantity: , carton needs: , destination: .",
    checklistTitle: "Distributor order details HDS needs first.",
    checklistIntro: "Distributor projects need stable products, carton data and repeat-order planning more than one-off sampling.",
    items: ["Assortment plan and estimated quantity per product type.", "Color mix, packaging level and carton mark requirements.", "Target price range and expected repeat-order timing.", "Shipping term preference and destination country.", "Any warehouse receiving or labeling requirements."],
  },
};

const defaultConversionProfile = {
  primary: "Request Custom Drinkware Quote",
  secondary: "Send Quote Details",
  heading: "Ready to request a custom drinkware quote?",
  copy: "Send your product photo, quantity, logo requirement, packaging request and target market. HDS will review the details and reply with a practical sourcing path.",
  message: "Hello HDS Drinkware, please quote this custom drinkware project. Product: , quantity: , logo: , packaging: , destination: .",
  checklistTitle: "What HDS needs to prepare an accurate B2B quote.",
  checklistIntro: "Send these details together and the sales team can compare realistic product, logo, packaging and shipping options faster.",
  items: ["Product photo or reference link for the target drinkware style.", "Order quantity, destination country and preferred shipping term: DDP, DDU, FOB or EXW.", "Logo file, logo size, logo position and preferred decoration method if known.", "Packaging plan: standard box, color box, gift box, insert, sleeve, barcode or carton marks.", "Sample request, launch timing and target buyer channel."],
};

const getConversionProfile = (page) => {
  const profile = conversionProfiles[page.slug] || defaultConversionProfile;
  return {
    ...defaultConversionProfile,
    ...profile,
    items: profile.items || defaultConversionProfile.items,
  };
};

const header = (depth = 0) => {
  const p = depth === 0 ? "/" : "../".repeat(depth);
  return `<header class="site-header"><a class="brand" href="${p}"><span class="brand-mark">HDS</span><span class="brand-text"><strong>HDS Drinkware</strong><small>Shanxi Huandingsheng</small></span></a><nav class="main-nav" aria-label="Main navigation"><a href="${p}#products">Products</a><a href="${p}sourcing-guides/">Guides</a><a href="${p}faq/">FAQ</a><a href="${p}about-hds-drinkware/">About</a><a href="${p}#inquiry">Contact</a></nav><div class="header-actions"><div class="gtranslate_wrapper"></div><a class="header-whatsapp" href="${wa("Hello HDS Drinkware, I would like to request MOQ, price, logo options and sample details.")}" target="_blank" rel="noopener">WhatsApp</a><a class="header-cta" href="${p}#inquiry">Request Quote</a></div></header>`;
};

const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const faqSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

const productSchema = (page) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: page.h1,
  description: `${page.options} with low MOQ support, logo customization, packaging support, sample support and shipping coordination.`,
  image: page.images.map(([src]) => `${site}/${src}`),
  brand: { "@type": "Brand", name: "HDS Drinkware" },
  manufacturer: { "@type": "Organization", name: "Shanxi Huandingsheng Industry and Trade Co., Ltd.", url: site },
  category: "Custom drinkware",
  material: page.material,
  audience: { "@type": "BusinessAudience", audienceType: page.buyers },
  additionalProperty: [
    { "@type": "PropertyValue", name: "MOQ", value: "From 200 pcs for selected projects" },
    { "@type": "PropertyValue", name: "Logo Methods", value: "Laser engraving, silk screen printing, UV printing, heat transfer, labels and packaging branding" },
    { "@type": "PropertyValue", name: "Sample Available", value: "Stock sample or logo sample support before bulk order" },
    { "@type": "PropertyValue", name: "Packaging Options", value: "Standard box, color box, gift box, insert, label, sleeve, carton marks and bundle packaging" },
    { "@type": "PropertyValue", name: "OEM/ODM Support", value: "Available by product type, quantity and customization requirement" },
  ],
});

const servicePageSlugs = new Set([
  "promotional-drinkware-supplier",
  "custom-drinkware-for-amazon-sellers",
  "custom-drinkware-for-tiktok-shop-sellers",
  "custom-drinkware-for-shopify-brands",
  "custom-drinkware-for-corporate-gifts",
  "custom-drinkware-for-wedding-favors",
  "custom-drinkware-for-event-gifts",
  "custom-drinkware-for-distributors",
  "custom-drinkware-for-promotional-companies",
  "low-moq-custom-drinkware",
  "logo-drinkware-manufacturer",
  "private-label-drinkware-supplier",
  "oem-drinkware-supplier-china",
  "wholesale-drinkware-supplier-china",
  "custom-tumbler-supplier-china",
  "custom-water-bottle-supplier-china",
  "drinkware-sourcing-agent-china",
]);

const serviceSchema = (page) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: page.h1,
  description: `${page.h1} with custom drinkware sourcing, logo customization, packaging, sample and shipping coordination from HDS Drinkware.`,
  serviceType: productIntent[page.slug]?.[0] || "custom drinkware sourcing",
  provider: {
    "@type": "Organization",
    name: "Shanxi Huandingsheng Industry and Trade Co., Ltd.",
    alternateName: "HDS Drinkware",
    url: site,
    email,
    telephone: displayPhone,
  },
  areaServed: ["United States", "United Kingdom", "Europe", "Brazil", "Middle East", "Africa"],
  audience: { "@type": "BusinessAudience", audienceType: page.buyers },
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    businessFunction: "https://schema.org/Sell",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "USD",
      description: "Quotation based on product type, quantity, logo method, packaging and shipping requirements.",
    },
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `${page.h1} support scope`,
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Product matching and sourcing support" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Logo customization coordination" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Packaging and sample coordination" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "DDP/DDU shipping coordination" } },
    ],
  },
});

const primaryLandingSchema = (page) => servicePageSlugs.has(page.slug) ? serviceSchema(page) : productSchema(page);

const pageTypeSchema = (page) => ({
  "@context": "https://schema.org",
  "@type": page.schemaType || "WebPage",
  name: page.h1,
  url: `${site}/${page.slug}/`,
  description: page.intro,
  isPartOf: { "@type": "WebSite", name: "HDS Drinkware", url: site },
  publisher: { "@type": "Organization", name: "HDS Drinkware", url: site },
});

const jsonLd = (...schemas) => schemas.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join("\n");

const mediaSrc = (src, depth) => `${"../".repeat(depth)}${src}`;

function productHeroMedia(page, depth) {
  const [src, alt] = page.images[0];
  return `<figure class="landing-hero-media"><img src="${mediaSrc(src, depth)}" alt="${esc(alt)}" width="900" height="900" loading="eager" decoding="async" /></figure>`;
}

function productImageStrip(page, depth) {
  return `<section class="section landing-product-visuals" aria-label="${esc(page.h1)} product visuals">${page.images.map(([src, alt]) => `<figure><img src="${mediaSrc(src, depth)}" alt="${esc(alt)}" width="900" height="900" loading="lazy" decoding="async" /><figcaption>${esc(alt)}</figcaption></figure>`).join("")}</section>`;
}

function quoteChecklist(page) {
  const cta = getConversionProfile(page);
  const items = cta.items.map((item) => `<li>${esc(item)}</li>`).join("");
  return `<section class="section landing-quote-checklist"><div><p class="eyebrow">Quote and sample checklist</p><h2>${esc(cta.checklistTitle)}</h2><p>${esc(cta.checklistIntro)}</p></div><ul>${items}</ul></section>`;
}

function pageShell({ title, meta, slug, h1, eyebrow, intro, body, schemas, depth = 1, heroMedia = "" }) {
  const canonical = `${site}/${slug ? `${slug}/` : ""}`;
  const p = "../".repeat(depth);
  const heroClass = heroMedia ? "landing-hero landing-hero-with-media" : "landing-hero";
  const cta = slug ? getConversionProfile({ slug }) : defaultConversionProfile;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${esc(meta)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <title>${esc(title)}</title>
    <link rel="stylesheet" href="${p}styles.css" />
    ${jsonLd(...schemas)}
  </head>
  <body class="landing-page">
    ${header(depth)}
    <main>
      <section class="${heroClass}">
        <div>
          <p class="eyebrow">${esc(eyebrow)}</p>
          <h1>${esc(h1)}</h1>
          <p>${esc(intro)}</p>
          <div class="hero-actions"><a class="button whatsapp" href="${wa(cta.message)}" target="_blank" rel="noopener">${esc(cta.primary)}</a><a class="button primary" href="${p}#inquiry">${esc(cta.secondary)}</a></div>
        </div>
        ${heroMedia}
      </section>
      ${body}
    </main>
    <script>window.gtranslateSettings = {"default_language":"en","languages":["en","de","fr","es","ja","pt","ru","ar"],"wrapper_selector":".gtranslate_wrapper","flag_size":16,"horizontal_position":"inline"}</script>
    <script src="https://cdn.gtranslate.net/widgets/latest/dwf.js" defer></script>
  </body>
</html>
`;
}

const customPageDetails = {
  "custom-40oz-tumbler-manufacturer": {
    painPoints: [
      "Marketplace sellers (Amazon, TikTok Shop, Shopify) need high-strength handle attachments (welded and screw-reinforced) to prevent handles from breaking off during shipping or heavy use.",
      "Ensuring leak-resistant lid mechanisms (such as multi-use rotating straw lids with secure silicone seal gaskets) is critical to prevent splashes during commuting.",
      "Quality control must verify paint durability and adhesion via cross-hatch tape tests to avoid common coating chipping or peeling issues on powder-coated colors.",
      "The lower base must have a precise tapered diameter (approx. 7.3cm / 2.87 inches) to fit standard vehicle cup holders, which is a key buying decision for end-consumers.",
      "Shipping planning must account for bulk carton volume; we coordinate FBA carton marking, barcodes, and custom inner box packing to minimize transit damage and Amazon receiving delays."
    ],
    materialDetail: "Food-grade 18/8 (304) stainless steel inner lining for excellent durability and copper-plated vacuum insulation, combined with a BPA-free rotating Tritan-style slider lid, ergonomic PP handle with comfortable soft-touch grip, and reusable PP/silicone straw options.",
    qcDetail: "Our 40oz tumblers undergo 100% vacuum insulation testing, 100-stroke handle tension tests, cross-hatch tape tests for powder coat adhesion, lid leakage testing, and a strict inspection of straw clearance to ensure zero scratches."
  },
  "custom-stainless-steel-tumblers": {
    painPoints: [
      "B2B buyers and brands need food-safety compliance certification support (FDA, LFGB, California Proposition 65) to avoid customs seizure or legal liability in Europe and North America.",
      "High vacuum thermal performance (minimum 12 hours hot / 24 hours cold) must be verified through temperature sensors on the production line.",
      "Custom branding needs to be durable; logo application (laser engraving, silk screen, UV flatbed, or water transfer) must be tested against dishwashing heat.",
      "Gift distributors and corporate buyers require elegant packaging solutions, custom insert cards, and tissue wrapping to elevate the unboxing experience."
    ],
    materialDetail: "Premium kitchen-grade 18/8 (304) or optional 316 surgical-grade stainless steel inside for ultimate rust resistance. Outer surface finishes include rugged matte powder coatings, sleek metallic finishes, high-gloss gradient sprays, and electroplated accents.",
    qcDetail: "We perform automated temperature-drop vacuum testing, salt-spray testing for rust resistance, cross-hatch tape tests for paint adhesion, dishwasher-cycle durability tests for logos, and strict SGS-style food-grade compliance audits."
  },
  "custom-water-bottles-with-logo": {
    painPoints: [
      "Gyms, fitness brands, and sports teams need 100% spill-proof lids with secure locking rings and one-click opening mechanisms that survive dropping.",
      "Plastic bottle bodies must use certified BPA-free food-safe materials (such as PP, PC, Tritan, or PETG) that do not transfer chemical tastes or odors to the water.",
      "Bulk promotional campaigns require durable, cost-effective logo printing that won't scratch off during sports activities or daily hydration.",
      "Wholesale buyers need accurate carton packaging weight and volume details to calculate DDP/DDU shipping costs and ensure easy warehouse handling."
    ],
    materialDetail: "Food-safe, BPA-free plastics including ultra-clear Eastman Tritan-style copolyester, lightweight PP for cycling sports, break-resistant PC, and heavy-duty PETG for 64oz large capacity jugs, equipped with durable silicone sports nozzle lids.",
    qcDetail: "We conduct pressure leak tests, 1.2m drop-impact durability tests, clear measurement scale printing accuracy audits, odor-free hot water chemical leaching evaluations, and strict bulk weight-to-carton-dimension optimization checks."
  },
  "custom-drinkware-gift-sets": {
    painPoints: [
      "Corporate gift buyers and event agencies need absolute logo consistency across different items in a gift set (e.g. matching a travel mug with a flask).",
      "Gift boxes must have custom cardboard or high-density EVA foam inserts with precise cutouts to prevent items from colliding and scratching during transport.",
      "MOQ must be flexible; buyers need to bundle custom drinkware with lifestyle items (such as stainless straws, cleaning brushes, greeting cards, or tote bags) in small batches from 200 sets.",
      "Strict event deadlines require guaranteed production lead times, fast sample proofing, and reliable DDP shipping to the event venue or office door."
    ],
    materialDetail: "Curated drinkware combinations of stainless steel insulated tumblers, double-wall coffee travel mugs, or sports bottles, matched with premium cardboard gift boxes, custom EVA foam/paper pulp inserts, matching greeting cards, custom canvas tote bags, and personalized hang tags.",
    qcDetail: "Gift set QC focuses on multi-item color-matching audits, drop-resistant gift box construction reviews, tight-fitting item positioning in inserts, greeting card print proofing, carton packing cushion tests, and on-time shipment scheduling."
  }
};

function landingBody(page) {
  const related = relatedLinks(page.slug);
  const intent = productIntent[page.slug] || ["custom drinkware sourcing", `${page.buyers} comparing logo-ready drinkware options for B2B orders.`, "This page should support a specific sourcing decision rather than duplicate every other drinkware page."];
  const custom = customPageDetails[page.slug];

  const painPointsList = custom && custom.painPoints
    ? custom.painPoints.map((p) => `<li>${esc(p)}</li>`).join("")
    : `<li>${esc(cap(page.buyers))} need product photos, logo method, packaging and shipping details before committing to bulk production.</li>
       <li>Small brands and sellers need low MOQ support from 200 pcs for selected projects, so they can test demand before larger repeat orders.</li>
       <li>Gift companies, distributors and marketplace sellers need sample support, realistic production timing and fast WhatsApp communication.</li>`;

  const materialDetail = custom && custom.materialDetail
    ? custom.materialDetail
    : `Material options include ${esc(page.material)}. Buyers can share their target market and price range so HDS can recommend a suitable material and product structure.`;

  const qcDetail = custom && custom.qcDetail
    ? custom.qcDetail
    : `Stock samples can be arranged when available. Logo samples usually need artwork confirmation. Bulk production is commonly planned around 30-35 days after approval, with DDP/DDU, FOB or EXW shipping coordination discussed by project.`;

  return `
      ${productImageStrip(page, 1)}
      <section class="section landing-intent-map">
        <article><span>Primary search intent</span><h2>${esc(cap(intent[0]))}</h2><p>${esc(intent[1])}</p></article>
        <article><span>Keyword boundary</span><h2>How this page differs</h2><p>${esc(intent[2])}</p></article>
      </section>
      <section class="section landing-content landing-detail">
        <article><h2>Buyer Pain Points</h2><ul>${painPointsList}</ul></article>
        <article><h2>Product Options</h2><p>${esc(page.options)} can be discussed by capacity, color, finish, lid, accessory, packaging and destination market. HDS helps buyers compare practical options instead of pushing a single retail-style SKU.</p></article>
        <article><h2>MOQ Details</h2><p>MOQ starts from 200 pcs for selected custom drinkware projects. The final MOQ depends on material, color, logo method, packaging, sample needs and current supply chain availability.</p></article>
        <article><h2>Material Options</h2><p>${esc(materialDetail)}</p></article>
        <article><h2>Logo Methods</h2><p>Logo customization support includes laser engraving, silk screen printing, UV printing, heat transfer, labels and packaging logo placement. The best method depends on product surface, artwork colors and buyer channel.</p></article>
        <article><h2>Sample, Production and Shipping Timeline</h2><p>${esc(qcDetail)}</p></article>
      </section>
      <section class="section">
        <div class="section-heading"><p class="eyebrow">Product comparison</p><h2>Product Comparison Table</h2></div>
        <div class="landing-table-wrap"><table class="landing-table"><thead><tr><th>Option</th><th>Best For</th><th>Customization Focus</th><th>Buyer Notes</th></tr></thead><tbody><tr><td>Entry test order</td><td>New sellers and first projects</td><td>Stock color, simple logo, standard packing</td><td>Useful when the buyer needs to validate demand with lower inventory pressure.</td></tr><tr><td>Private label order</td><td>${esc(page.buyers)}</td><td>Logo, color, packaging, barcode and carton marks</td><td>Better for buyers who need a repeatable product line.</td></tr><tr><td>Gift packaging order</td><td>Gift companies and corporate buyers</td><td>Gift box, insert, card, tote bag and bundle planning</td><td>Presentation and sample approval should be confirmed early.</td></tr><tr><td>Wholesale repeat order</td><td>Distributors and wholesale buyers</td><td>Stable product, mixed colors, cartons and shipping plan</td><td>Best when reorder timing and carton data matter.</td></tr></tbody></table></div>
      </section>
      <section class="section landing-content landing-detail">
        <article><h2>Logo Method Comparison Table</h2><div class="landing-table-wrap"><table class="landing-table"><thead><tr><th>Method</th><th>Best Use</th><th>Strength</th><th>Notes</th></tr></thead><tbody><tr><td>Laser engraving</td><td>Stainless steel and premium gifts</td><td>Durable, clean and professional</td><td>Good for corporate and private label positioning.</td></tr><tr><td>Silk screen printing</td><td>Simple logos and larger runs</td><td>Clear and cost-effective</td><td>Works best with simpler artwork.</td></tr><tr><td>UV printing</td><td>Color logos and detailed artwork</td><td>Better visual detail</td><td>Sample review is recommended before bulk order.</td></tr><tr><td>Label or packaging branding</td><td>Fast tests and gift sets</td><td>Flexible and practical</td><td>Useful when buyers want branding without complex setup.</td></tr></tbody></table></div></article>
        <article><h2>Packaging Options Table</h2><div class="landing-table-wrap"><table class="landing-table"><thead><tr><th>Packaging</th><th>Best For</th><th>Support Details</th></tr></thead><tbody><tr><td>Standard box</td><td>Samples and wholesale orders</td><td>Basic protection and practical carton packing.</td></tr><tr><td>Color box</td><td>Amazon, Shopify and retail channels</td><td>Can support barcode, brand information and product presentation.</td></tr><tr><td>Gift box</td><td>Corporate gifts and holiday programs</td><td>Can coordinate inserts, cards, sleeves and custom box print.</td></tr><tr><td>Custom bundle packaging</td><td>Gift companies and promotional buyers</td><td>Can combine drinkware, cards, tote bags, labels and carton marks.</td></tr></tbody></table></div></article>
      </section>
      <section class="section landing-copy-block">
        <article><h2>Buyer Use Cases</h2><p>${esc(page.h1)} is suitable for ${esc(page.buyers)}. Amazon sellers may use low MOQ orders to test color demand and listing response. TikTok Shop sellers may focus on visual product styles and fast samples. Shopify brands often care about private label packaging and repeat order consistency. Gift companies and corporate buyers usually need logo approval, gift box planning and event timing. Distributors need stable product options, carton information and shipping coordination. HDS supports these buyers with sourcing, OEM/ODM customization, packaging coordination and sample support before bulk order.</p></article>
        <article><h2>What to Prepare Before Requesting a Quote</h2><ul><li>Product reference photo, target capacity, material preference and buyer channel.</li><li>Quantity, with MOQ starting from 200 pcs for selected custom drinkware projects.</li><li>Logo file, logo size, logo position and preferred logo method if known.</li><li>Packaging request, such as standard box, color box, gift box, insert, label or carton marks.</li><li>Destination country, target timeline, sample request and shipping preference such as DDP, DDU, FOB or EXW.</li></ul></article>
      </section>
      ${quoteChecklist(page)}
      <section class="section landing-faq" aria-label="${esc(page.h1)} FAQ">${commonFaq.map(([q, a]) => `<article><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("")}<article><h3>Who is this page best for?</h3><p>This page is written for ${esc(page.buyers)} who need custom drinkware sourcing, logo customization, packaging support and export coordination from China.</p></article><article><h3>Can HDS support OEM/ODM projects?</h3><p>Yes. HDS can discuss OEM/ODM customization by product type, quantity, logo method, packaging requirements and production feasibility.</p></article></section>
      <section class="section landing-copy-block"><article><h2>Related Sourcing Guides and Pages</h2><p>${related}</p></article></section>
      <section class="section"><div class="landing-cta-band"><div><h2>${esc(getConversionProfile(page).heading)}</h2><p>${esc(getConversionProfile(page).copy)}</p></div><div class="hero-actions"><a class="button whatsapp" href="${wa(getConversionProfile(page).message)}" target="_blank" rel="noopener">${esc(getConversionProfile(page).primary)}</a><a class="button primary" href="../#inquiry">${esc(getConversionProfile(page).secondary)}</a></div></div></section>`;
}

function relatedLinks(slug) {
  const links = relatedClusters[slug] || [
    ["Custom 40oz tumbler manufacturer", "/custom-40oz-tumbler-manufacturer/"],
    ["Custom water bottles with logo", "/custom-water-bottles-with-logo/"],
    ["Low MOQ custom drinkware", "/low-moq-custom-drinkware/"],
    ["Amazon seller drinkware sourcing", "/custom-drinkware-for-amazon-sellers/"],
    ["Drinkware logo method guide", "/sourcing-guides/how-to-choose-logo-method-for-custom-drinkware/"],
    ["Custom drinkware FAQ", "/faq/"],
  ].filter(([, href]) => !href.includes(slug));
  return links.map(([label, href]) => `<a href="${href}">${label}</a>`).join(" | ");
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
}

const allUrls = ["/"];

for (const [slug, title, h1, options, buyers, material] of productPages) {
  const page = { slug, title, h1, options, buyers, material, images: productMedia[slug] || defaultProductMedia };
  const meta = metaProduct(page);
  const intro = `HDS Drinkware is a China-based custom drinkware OEM/ODM sourcing partner for ${buyers}. This page explains product options, MOQ details, logo methods, packaging choices, sample timing and quote preparation for B2B buyers.`;
  writeFile(`${slug}/index.html`, pageShell({
    title: `${title} | HDS Drinkware`,
    meta,
    slug,
    h1,
    eyebrow: "Custom drinkware sourcing guide",
    intro,
    body: landingBody(page),
    heroMedia: productHeroMedia(page, 1),
    schemas: [
      breadcrumbSchema([{ name: "Home", url: `${site}/` }, { name: h1, url: `${site}/${slug}/` }]),
      primaryLandingSchema(page),
      faqSchema(commonFaq),
    ],
  }));
  allUrls.push(`/${slug}/`);
}

function guideBody(slug, title, topic) {
  const focus = guideFocus[slug] || {
    h2: "Buyer Decision Notes",
    text: `For ${topic}, buyers should compare product feasibility, MOQ, logo method, sample timing, packaging and shipping before confirming a custom drinkware order.`,
    bullets: ["Prepare product references and target quantity.", "Confirm logo, packaging and sample needs early.", "Share destination country for shipping planning."],
  };
  const faq = [
    [`Is ${topic} suitable for low MOQ projects?`, `Yes. Many ${topic} decisions can start with a small test order when the product, logo method and packaging path are clear.`],
    ["What should buyers prepare first?", "Buyers should prepare product references, quantity, logo artwork, packaging request, destination market and target timeline before asking for a quote."],
    ["Can HDS help compare options?", "Yes. HDS can compare product, logo, packaging, sample and shipping options based on the buyer's sales channel and budget."],
  ];
  return {
    body: `
      <section class="section landing-copy-block">
        <article><h2>Introduction</h2><p>This sourcing guide is written by the HDS Drinkware Sourcing Team for global buyers comparing ${esc(topic)}. HDS Drinkware supports custom tumblers, water bottles, coffee cups, promotional drinkware and gift drinkware sets with low MOQ support, logo customization, sample support, packaging coordination and DDP/DDU shipping coordination.</p></article>
        <article><h2>Practical Buying Steps</h2><ul><li>Define the buyer channel, such as Amazon, TikTok Shop, Shopify, corporate gifts, distributors or promotional companies.</li><li>Select the product type, material, capacity, lid, color and packaging direction.</li><li>Prepare logo artwork and decide whether the project needs laser engraving, silk screen, UV printing, label or box branding.</li><li>Confirm sample needs before bulk production so appearance, logo and packaging can be reviewed.</li><li>Share destination country and shipping preference so carton packing and DDP/DDU coordination can be discussed.</li></ul></article>
      </section>
      <section class="section landing-copy-block"><article><h2>${esc(focus.h2)}</h2><p>${esc(focus.text)}</p><ul>${focus.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article></section>
      <section class="section"><div class="section-heading"><p class="eyebrow">Comparison</p><h2>Useful Comparison Table</h2></div><div class="landing-table-wrap"><table class="landing-table"><thead><tr><th>Decision</th><th>Option A</th><th>Option B</th><th>Buyer Note</th></tr></thead><tbody><tr><td>Material</td><td>Stainless steel</td><td>Plastic / PC / PP</td><td>Choose based on price point, product use and target channel.</td></tr><tr><td>Logo</td><td>Laser or silk screen</td><td>UV or label</td><td>Artwork complexity and surface shape affect the best method.</td></tr><tr><td>Packaging</td><td>Standard box</td><td>Color box or gift box</td><td>Presentation improves value but affects cost and carton planning.</td></tr><tr><td>Order stage</td><td>Sample order</td><td>Bulk order</td><td>Sample review reduces risk before mass production.</td></tr></tbody></table></div></section>
      <section class="section landing-copy-block"><article><h2>What to Prepare Before Requesting a Quote</h2><p>For a faster quotation, send product photo, target quantity, logo file, preferred capacity, packaging request, destination market and target delivery window. If you are unsure about product type, explain the sales channel and price range. HDS can suggest practical options instead of forcing a single product.</p></article><article><h2>Internal Links for Further Reading</h2><p><a href="/custom-40oz-tumbler-manufacturer/">Custom 40oz tumbler manufacturer</a> | <a href="/custom-water-bottles-with-logo/">Custom water bottles with logo</a> | <a href="/logo-drinkware-manufacturer/">Logo drinkware manufacturer</a> | <a href="/faq/">Custom drinkware FAQ</a></p></article></section>
      <section class="section landing-faq">${faq.map(([q, a]) => `<article><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("")}</section>
      <section class="section"><div class="landing-cta-band"><div><h2>Need sourcing help for ${esc(topic)}?</h2><p>Send your product idea, quantity, logo and packaging request. HDS will help compare a practical sourcing path.</p><p>Author: HDS Drinkware Sourcing Team. Updated: ${updated}.</p></div><div class="hero-actions"><a class="button whatsapp" href="${wa(`Hello HDS Drinkware, I read your guide about ${topic}. Please help me prepare a quote.`)}" target="_blank" rel="noopener">Get Quote on WhatsApp</a><a class="button primary" href="/#inquiry">Request OEM Quote</a></div></div></section>`,
    faq,
  };
}

writeFile("sourcing-guides/index.html", pageShell({
  title: "Custom Drinkware Sourcing Guides | HDS Drinkware",
  meta: "Practical custom drinkware sourcing guides for global buyers, Amazon sellers, gift companies and distributors sourcing tumblers, water bottles and promotional drinkware from China.",
  slug: "sourcing-guides",
  h1: "Custom Drinkware Sourcing Guides",
  eyebrow: "B2B sourcing guide hub",
  intro: "Practical guides for global buyers, Amazon sellers, gift companies and distributors sourcing custom tumblers, water bottles and promotional drinkware from China.",
  body: `<section class="section landing-content landing-detail">${guides.map(([slug, title, topic]) => `<article><h2><a href="/sourcing-guides/${slug}/">${esc(title)}</a></h2><p>A practical guide about ${esc(topic)} for B2B drinkware buyers preparing logo, MOQ, packaging, sample and quote details.</p></article>`).join("")}</section>`,
  schemas: [breadcrumbSchema([{ name: "Home", url: `${site}/` }, { name: "Sourcing Guides", url: `${site}/sourcing-guides/` }])],
}));
allUrls.push("/sourcing-guides/");

for (const [slug, title, topic] of guides) {
  const guide = guideBody(slug, title, topic);
  const seoTitle = guideSeoTitles[slug] || title;
  writeFile(`sourcing-guides/${slug}/index.html`, pageShell({
    title: `${seoTitle} | HDS Drinkware`,
    meta: `${seoTitle}: B2B sourcing advice for custom drinkware buyers planning MOQ, logo, packaging, samples and shipping from China.`,
    slug: `sourcing-guides/${slug}`,
    h1: title,
    eyebrow: "Sourcing guide",
    intro: `This guide explains ${topic} for B2B buyers sourcing custom drinkware from China. It is written for buyers who need clear MOQ, logo, packaging, sample and shipping preparation before requesting a quote.`,
    body: guide.body,
    depth: 2,
    schemas: [
      breadcrumbSchema([{ name: "Home", url: `${site}/` }, { name: "Sourcing Guides", url: `${site}/sourcing-guides/` }, { name: title, url: `${site}/sourcing-guides/${slug}/` }]),
      { "@context": "https://schema.org", "@type": "Article", headline: title, author: { "@type": "Organization", name: "HDS Drinkware Sourcing Team" }, dateModified: updated, publisher: { "@type": "Organization", name: "HDS Drinkware" } },
      faqSchema(guide.faq),
    ],
  }));
  allUrls.push(`/sourcing-guides/${slug}/`);
}

const faqItems = [
  ["What is the MOQ for custom drinkware?", "MOQ starts from 200 pcs for selected custom drinkware projects. The exact MOQ depends on product type, material, color, logo method, packaging needs and current supply chain availability. If you are testing a new market, share your target quantity and sales channel so HDS can suggest a practical low MOQ path."],
  ["Can I customize tumblers with my logo?", "Yes. HDS supports logo customization for tumblers, water bottles, coffee cups and gift drinkware sets. Common methods include laser engraving, silk screen printing, UV printing, heat transfer, labels and packaging logo placement. The best method depends on material, surface, logo color and order quantity."],
  ["What logo methods do you support?", "HDS supports laser engraving, silk screen printing, UV printing, heat transfer, labels, inserts and packaging branding. Laser is often used for stainless steel, silk screen is practical for simple logos, and UV printing can support more colorful artwork when the product surface is suitable."],
  ["Can I order samples before bulk production?", "Yes. Buyers can request stock samples or logo samples before bulk production. Stock samples may move faster when available, while logo samples depend on artwork, decoration method and product surface. Sample review helps confirm appearance, function, logo position and packaging before mass production."],
  ["Do you support gift box packaging?", "Yes. HDS supports standard box, color box, gift box, sleeve, card, insert, tote bag and carton mark coordination. Packaging should be discussed early because it affects cost, carton dimensions, freight planning and product presentation for Amazon, Shopify, corporate gifts or promotional programs."],
  ["Do you work with Amazon sellers?", "Yes. HDS works with Amazon sellers who need low MOQ tests, product comparison, logo customization, packaging support, barcode or carton mark discussion and restock planning. Sellers can send target product, quantity, logo and marketplace requirements for a faster quote."],
  ["Do you work with TikTok Shop sellers?", "Yes. TikTok Shop sellers often need visual products, fast sample support and small-batch testing before scaling. HDS can help compare trendy tumblers, colorful water bottles, gift-ready drinkware and packaging ideas suitable for live commerce or short launch cycles."],
  ["Do you support Shopify brands?", "Yes. Shopify brands can discuss private label drinkware, logo placement, packaging consistency, product line expansion and repeat order planning. HDS can help compare product options and prepare a sourcing path that fits the brand's audience and target price."],
  ["Can you help with DDP/DDU shipping?", "Yes. HDS can coordinate DDP/DDU shipping options by project and destination market. Buyers can also discuss FOB or EXW when needed. Shipping planning depends on carton size, weight, destination country, delivery timing and product packaging requirements."],
  ["How long does sampling take?", "Sampling time depends on product stock, logo method and packaging requirement. Stock samples can usually be arranged faster when available. Logo samples or packaging samples need additional time for artwork confirmation, decoration setup and sample review before bulk order approval."],
  ["How long does bulk production take?", "Bulk production is commonly planned around 30-35 days after sample approval and order confirmation, depending on product type, quantity, material, logo method, packaging and season. HDS will confirm a realistic timeline based on project details."],
  ["What information should I provide for a faster quote?", "For a faster quote, please share product photo, quantity, logo file, capacity, material preference, packaging request, target market, destination country and delivery timing. If you are unsure, describe your sales channel and target price range."],
  ["Can I send a product photo for quotation?", "Yes. A product photo, link or screenshot is very helpful. HDS can use it to identify product type, capacity, material, lid structure, logo area and possible packaging route before preparing a quotation or suggesting similar options."],
  ["Do you support OEM/ODM projects?", "Yes. HDS supports OEM/ODM drinkware projects depending on product type, quantity, customization complexity and production feasibility. OEM/ODM support can include product matching, logo, color, finish, packaging, sample coordination and supply chain communication."],
  ["What markets do you serve?", "HDS serves buyers in the US, UK, Europe, Brazil, Middle East, Africa and other overseas markets. Typical buyers include Amazon sellers, TikTok Shop sellers, Shopify brands, gift companies, distributors, corporate gift buyers and wholesale buyers."],
];

writeFile("faq/index.html", pageShell({
  title: "Custom Drinkware FAQ | HDS Drinkware",
  meta: "Custom drinkware FAQ covering MOQ, logo methods, samples, packaging, Amazon sellers, TikTok Shop sellers, Shopify brands, OEM/ODM and shipping support.",
  slug: "faq",
  h1: "Custom Drinkware FAQ",
  eyebrow: "Buyer questions",
  intro: "Answers for buyers sourcing custom tumblers, water bottles, promotional drinkware and gift drinkware sets from HDS Drinkware.",
  body: `<section class="section landing-faq">${faqItems.map(([q, a]) => `<article><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("")}</section><section class="section"><div class="landing-cta-band"><div><h2>Still preparing your quote?</h2><p>Send product photo, quantity, logo requirement, packaging request and target market for faster support.</p></div><div class="hero-actions"><a class="button whatsapp" href="${wa("Hello HDS Drinkware, I have a custom drinkware question and would like a quote.")}" target="_blank" rel="noopener">Get Quote on WhatsApp</a><a class="button primary" href="/#inquiry">Request OEM Quote</a></div></div></section>`,
  schemas: [breadcrumbSchema([{ name: "Home", url: `${site}/` }, { name: "FAQ", url: `${site}/faq/` }]), faqSchema(faqItems)],
}));
allUrls.push("/faq/");

const infoPages = [
  {
    slug: "about-hds-drinkware",
    schemaType: "AboutPage",
    title: "About HDS Drinkware",
    h1: "About HDS Drinkware",
    intro: "HDS Drinkware belongs to Shanxi Huandingsheng Industry and Trade Co., Ltd. We provide China-based custom drinkware sourcing and OEM/ODM support for Amazon sellers, gift companies, distributors and wholesale buyers.",
    images: [["assets/trade-show-buyers.png", "International buyers discussing custom drinkware sourcing"], ["assets/trust-proof/sample-cases.jpg", "Custom drinkware sample cases for buyer review"], ["assets/trust-proof/logo-customization.jpg", "Custom logo tumbler sample before bulk order"]],
    sections: [
      ["What HDS Does", "HDS helps overseas buyers compare custom drinkware options, prepare quotes, review samples, confirm logo methods, plan packaging and coordinate export details. The work is practical: product matching, supplier communication, order follow-up and buyer-side preparation."],
      ["Who We Serve", "Typical buyers include Amazon sellers, TikTok Shop sellers, Shopify brands, corporate gift buyers, promotional companies, distributors and wholesale importers. These buyers usually need low MOQ testing, repeatable product options, clear samples and fast communication."],
      ["How We Communicate", "A useful first discussion includes product photo, target quantity, logo artwork, packaging request, destination country and delivery timing. HDS uses this information to suggest a realistic sourcing path instead of forcing one standard SKU."],
      ["Positioning", "We keep the positioning transparent: HDS is a custom drinkware sourcing and OEM/ODM support partner backed by long-term drinkware supply chain resources, not a retail brand selling a fixed consumer catalog."],
    ],
  },
  {
    slug: "factory-supply-chain",
    schemaType: "WebPage",
    title: "Factory and Supply Chain Resources",
    h1: "Factory and Supply Chain Resources for Custom Drinkware",
    intro: "HDS coordinates factory and supply chain resources for custom drinkware projects, including product matching, sampling, production follow-up, packaging and shipping support.",
    images: [["assets/factory-workshop.png", "Drinkware workshop and packing area"], ["assets/trust-proof/production-line.jpg", "Drinkware production line for custom tumbler orders"], ["assets/factory-machines.png", "Automated drinkware production equipment"]],
    sections: [
      ["Supply Chain Role", "HDS helps buyers connect product demand with suitable drinkware production resources. The team compares product type, material, capacity, lid, surface finish, logo method, packaging and order quantity before recommending a path."],
      ["Production Coordination", "Production coordination covers sample confirmation, logo placement, color and finish discussion, packaging details, carton marks and order follow-up. This is especially important for buyers who need repeat orders rather than a one-time sample."],
      ["Factory Proof", "Buyers can review product photos, workshop photos, packaging photos and sample proof before moving forward. For important orders, HDS recommends confirming a sample or logo sample before bulk production."],
      ["Best Fit Projects", "The supply chain is best suited for custom tumblers, stainless steel cups, plastic water bottles, sports bottles, coffee cups, promotional drinkware and gift packaging projects with clear B2B requirements."],
    ],
  },
  {
    slug: "quality-control",
    schemaType: "WebPage",
    title: "Quality Control for Custom Drinkware",
    h1: "Quality Control for Custom Drinkware Orders",
    intro: "Quality control for custom drinkware should cover material, appearance, logo, function, packaging, carton marks and pre-shipment review.",
    images: [["assets/trust-proof/qc-inspection.jpg", "Drinkware QC inspection before shipment"], ["assets/process-production-packing-qc.jpg", "Production packing and QC for custom drinkware"], ["assets/trust-proof/sample-cases.jpg", "Sample cases reviewed before bulk production"]],
    sections: [
      ["Before Production", "The most important control step is confirming product reference, material, capacity, logo method, packaging and sample expectation before bulk work starts. Clear approval reduces misunderstandings later."],
      ["During Production", "Production follow-up should check color, surface finish, lid fit, logo placement, decoration effect and packaging consistency. When details are unclear, sample photos or videos should be used for buyer confirmation."],
      ["Before Shipment", "Pre-shipment review should include product appearance, quantity, carton marks, packaging condition and carton information. This helps buyers prepare marketplace, warehouse or distributor receiving work."],
      ["Buyer Responsibility", "Quality control works best when buyers provide clear artwork, product references, packaging requirements and destination rules early. HDS can then coordinate practical checks against those agreed requirements."],
    ],
  },
  {
    slug: "packaging-solutions",
    schemaType: "CollectionPage",
    title: "Custom Drinkware Packaging Solutions",
    h1: "Custom Drinkware Packaging Solutions",
    intro: "HDS supports standard box, color box, gift box, sleeve, card, tote bag, carton and Amazon-friendly packaging discussions for drinkware buyers.",
    images: [["assets/trust-proof/packaging.jpg", "Gift box packaging for custom drinkware"], ["assets/packing.webp", "Drinkware packing and carton preparation"], ["assets/catalog/gift-drinkware-assortment.jpg", "Custom drinkware gift set assortment"]],
    sections: [
      ["Packaging Options", "Common packaging options include standard box, color box, gift box, sleeve, insert card, label, tote bag, barcode and carton marks. The right choice depends on sales channel, budget and delivery requirements."],
      ["E-commerce Packaging", "Amazon and Shopify buyers often need barcode planning, product presentation, carton information and packaging that fits warehouse handling. Packaging should be discussed before confirming final product cost."],
      ["Gift Packaging", "Corporate gift and event buyers may need a more finished presentation: gift box, card, insert, sleeve or bundled accessories. These details affect sample timing and carton dimensions."],
      ["Cost and Freight Impact", "Packaging changes unit cost, carton volume and shipping cost. HDS helps buyers compare practical options so presentation improves without creating avoidable freight pressure."],
    ],
  },
  {
    slug: "shipping-support",
    schemaType: "WebPage",
    title: "Drinkware Shipping Support",
    h1: "Shipping Support for Custom Drinkware Buyers",
    intro: "HDS can coordinate DDP, DDU, FOB, EXW, carton packing and shipment communication for custom drinkware orders.",
    images: [["https://sc02.alicdn.com/kf/Hd4c80ddf2a684a77a6d8d966173716a4r.jpg", "Pallets of custom drinkware cartons labeled and ready for container loading"], ["https://sc02.alicdn.com/kf/H8a8ddd94712e422fbc822ac72646a077w.jpg", "FBA-compliant shipping cartons labeled in delivery truck"], ["https://sc02.alicdn.com/kf/Hc2dd8ffcd4ec4f529fce437a0ecd93deM.jpg", "Full container truck with cargo ready for export delivery"]],
    sections: [
      ["Shipping Terms", "Buyers can discuss DDP, DDU, FOB or EXW depending on order size, destination country and whether they already work with a forwarder. Each term changes cost responsibility and communication needs."],
      ["Carton Data", "Carton size, gross weight, packing quantity and destination address type are needed for practical shipping estimates. Packaging decisions should be settled before final shipping comparison."],
      ["Marketplace Buyers", "Amazon and e-commerce sellers may need carton marks, barcode coordination and delivery timing that fits launch or restock plans. HDS can help prepare the shipment information needed for these discussions."],
      ["Risk Control", "Shipping plans should leave room for sample approval, production, packing, export preparation and destination handling. HDS avoids promising unrealistic delivery dates before project details are clear."],
    ],
  },
  {
    slug: "case-studies",
    schemaType: "CollectionPage",
    title: "Custom Drinkware Case Studies",
    h1: "Custom Drinkware Case Studies",
    intro: "These anonymous examples show practical support situations without fake customer names, fake order amounts or invented reviews.",
    images: [["assets/catalog/40oz-ice-tumbler.jpg", "40oz tumbler sample for online seller testing"], ["assets/trust-proof/packaging.jpg", "Gift packaging review for custom drinkware order"], ["assets/trust-proof/logo-customization.jpg", "Logo water bottle sample review"]],
    sections: [
      ["1. Custom 40oz Tumblers for an Amazon Seller", "A detailed walk-through of matching specific viral colors, packaging design to reduce dimensional weight charges, and pre-labeling for Amazon FBA warehouses. <a href='/case-studies/custom-40oz-tumblers-for-amazon-seller/'>Read Full Case Study &rarr;</a>"],
      ["2. Custom Stainless Steel Tumblers for a Corporate Gift Buyer", "Sourcing matte powder-coated vacuum travel mugs, custom velvet-lined magnetic gift boxes, and fast-track shipping under LFGB food-safety standards. <a href='/case-studies/custom-stainless-steel-tumblers-for-corporate-gift-buyer/'>Read Full Case Study &rarr;</a>"],
      ["3. Low MOQ Custom Water Bottles for a Startup Brand", "How we helped a startup fitness brand launch custom sports bottles with custom-printed time markers in a small batch of 300 pcs. <a href='/case-studies/low-moq-custom-water-bottles-for-startup-brand/'>Read Full Case Study &rarr;</a>"],
      ["4. Custom Drinkware Gift Sets for Event Promotion", "Coordinating matching matte black coffee cups and flasks inside luxury rigid magnetic boxes with custom velvet inserts for an exhibition. <a href='/case-studies/custom-drinkware-gift-sets-for-event-promotion/'>Read Full Case Study &rarr;</a>"],
      ["5. DDP Shipping Drinkware Order to Overseas Buyer", "Providing multi-location door-to-door delivery in Sydney and Melbourne, including Ningbo customs, GST payment, and local tail-end truck shipping. <a href='/case-studies/ddp-shipping-drinkware-order-to-overseas-buyer/'>Read Full Case Study &rarr;</a>"],
      ["What These Cases Show", "Most B2B drinkware projects are won or lost on preparation: clear product reference, realistic MOQ, sample review, packaging detail and shipping discussion. HDS structures the conversation around those points."],
    ],
  },
  {
    slug: "contact",
    schemaType: "ContactPage",
    title: "Contact HDS Drinkware",
    h1: "Contact HDS Drinkware",
    intro: "Contact HDS Drinkware for custom tumblers, water bottles, sports bottles, coffee cups, promotional drinkware and gift drinkware set quotations.",
    images: [["assets/trade-show-buyers.png", "International buyers discussing custom drinkware products"], ["assets/trust-proof/sample-cases.jpg", "Custom drinkware samples for quote discussion"], ["assets/trust-proof/shipping-cartons.jpg", "Carton packing information for quote preparation"]],
    sections: [
      ["Contact Details", `Email: ${email}. WhatsApp: ${displayPhone}. Buyers can send product photos, screenshots, catalog references or rough project ideas for the first discussion.`],
      ["Fast Quote Information", "For a faster quote, share product photo, quantity, logo requirement, packaging request, destination country, target timeline and buyer channel. If the product is not fixed yet, share target price range and use case."],
      ["Sample Requests", "Sample discussions should include product type, logo needs, packaging needs and delivery country. Stock samples may move faster when available, while logo samples need artwork confirmation."],
      ["Best Projects to Send", "HDS is best suited for B2B custom drinkware projects: stainless steel tumblers, custom water bottles, promotional drinkware, private label products, gift sets and low MOQ market tests."],
    ],
  },
];

function infoBody(page) {
  const visuals = page.images ? productImageStrip({ h1: page.h1, images: page.images }, 1) : "";
  return `${visuals}<section class="section landing-copy-block">${page.sections.map(([heading, text]) => `<article><h2>${esc(heading)}</h2><p>${esc(text)}</p></article>`).join("")}</section><section class="section landing-quote-checklist"><div><p class="eyebrow">Before you contact HDS</p><h2>Prepare the details that make B2B sourcing faster.</h2><p>Clear product, logo, packaging and shipping information helps the team reply with a practical path instead of a generic answer.</p></div><ul><li>Product photo, target capacity, material preference and sales channel.</li><li>Order quantity, sample need and destination country.</li><li>Logo artwork, logo size, logo position and preferred logo method.</li><li>Packaging request, carton marks, barcode needs or gift set plan.</li><li>Target timeline and shipping preference such as DDP, DDU, FOB or EXW.</li></ul></section><section class="section"><div class="landing-cta-band"><div><h2>Need custom drinkware support?</h2><p>Send your product photo, quantity, logo requirement, packaging request and target market.</p></div><div class="hero-actions"><a class="button whatsapp" href="${wa(`Hello HDS Drinkware, I would like support for ${page.h1}.`)}" target="_blank" rel="noopener">Get Quote on WhatsApp</a><a class="button primary" href="/#inquiry">Request OEM Quote</a></div></div></section>`;
}

for (const page of infoPages) {
  writeFile(`${page.slug}/index.html`, pageShell({
    title: `${page.title} | HDS Drinkware`,
    meta: metaInfo(page.title),
    slug: page.slug,
    h1: page.h1,
    eyebrow: "HDS Drinkware",
    intro: page.intro,
    body: infoBody(page),
    schemas: [
      breadcrumbSchema([{ name: "Home", url: `${site}/` }, { name: page.h1, url: `${site}/${page.slug}/` }]),
      pageTypeSchema(page),
    ],
  }));
  allUrls.push(`/${page.slug}/`);
}

const caseStudies = [
  {
    slug: "custom-40oz-tumblers-for-amazon-seller",
    title: "Custom 40oz Tumblers for an Amazon Seller",
    images: [
      ["https://sc02.alicdn.com/kf/H8a8ddd94712e422fbc822ac72646a077w.jpg", "FBA-compliant carton labeling inside delivery truck"],
      ["https://sc02.alicdn.com/kf/Hd4c80ddf2a684a77a6d8d966173716a4r.jpg", "Pallets of custom tumblers labeled for FBA shipping"]
    ],
    clientType: "Amazon FBA Private Label Seller",
    market: "United States (FBA Warehouse)",
    product: "40oz Double-Wall Vacuum Insulated Tumbler with Handle & Straw",
    quantityRange: "1,200 pcs (Initial Launch)",
    customizationRequest: "Custom Pantone color matching for gradient spray paint, laser-engraved brand logo, custom cardboard divider packaging, and FBA-compliant barcode labeling.",
    logoMethod: "High-precision laser engraving (dishwasher-safe, no peeling)",
    packaging: "Individually wrapped in biodegradable polybags, placed in standard egg-crate cardboard dividers to maximize shipping density and reduce cost.",
    productionTimeline: "28 days from sample approval to bulk shipment ready",
    shippingMethod: "DDP Sea Freight directly to Amazon FBA Warehouse in California",
    challenge: "The client wanted to match a specific viral pastel color palette with a clean, high-definition laser logo. However, standard shipping for bulky 40oz tumblers is extremely expensive, and any shipping damage or delayed delivery would hurt their launch window. Additionally, Amazon has strict barcode and carton requirements.",
    solution: "HDS orchestrated Pantone color-matching samples with real-time video confirmations and physically sent a proofing sample to the client within 7 days. We worked with our packaging supplier to custom-design outer cartons that perfectly match Amazon's size and weight limits, saving 15% in dimensional weight cargo fees. We pre-applied all FBA carton labels and individual product barcodes in our warehouse.",
    result: "1,200 pcs of custom 40oz tumblers were successfully delivered directly to the FBA warehouse under a DDP agreement with zero customs friction. The client launched on schedule, received a 4.8-star initial rating with praise for color accuracy, and placed a reorder of 3,000 pcs within 4 weeks."
  },
  {
    slug: "custom-stainless-steel-tumblers-for-corporate-gift-buyer",
    title: "Custom Stainless Steel Tumblers for a Corporate Gift Buyer",
    clientType: "Corporate HR & Brand Agency",
    market: "Germany / European Union",
    product: "30oz Matte Powder-Coated Vacuum Travel Tumbler",
    quantityRange: "500 pcs",
    customizationRequest: "Laser engraving of corporate logo, custom individual kraft gift box with custom tissue paper wrap, and custom greeting insert cards.",
    logoMethod: "Laser Engraving",
    packaging: "Custom matte-black kraft gift boxes with white logo print, custom cardboard inner cushion, custom printed greeting card, and individual tissue paper wrapping.",
    productionTimeline: "15 days from sample approval",
    shippingMethod: "DDP Air Freight directly to corporate office in Munich",
    challenge: "The client needed 500 premium insulated travel mugs for an upcoming annual global partner summit in Munich. The entire order, including custom tissue paper, greeting cards, and elegant packaging, had to be delivered to their office door within 25 days. Compliance with European food-contact safety standards (LFGB) was non-negotiable.",
    solution: "HDS expedited the sample production, completing the laser-engraved travel mug and printed gift boxes in just 4 days. We coordinated with our partner factory to ensure 100% food-grade SUS304 (18/8) stainless steel with LFGB compliance documents. We consolidated the mugs, greeting cards, and packaging in-house, assembled the gift sets, and booked direct DDP air freight.",
    result: "The 500 completed gift sets were delivered directly to the corporate office in Munich in 21 days—4 days ahead of the event. The corporate partners praised the high-end unboxing presentation and excellent thermal performance of the mugs, leading to a recurring annual corporate gifting contract."
  },
  {
    slug: "low-moq-custom-water-bottles-for-startup-brand",
    title: "Low MOQ Custom Water Bottles for a Startup Brand",
    clientType: "Fitness & Athleisure Startup Brand",
    market: "United Kingdom",
    product: "32oz Tritan BPA-Free Plastic Sports Bottle with Time Marker & Straw",
    quantityRange: "300 pcs (Low-MOQ Test Order)",
    customizationRequest: "Single-color screen-printed custom motivational time-markers, custom brand logo, matching custom color silicone carry loop, and individual retail color boxes.",
    logoMethod: "Silk Screen Printing (Durable food-grade inks)",
    packaging: "Individual custom color-printed cardboard boxes with product features, packed 30 pcs per export master carton.",
    productionTimeline: "18 days from sample approval",
    shippingMethod: "DDU Air Freight to London",
    challenge: "As a newly launched online boutique, the client wanted to test a custom sports bottle line with minimal upfront capital. They required a low MOQ of 300 pcs, but most China plastic manufacturers require a minimum of 2,000 to 3,000 pcs for custom print. They also needed the bottles to be 100% odor-free and durable.",
    solution: "HDS leveraged our close relationships with our partner plastic bottle factories to secure a low MOQ of 300 pcs using stock translucent bottle colors. We arranged a high-durability silk-screen logo and custom time-marker print in-house. We utilized certified BPA-free Eastman Tritan-style copolyester to ensure 100% odorless daily use and high impact resistance.",
    result: "The 300 custom bottles were completed and delivered to London via DDU air freight within 26 days total. The client sold out their initial stock within 3 weeks via Instagram and TikTok, establishing proof of concept and placing a follow-up order of 1,500 pcs."
  },
  {
    slug: "custom-drinkware-gift-sets-for-event-promotion",
    title: "Custom Drinkware Gift Sets for Event Promotion",
    clientType: "Global Event Organizer & Marketing Agency",
    market: "United Arab Emirates (Dubai)",
    product: "Curated Matte Coffee Cup + Double-Wall Vacuum Water Flask Gift Set",
    quantityRange: "800 sets",
    customizationRequest: "Coordinated matte black color finish across both drinkware items, matching UV printed corporate logo on both items, and a custom magnetic-closure gift box with custom foam inserts.",
    logoMethod: "Multi-colored UV flatbed printing",
    packaging: "Elegant premium matte-black rigid box with magnetic closure, custom-cut EVA foam insert wrapped in velvet, custom-printed thank you sleeve.",
    productionTimeline: "22 days from sample approval",
    shippingMethod: "DDP Sea Freight to Dubai port with door delivery",
    challenge: "A marketing agency in Dubai needed 800 high-end gift sets containing a matching insulated coffee mug and insulated water bottle with a complex, multi-colored logo. Both items had to perfectly match in color and finish, and the magnetic gift box needed to survive heavy container transport without any collapsing or denting.",
    solution: "HDS sourced the coffee mug and flask from our specialized vacuum partner lines, conducting strict in-house color auditing to ensure a 100% color-match across different styles. We designed a rigid cardboard magnetic-closure box with reinforced 2mm greyboard walls and custom high-density EVA foam to lock the items in place. We completed DDP sea-to-door logistics directly to the exhibition center.",
    result: "All 800 premium gift sets arrived in immaculate condition directly at the exhibition hall in Dubai. The marketing agency reported that the premium sets were the highlight of the event, dramatically increasing their high-value client acquisition rate."
  },
  {
    slug: "ddp-shipping-drinkware-order-to-overseas-buyer",
    title: "DDP Shipping Drinkware Order to Overseas Buyer",
    images: [
      ["https://sc02.alicdn.com/kf/Hc2dd8ffcd4ec4f529fce437a0ecd93deM.jpg", "Full container truck with cargo ready for export delivery with DDP terms"],
      ["https://sc02.alicdn.com/kf/Hd4c80ddf2a684a77a6d8d966173716a4r.jpg", "Carton pallet loading for container shipping to Australia"]
    ],
    clientType: "Regional Wholesale Distributor",
    market: "Australia (Sydney & Melbourne)",
    product: "Assorted Custom Insulated Beer Growlers & Pint Cups",
    quantityRange: "2,500 pcs",
    customizationRequest: "Laser engraved logo, custom carton mark, mixed color allocation (matte black, olive green, and brushed steel) in each shipping carton.",
    logoMethod: "Laser Engraving",
    packaging: "Each growler in an individual bubble wrap sleeve and standard cardboard box; custom color-coded master cartons for easy distributor sorting.",
    productionTimeline: "25 days",
    shippingMethod: "DDP Sea Freight with door delivery to multiple warehouse locations",
    challenge: "An Australian distributor ordered a mixed batch of growlers and pint cups totaling 2,500 pcs. Sourcing large-volume heavy growlers creates complex shipping challenges, and the client had no import license and wanted a single, final price that includes all ocean freight, port charges, customs clearance, import duties, and local truck delivery to Sydney and Melbourne.",
    solution: "HDS offered a complete DDP sea freight shipping quote. We managed export customs in Ningbo, booked ocean transit with top-tier carriers, handled Australian customs clearance through our trusted local partner, paid all customs import duties and GST, and arranged local tail-end truck delivery to their two distinct warehouses.",
    result: "The distributor received their mixed growler cargo directly at their warehouse docks in Sydney and Melbourne, requiring zero paperwork or hidden fees on their end. By outsourcing the entire import process to HDS, the client saved an estimated $3,400 in port fees and local customs broker costs compared to their previous freight forwarder."
  }
];

for (const caseStudy of caseStudies) {
  const meta = `Case Study: ${caseStudy.title}. Learn how HDS Drinkware helped a B2B buyer solve challenges in product customization, packaging, QC and shipping.`;
  const intro = `This B2B case study explains the sourcing, customization, quality control, packaging, and shipping process HDS coordinated for an anonymous ${caseStudy.clientType}.`;
  
  const studyImages = caseStudy.images || [
    ["assets/catalog/40oz-ice-tumbler.jpg", "Drinkware sample development and packaging coordination"],
    ["assets/trust-proof/packaging.jpg", "Premium gift box and custom insert assembly"]
  ];

  const studyVisuals = `<section class="section landing-product-visuals" aria-label="${esc(caseStudy.title)} visuals">
    ${studyImages.map(([src, alt]) => `<figure><img src="${src.startsWith("http") ? src : `../../${src}`}" alt="${esc(alt)}" width="900" height="900" loading="lazy" decoding="async" /><figcaption>${esc(alt)}</figcaption></figure>`).join("")}
  </section>`;

  const body = `
    ${studyVisuals}
    <section class="section landing-content landing-detail">
      <article>
        <h2>Project Overview Table</h2>
        <div class="landing-table-wrap">
          <table class="landing-table">
            <tbody>
              <tr><th>Client Type</th><td>${esc(caseStudy.clientType)}</td></tr>
              <tr><th>Market</th><td>${esc(caseStudy.market)}</td></tr>
              <tr><th>Product</th><td>${esc(caseStudy.product)}</td></tr>
              <tr><th>Quantity Range</th><td>${esc(caseStudy.quantityRange)}</td></tr>
              <tr><th>Customization Request</th><td>${esc(caseStudy.customizationRequest)}</td></tr>
              <tr><th>Logo Method</th><td>${esc(caseStudy.logoMethod)}</td></tr>
              <tr><th>Packaging Solutions</th><td>${esc(caseStudy.packaging)}</td></tr>
              <tr><th>Production Lead Time</th><td>${esc(caseStudy.productionTimeline)}</td></tr>
              <tr><th>Shipping Method</th><td>${esc(caseStudy.shippingMethod)}</td></tr>
            </tbody>
          </table>
        </div>
      </article>
      <article>
        <h2>The Challenge</h2>
        <p>${esc(caseStudy.challenge)}</p>
      </article>
      <article>
        <h2>The Solution</h2>
        <p>${esc(caseStudy.solution)}</p>
      </article>
      <article>
        <h2>The Result</h2>
        <p>${esc(caseStudy.result)}</p>
      </article>
    </section>
    <section class="section">
      <div class="landing-cta-band">
        <div>
          <h2>Have a similar B2B drinkware project?</h2>
          <p>Send your target product reference, quantity, logo details, and destination. HDS will help plan a practical, risk-free sourcing path.</p>
        </div>
        <div class="hero-actions">
          <a class="button whatsapp" href="${wa(`Hello HDS Drinkware, I read your case study about ${caseStudy.title}. I have a similar project.`)}" target="_blank" rel="noopener">Discuss Project on WhatsApp</a>
          <a class="button primary" href="../../#inquiry">Request Custom Quote</a>
        </div>
      </div>
    </section>
  `;

  writeFile(`case-studies/${caseStudy.slug}/index.html`, pageShell({
    title: `${caseStudy.title} | HDS Drinkware`,
    meta,
    slug: `case-studies/${caseStudy.slug}`,
    h1: caseStudy.title,
    eyebrow: "B2B Case Study",
    intro,
    body,
    depth: 2,
    schemas: [
      breadcrumbSchema([{ name: "Home", url: `${site}/` }, { name: "Case Studies", url: `${site}/case-studies/` }, { name: caseStudy.title, url: `${site}/case-studies/${caseStudy.slug}/` }])
    ]
  }));
  allUrls.push(`/case-studies/${caseStudy.slug}/`);
}

writeFile("404.html", `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="robots" content="noindex, follow" /><title>Page Not Found | HDS Drinkware</title><link rel="stylesheet" href="/styles.css" /></head><body class="landing-page">${header(0)}<main><section class="landing-hero"><p class="eyebrow">404</p><h1>Page Not Found</h1><p>The page may have moved. You can return to HDS Drinkware sourcing pages, view the product catalog, or contact us on WhatsApp for a quote.</p><div class="hero-actions"><a class="button primary" href="/">Return Home</a><a class="button secondary" href="/#catalog">View Product Catalog</a><a class="button whatsapp" href="${wa("Hello HDS Drinkware, I need help finding a custom drinkware product page.")}" target="_blank" rel="noopener">Get Quote on WhatsApp</a></div></section></main></body></html>`);

writeFile("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map((u) => `  <url>\n    <loc>${site}${u}</loc>\n    <lastmod>${updated}</lastmod>\n    <changefreq>${u === "/" ? "weekly" : "monthly"}</changefreq>\n    <priority>${u === "/" ? "1.0" : u.startsWith("/sourcing-guides/") && u !== "/sourcing-guides/" ? "0.7" : "0.8"}</priority>\n  </url>`).join("\n")}\n</urlset>\n`;
writeFile("sitemap.xml", sitemap);

console.log(`Generated ${allUrls.length} sitemap URLs.`);
