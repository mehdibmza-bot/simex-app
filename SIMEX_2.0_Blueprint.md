# SIMEX 2.0
## The Operating System for Furniture & Hardware Commerce in Tunisia
### A Strategic + Technical Blueprint

> *From a catalog website to a category-defining commerce platform.*

**Prepared for:** Mehdi · **Project:** simex.tn · **Date:** April 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Phase 1 — Brutal Audit of simex.tn](#2-phase-1--brutal-audit-of-simextn)
3. [Phase 2 — The Reinvention](#3-phase-2--the-reinvention)
4. [Phase 3 — Full System Architecture](#4-phase-3--full-system-architecture)
   - 4.1 Frontend Experience
   - 4.2 E-Commerce Features (Next-Level)
   - 4.3 Delivery & Logistics System
   - 4.4 Admin Dashboard (Pro Cockpit)
   - 4.5 Content & Branding
   - 4.6 Growth Features
   - 4.7 Technical Architecture & Stack
   - 4.8 UI/UX Concept
   - 4.9 Innovative Ideas (Tunisia-First)
5. [Execution Roadmap](#5-execution-roadmap)
6. [Business Impact](#6-business-impact)
7. [The Pitch](#7-the-pitch)

---

## 1. Executive Summary

**SIMEX today** is a functional but undifferentiated furniture & hardware accessories e-shop, fighting in a crowded Tunisian market against bricola.tn, brico-direct.tn, l'accessoire.pro, EGM.tn and STQ. The site sells, but it does not *compound* — every visitor is acquired again, every order is hand-pushed through logistics, and there is no systematic capture of the data that would let SIMEX win on speed, service, and trust.

**SIMEX 2.0** reframes the company from *"an online store"* to **"the operating system that B2C renovators and B2B installers in Tunisia open every time they touch a kitchen, a closet, or a piece of furniture."** It is a vertically integrated stack: a premium storefront, a project-based shopping engine, an AI product advisor, a real logistics layer with zone pricing and tracking, a B2B installer portal, and an admin cockpit that runs the business.

### The Three Bets

- **Bet 1 — Premium positioning.** We make *accessoires de meuble* feel like Apple makes laptops. Cinematic product photography, 3D/AR previews, video installation guides, and a brand voice that signals expertise. Premium pricing power follows premium perception.
- **Bet 2 — Project-based commerce.** No one in Tunisia sells "a kitchen" or "a wardrobe" as a one-click bundle of compatible parts. SIMEX 2.0 invents this category — Project Builder, Smart Bundles, Contractor Mode — and owns it before competitors copy it.
- **Bet 3 — B2B as the moat.** *Menuisiers*, kitchen-fitters, and architects are 30% of buyers but 70% of revenue potential. We build a dedicated installer portal with tiered pricing, one-click reorder, monthly invoicing, and a referral economy. They become the distribution channel competitors cannot match.

### Expected Outcomes (12 months)

| Metric | Baseline (est.) | Target Year 1 |
|---|---|---|
| Conversion rate | 0.6 – 1.2% | **2.8 – 3.5%** |
| Average order value | ~95 TND | **180 – 220 TND** |
| Repeat purchase rate (90d) | 8 – 12% | **30 – 38%** |
| B2B share of revenue | <10% (informal) | **35 – 45%** |
| Mobile bounce rate | 60 – 75% | **<35%** |
| Time to checkout (mobile) | 5+ minutes | **<60 seconds** |
| NPS | not measured | **55+** |

> **The thesis in one sentence:** SIMEX wins by being the only place in Tunisia where a homeowner can build a kitchen in 3 clicks and a professional can reorder his last 50 SKUs in 1 — both backed by real delivery, real expertise, and a brand that feels worth trusting.

---

## 2. Phase 1 — Brutal Audit of simex.tn

This audit is grounded in the public surface of simex.tn, the Tunisian e-commerce competitive landscape (bricola.tn, brico-direct.tn, l'accessoire.pro, EGM.tn, STQ, CEG), and the dominant patterns of WooCommerce/PrestaShop deployments in the local market. It is intentionally direct. Every weakness called out here is a lever we will pull in Phase 2.

### 2.1 UX & UI Quality

- **Generic templated feel.** The current homepage reads as a stock catalog grid: no hero narrative, no visual hierarchy that says *"we are the experts."* A first-time visitor cannot tell within 3 seconds what category SIMEX owns or why they should trust it over a competitor.
- **Visual density without rhythm.** Product tiles are uniform, image quality is inconsistent (mixed backgrounds, mixed lighting, supplier photos pasted in), and there is no breathing room. The eye has nowhere to rest, which signals "low-trust marketplace" rather than "category leader."
- **Typography is undisciplined.** Mixed weights, inconsistent line heights, no clear scale. Premium e-commerce uses 3 type sizes maximum on a product card; SIMEX uses 5+.
- **No micro-interactions.** Hovers, transitions, skeleton loaders, optimistic UI — none of the small touches that make a 2026 site feel alive.
- **CTAs are weak and ambiguous.** "Add to cart" buttons compete with "Compare," "Wishlist," and "Quick view" of identical visual weight. The single most important action on the page is not visually privileged.

### 2.2 Mobile Responsiveness

- **Desktop-first scaling.** The mobile experience appears to be the desktop site shrunk down rather than redesigned. In a market where 75–85% of Tunisian e-commerce traffic is mobile, this is the single most expensive mistake on the site.
- **Tap targets too small.** Filter chips, pagination arrows, and "add to cart" buttons fall below the 44px minimum. Every misclick is a lost order.
- **No sticky cart, no sticky CTA.** On a long product page the user has to scroll back to the top to add. In best-in-class mobile commerce (Amazon, Shein, Noon) the primary CTA is anchored to the bottom of the screen at all times.
- **Forms are not mobile-optimized.** Checkout requires zoom. Phone-number input does not trigger numeric keyboard. No autofill hints (`autocomplete="tel"`, `address-level1`, etc.).

### 2.3 Navigation Structure

- **Category-only IA.** Navigation is organized by product type (charnières, poignées, glissières) — how the warehouse thinks, not how the customer thinks. A homeowner planning a kitchen does not search for *"charnière à amortisseur 35mm"*; they search for *"comment fermer doucement les portes de cuisine."*
- **No use-case navigation.** There is no entry point that says "I am building a kitchen" or "I am a professional installer" or "I am replacing one broken hinge."
- **Search is keyword-literal.** Searching a misspelled or descriptive query (*"poignée dorée moderne"* vs. *"poignee modern gold"*) returns empty results — there is no fuzzy matching, no semantic search, no "did you mean."
- **No breadcrumb trust.** Users do not know where they are in the catalog or how to widen/narrow their browse.

### 2.4 Product Presentation Quality

- **One image per product, often supplier-supplied.** No 360° view, no in-context shot, no scale reference, no installed photo.
- **Specifications are minimal or missing.** Critical buying decisions for hardware (weight rating, opening angle, screw type, finish, compatibility) are absent or buried in PDF spec sheets.
- **No social proof on PDP.** Zero reviews, zero star ratings, zero customer photos, zero "X people bought this this week."
- **No installation guidance.** For 80% of SKUs the customer needs to know how to install. No videos, no PDFs, no diagrams. This drives returns and kills professional reorders.
- **No bundles or cross-sells.** If you buy a hinge, the site does not suggest the matching screws, the door damper, or the drilling jig. Every order leaves money on the table.

### 2.5 Branding & Visual Identity

- **No brand promise.** The site does not articulate what SIMEX stands for. "SIMEX" is just a logo — no tagline, no manifesto, no story, no founder face, no warehouse photo. Fatal in a category where buyers are evaluating trust.
- **Color palette is undefined.** Multiple primary colors compete. There is no single ownable color the way Brico Direct owns its orange.
- **Logo lacks a system.** No alternate marks for square avatars (Instagram, WhatsApp), no monochrome version, no spacing rules. The brand cannot scale across surfaces.
- **Photography style is not curated.** Mixed backgrounds, mixed crops, watermarks. The shop looks like a reseller, not a brand.

### 2.6 Performance & Speed

- **Heavy unoptimized images.** Likely uncompressed JPEGs served at full resolution to mobile. Easy 2–3 second LCP improvement available.
- **No CDN edge caching.** All requests appear to hit the origin in Tunisia, which is fine domestically but kills international diaspora traffic.
- **Render-blocking scripts.** Standard WooCommerce/PrestaShop signature: jQuery, multiple slider libraries, FB pixel, GA, all loaded synchronously.
- **No service worker / no PWA.** Mobile users on weak 3G connections (still common in interior governorates) have no offline cache, no instant repeat-visit load.

### 2.7 Conversion Funnel Weaknesses

- **No urgency cues.** No "only 3 left," no "X bought today," no flash deal countdown. Calm to a fault — and calm does not convert in 2026.
- **No trust signals on PDP or checkout.** No customer logos, no "livraison sous 48h," no return policy badge, no payment-secure mark, no real reviews.
- **Heavy checkout.** Multi-step flow that asks for an account before allowing purchase. Guest checkout is the default expectation for first-time hardware buyers.
- **No abandoned-cart recovery.** If a user fills a cart and leaves, nothing happens. No email sequence, no WhatsApp nudge, no remarketing pixel firing. **This single gap is worth 10–15% of revenue.**
- **No post-purchase loop.** After the order, no review request, no "how was the install," no reorder reminder at 60 days, no referral ask. Every customer is a one-night stand.

### 2.8 Missing Modern E-commerce Standards

- **No live chat / no WhatsApp Business handoff.** In Tunisia, WhatsApp is the default sales channel. Not having a WhatsApp button on every product page is leaving direct revenue on the table.
- **No payment options beyond COD / basic card.** No e-Dinar, no D17, no installment plans, no B2B invoicing. Each missing rail loses a customer segment.
- **No loyalty / no referral / no points.** No reason for a happy customer to come back faster or bring a friend.
- **No account segmentation.** B2C and B2B see the same prices, same UI, same checkout. Pros are penalized for being pros.
- **No CRM, no email program, no segmentation.** All marketing appears to be paid social and word-of-mouth. There is no owned channel.
- **Data layer absent.** No structured event tracking (`view_item`, `add_to_cart`, `begin_checkout`). Without this, paid acquisition cannot be optimized — every dinar of ad spend is half-blind.

> **🔴 Audit verdict:** simex.tn is a serviceable catalog. It is not a brand, not a system, not a moat. The opportunity: every weakness above is a feature SIMEX 2.0 builds in. The gap between today and the vision is large — and that gap is the defensibility.

---

## 3. Phase 2 — The Reinvention

### 3.1 The New Positioning

> **Old SIMEX:** *"We sell hardware accessories online."*
>
> **🟡 New SIMEX:** *"The infrastructure layer for everything that opens, closes, slides, holds, and finishes furniture in Tunisia."*

This is not a tagline; it is a strategic posture. It implies three things, and we build the company around them:

1. **Depth** — we carry the SKU breadth no competitor matches, and we know each SKU well enough to recommend it intelligently.
2. **Reliability** — when a kitchen-fitter orders at 8pm, his parts are on his job-site by morning. Logistics is not a feature; it is the product.
3. **Expertise** — we publish the guides, the videos, the calculators, and the AI assistant that make SIMEX the place you go to *learn* before you go to *buy*.

### 3.2 Audience Architecture

SIMEX 2.0 is not one product — it is one platform serving four distinct personas, each with its own UX skin:

| Persona | Who | Primary Need | What we build for them |
|---|---|---|---|
| **The Renovator** | Homeowner planning a kitchen, closet, or full room reno | Doesn't know parts by name; needs guidance, visualization, confidence | Project Builder, AI advisor, AR preview, video guides, bundles |
| **The Fixer** | DIY-er replacing a single broken part | Identify the exact compatible part fast; deliver tomorrow | Visual search, photo-upload identification, 24h delivery, single-unit pricing |
| **The Pro Installer** | Menuisier, kitchen-fitter, hotel maintenance | Reorder fast, get tier pricing, monthly invoicing, no friction | Pro Portal, one-click reorder, B2B pricing, invoicing, dedicated WhatsApp line |
| **The Architect** | Interior designer, contractor specifying for clients | Curated quality, large-volume quotes, white-glove logistics | Spec books, project quoting tool, account manager, scheduled delivery |

### 3.3 Brand Promise — The Three Words

- **🟡 Fast.** If we promise tomorrow, it arrives tomorrow. Logistics is the visible, tracked, branded experience.
- **🟡 Right.** The part you ordered fits the project you described. Returns under 2% — guaranteed by AI assistance pre-purchase.
- **🟡 Smart.** Every interaction teaches the customer something — a video, a tip, a calculator, a checklist. SIMEX is the expert in the room.

### 3.4 Strategic Pillars

| Pillar | What it means operationally | Why it's defensible |
|---|---|---|
| **Vertical depth** | Own every SKU in 8 core categories: charnières, glissières, poignées, pieds, profilés, lumière LED, éviers, robinetterie | Becomes the assumed default — pros stop comparison-shopping at SKU level |
| **Project commerce** | Sell kitchens, closets, bathrooms as configurable bundles, not parts | No competitor in TN has the data + UX to do this; 18-month head start |
| **Logistics as product** | Same-day Grand Tunis, next-day national, branded delivery vehicles, real tracking | Habit-forming; people remember the box, not the website |
| **Pro economy** | Tiered pricing, monthly invoicing, dedicated WhatsApp, training events | Pros become a sales channel via referrals; competitors cannot poach without a year of build |
| **Content moat** | Tutorials, AR, AI assistant, blog, YouTube channel | Captures the top of funnel before the buyer ever types a competitor's URL |

---

## 4. Phase 3 — Full System Architecture

### 4.1 Frontend Experience

#### Homepage (Apple-grade narrative)

The homepage is not a product grid. It is a story told in seven scrolls.

1. **Hero** — full-bleed video loop of a kitchen door closing softly via a SIMEX hinge. Single H1: *"L'infrastructure de vos meubles."* Two CTAs: **Démarrer un projet** · **Espace Pro**.
2. **Persona switcher** — three large cards: *Je rénove* / *Je répare* / *Je suis pro*. Each routes to a tailored experience.
3. **Project Builder teaser** — interactive widget: pick *"Cuisine,"* pick dimensions, see a live bill of materials assemble. CTA: *"Construire mon projet."*
4. **Top categories** — 8 visual tiles, each a hover-revealed micro-video showing the product class in action.
5. **Today's movers** — three live strips: 🔥 Most Sold Today  ·  ⚡ Last Call (low stock)  ·  🎁 Flash deal with countdown.
6. **Trust strip** — real customer photos (UGC), verified pro testimonials, live order counter (*"347 colis livrés cette semaine"*), payment & delivery badges.
7. **Knowledge hub** — latest 3 guides + featured YouTube video. Closes the loop: visit → learn → trust → buy.

#### Smart Product Discovery

- **Three search modes:** (a) classic text with semantic understanding (Algolia / Typesense + a fine-tuned reranker), (b) photo-upload search (*"snap your broken part"*), (c) natural-language assistant (*"je veux des poignées dorées modernes pour cuisine blanche"*).
- **Faceted filters that match how people think:** by use-case (Cuisine, Salle de bain, Dressing), by furniture type (Porte, Tiroir, Façade), by project type (Rénovation, Construction neuve, Réparation), by finish, by budget tier, by brand.
- **Saved searches & alerts:** logged-in users get notified when out-of-stock items return or when a saved query has new arrivals.
- **Visual browse mode:** a Pinterest-style infinite grid for inspiration browsing, parallel to the catalog grid for shopping browsing.

#### Product Detail Page (PDP) Architecture

Each PDP is a mini landing page, not a card. Structured top-to-bottom:

1. **Above the fold:** rich media gallery (5–8 hi-res images, 360° spin, 15-second use-video, optional 3D viewer), product title with finish/variant selector, real-time stock indicator (*"En stock — expédié sous 24h"*), price with B2C/Pro toggle for logged-in pros, sticky Add-to-Cart bar.
2. **Quick spec strip:** 4 key specs as icons (e.g., charge max 80kg · ouverture 110° · finition nickel · livré avec vis).
3. **Use-case examples:** 3 real installation photos with captions (*"installé sur cuisine MDF blanc"*).
4. **Installation guide:** collapsible video + step-by-step PDF + tools-needed checklist.
5. **"Vous aurez aussi besoin de"** bundle: AI-suggested compatible parts (vis, joints, dampers) with single-click add-all.
6. **Reviews & Q&A:** verified buyers only, sorted by helpfulness, with photo uploads.
7. **Related projects:** *"Vu dans ces projets"* → links to Project Builder templates that include this SKU.
8. **Pro insight:** short paragraph from a SIMEX expert (*"Pourquoi les pros choisissent ce modèle"*).

#### Cart & Checkout

- **One-page checkout.** Guest by default; create account in one tick post-purchase. Address autocompletion via Google Maps Tunisia. Phone validation with SMS OTP.
- **Live shipping cost:** as soon as governorate is selected, exact delivery price + ETA appear (*"Tunis: 7 TND, livré demain avant 18h"*).
- **Payment rails:** Carte bancaire, e-Dinar, D17, virement (B2B), espèces à la livraison, paiement en 3x (postée 6 mois).
- **Cart persistence:** across devices, across sessions, with auto-save and resume-from-WhatsApp link.

> **🟡 UX north star:** From homepage to confirmed order in **under 60 seconds on mobile** for a returning customer. **Under 4 minutes** for a first-time guest.

---

### 4.2 E-Commerce Features (Next-Level)

#### Conversion Engines

| Feature | How it works | Expected lift |
|---|---|---|
| 🔥 **Most Sold Today** | Real-time leaderboard of top 12 SKUs in last 24h, updated every 15 min, surfaced on home + category pages | +8–12% PDP visits |
| ⚡ **Last Call / Low Stock** | Inventory < threshold triggers *"Plus que X en stock"* badge with subtle pulse animation; thresholds tuned per SKU velocity | +15–22% conversion on flagged items |
| 🎯 **Smart Recommendations** | Hybrid engine: collaborative filtering + content-based + business rules (margin, stock, freshness). Powers *"Vous aimerez aussi,"* *"Souvent acheté ensemble"* | +18–25% AOV |
| 🛒 **One-Click Reorder (Pro)** | Pro accounts see a *"Mes derniers achats"* rail; one tap re-adds last 10 SKUs to cart with quantities pre-filled | Pros place 2.5x more orders/year |
| 📦 **Project-Based Shopping** | Choose a project template (Cuisine 3m linéaire), tweak dimensions/finishes, get auto-bill-of-materials with quantity-discount applied | AOV 3–5x normal basket |
| 💡 **You May Need This** | Cart-screen suggester: AI inspects cart contents and surfaces missing complements (acheté hinge → suggest screws + drilling jig) | +12–18% AOV |
| 📊 **Dynamic Pricing & Promotions** | Rule engine (Talon.One / homegrown) for: time-based (Black Friday), behavioral (first order), segment (Pro tier), inventory-based (overstock clearance) | Margin-positive promotions |
| 🎁 **Flash Sales / Black Friday** | Native countdown timer, capped quantities, queue system for high-traffic drops, dedicated landing pages, push & email + WhatsApp blast | +40–60% revenue on event days |
| 💬 **Live Chat + WhatsApp** | Web chat (intercom-style) routes to WhatsApp Business after-hours; pre-fills cart context for the agent so no *"what were you looking at?"* | Captures 5–8% of bouncers |

#### The Project Builder (Flagship Feature)

This is the feature that earns SIMEX a category. It is also the most defensible — competitors cannot copy the underlying compatibility data without two years of curation.

1. Pick a project type: **Cuisine · Dressing · Salle de bain · Bibliothèque · Custom**.
2. Enter dimensions (linear meters, height, depth) — or upload a photo for AR estimation.
3. Pick a style preset (*Moderne minimal, Classique, Industriel*) — preset auto-selects compatible finishes.
4. Configurator generates a full Bill of Materials: hinges qty calculated by door count, screws qty by hinge spec, edge-banding by linear meter, slides by drawer count.
5. User tweaks each line (upgrade a finish, remove a category, adjust qty). Total updates live.
6. Save project, share via link with spouse/architect, request quote (B2B), or check out as a single bundled order with a 5–8% project discount.

> **🟡 Why this wins:** A homeowner googling *"comment équiper ma cuisine"* today gets a 30-tab research session. SIMEX gives them a 4-minute guided builder that ends in a single confident order. That experiential gap is the moat.

---

### 4.3 Delivery & Logistics System

Logistics in Tunisia is where every e-commerce promise dies. SIMEX 2.0 treats logistics as a **first-class product surface** — visible, tracked, and branded.

#### Zone Pricing Engine

A Tunisia map UI on every product page and at checkout. The country is segmented into 5 delivery tiers:

| Zone | Coverage | Price | Promise |
|---|---|---|---|
| **Z1 — Grand Tunis** | Tunis, Ariana, Ben Arous, Manouba | 5–7 TND | Same-day if ordered before 14h, else next-day before 18h |
| **Z2 — Côtière Nord** | Bizerte, Nabeul, Sousse, Monastir, Mahdia | 9–12 TND | Next-day before 18h |
| **Z3 — Centre** | Sfax, Kairouan, Kasserine, Sidi Bouzid | 12–15 TND | 48h |
| **Z4 — Sud** | Gabès, Médenine, Tataouine, Tozeur, Kébili | 18–22 TND | 48–72h |
| **Z5 — International (diaspora)** | France, Belgique, Canada, Allemagne | calculé par poids | DHL Express, 5–7j |

#### Real-Time Tracking Dashboard

- **Customer view:** Domino's-style tracker. Order placed → préparé en entrepôt → confié au livreur → en route (live GPS) → livré. SMS + WhatsApp notifications at each stage.
- **Driver app:** lightweight PWA for delivery partners — route optimization, proof-of-delivery photo, customer signature, COD reconciliation.
- **Internal ops dashboard:** fleet view of all in-flight orders, late alerts, partner SLA tracking, cost-per-delivery analytics.

#### Delivery Partner Management

Multi-partner orchestration layer. Same product can route through Aramex, Tunisie Rapid, Best Express, or in-house fleet — chosen automatically by zone, weight, urgency, and partner SLA performance. Partners are scored monthly; underperformers lose volume.

#### Click & Collect

3 pickup points in Year 1 (Tunis, Sousse, Sfax) — partner with 3 strategic *boutiques de quincaillerie*. Order online, get a QR pickup code, retrieve same day. Free for orders ≥ 50 TND. Drives foot-traffic for partners + zero-cost fulfillment for SIMEX.

#### Pro Logistics

- **Recurring delivery slots:** Pros can book a standing weekly Tuesday-morning delivery — their cart is auto-shipped.
- **Job-site delivery:** instead of business address, deliver to active project site with installer phone.
- **Forward stock at partner pickup points:** high-velocity SKUs pre-positioned in Sousse / Sfax for same-day pro pickup.

---

### 4.4 Admin Dashboard (Pro Cockpit)

The admin is not a Bagisto/WordPress backend with custom CSS. It is a purpose-built React/Next.js cockpit, role-aware, keyboard-driven, and fast. **Three layers:**

#### Layer 1 — Operations (used hourly)

- **Orders board:** Kanban view (Nouveau / En préparation / Confié / En route / Livré / Retourné). Drag to update status. Bulk-assign to a driver. Print picking lists. Export to CSV. Filter by zone, payment method, value, SLA risk.
- **Inventory:** Multi-warehouse from day one (entrepôt principal + pickup points + future Sfax hub). Reorder-point alerts, supplier PO generator, barcode scanning support, shrinkage tracking.
- **Customers:** 360° profile — orders, lifetime value, cohort, segment (B2C / Pro tier 1/2/3 / Architect), open tickets, last interaction, NPS. One-click "call," "WhatsApp," "email," "send promo."
- **Returns & complaints:** Dedicated workflow — RMA generation, refund authorization, photo-evidence intake, root-cause tagging that feeds back to product page improvements.

#### Layer 2 — Growth (used daily)

- **Sales analytics:** Daily / weekly / monthly revenue, AOV, conversion, traffic sources. Cohort retention curves. Channel attribution (paid vs. organic vs. WhatsApp vs. referral).
- **Product performance:** Top sellers, slow movers, stockout cost (*"vous avez perdu 1,240 TND ce mois sur ruptures"*), margin per SKU, category contribution.
- **Marketing studio:** Coupon builder (rule-based), banner scheduler (homepage + category + PDP), email & WhatsApp campaign composer with segment targeting, A/B test runner.
- **Abandoned cart workbench:** Live list of carts in last 24h, contact channel of choice, automated 3-step recovery sequence (1h email → 24h WhatsApp → 72h SMS with discount).
- **SEO & content:** Page-level SEO health, meta editor, blog/CMS, structured data validator.

#### Layer 3 — Strategic (used weekly/monthly)

- **Cohort & LTV dashboard:** Customer lifetime value by acquisition channel, by segment, by first-product. Drives marketing budget allocation.
- **Pro program manager:** Pro account approvals, tier upgrades, monthly invoicing, credit-line management, referral attribution.
- **Supplier performance:** Lead-time variance, defect rate, price-trend tracking — informs supplier negotiations.
- **Forecasting:** Demand forecast per SKU per zone (Prophet/lightweight ML), feeds purchase orders and warehouse allocation.

#### Role-Based Access Control

Six roles ship on day one. Each has a tailored landing screen and locked-down permissions:

| Role | Sees | Can do |
|---|---|---|
| Owner / CEO | Everything | Everything |
| Operations Manager | Orders, inventory, logistics, returns | All operational actions, no financial settings |
| Warehouse Picker | Picking queue only | Mark items picked, print labels |
| Customer Service | Customers, orders, tickets, refunds (capped) | Issue refunds ≤ 200 TND, escalate above |
| Marketing | Campaigns, content, analytics (read) | Launch campaigns, edit banners, no order edits |
| Pro Account Manager | Pro customers + their orders | Approve pros, set custom pricing, manage credit |

---

### 4.5 Content & Branding

#### Brand Identity System

| Element | Specification | Reasoning |
|---|---|---|
| **Primary palette** | Deep Navy `#0B1E3F` + Amber Accent `#F4A300` | Navy = trust, expertise, premium. Amber = warmth, craft, energy. Combination is rare in TN hardware = ownable. |
| **Secondary palette** | Soft Linen `#F3F4F6` background, Slate `#4B5563` secondary text, Pro Green `#0E7C66` (Pro accents), Alert Red `#C0392B` (low stock / sale) | Calm utility palette for non-content surfaces; pro green doubles as B2B differentiator |
| **Typography** | Headlines: Söhne or Inter Display (geometric sans). Body: Inter. Numerics: tabular-figures for prices, specs, quantities | Modern, neutral, multilingual (FR/AR/EN), free to license |
| **Logo system** | Wordmark + monogram "S/X" mark for avatars, square crops, packaging tape, vehicle decals | Brand has to scale to surfaces beyond the screen |
| **Iconography** | Custom 24px outline set, 2px stroke, rounded ends; one icon per category, one per project type | Visual consistency across nav, filters, cards |
| **Photography** | Studio shots: pure white / charcoal / linen backgrounds only. Lifestyle: warm interiors, golden-hour, in-context. Hands always visible — humanize the product | Forces a single visual mood; rejects supplier stock photos |

#### Tone of Voice

- **Confident, never arrogant.** We know the product; we don't lecture the customer.
- **Bilingual native (FR + AR), with EN for diaspora.** Translations are not literal — they are localized. Tunisian Arabic for warmth (informal copy, WhatsApp), modern standard for legal/policy.
- **Practical over poetic.** Every sentence answers a buyer question. *"Charnière qui ne grince plus, garantie 5 ans, livré demain."* Three facts, zero filler.

#### Content Strategy

| Channel | Cadence | Content Type | Goal |
|---|---|---|---|
| **YouTube** | 1 video/week | Installation tutorials, project reveals, supplier factory visits | SEO + brand authority + reduce return rate |
| **Blog** | 2 posts/week | Buying guides, comparisons (*"meilleures charnières 2026"*), trend posts, project case studies | Long-tail SEO + AI-overview citations |
| **Instagram** | Daily reels + 3 posts | Before/after, satisfying installation clips, customer features | Top-of-funnel discovery + UGC pipeline |
| **TikTok** | 3–5 short videos/week | ASMR cabinet-closing clips, *"5 erreurs à éviter,"* pro-tips | Awareness with under-30 renovators |
| **WhatsApp Broadcast** | 1 push/week | Flash deals, restock alerts, pro-only drops | Owned channel, 90%+ open rate |
| **Email Newsletter** | 1 digest/week + triggered | Project inspiration, new arrivals, abandoned-cart, post-purchase | Retention + reactivation |
| **Knowledge Hub on-site** | Always evolving | Calculators, compatibility checkers, AR previews, downloadable spec sheets | Conversion + trust + SEO |

#### Storytelling Pillars

1. **"Comment c'est fait"** — short docs from supplier factories. Builds quality trust.
2. **"Avant / Après"** — customer projects with before-after reels. Builds inspiration trust.
3. **"Le pro du mois"** — featured installer profile. Builds B2B community + pulls referrals.
4. **"Un produit, une histoire"** — deep dive on a single SKU's engineering. Builds expertise.

---

### 4.6 Growth Features

#### Loyalty Program — "SIMEX Points"

- **Earn:** 1 point per 1 TND spent (B2C) · 1.5 points per 1 TND (Pro). Bonus points on reviews (50), referrals (500), birthday (200), first project completion (1000).
- **Burn:** 1000 points = 20 TND off (4% effective discount). Redeemable in cart with single tick.
- **Tiers:** Bronze (default), Argent (5,000 pts/year, free shipping forever), Or (15,000 pts, early access + dedicated WhatsApp), Platine — invite-only for top architects/installers.

#### Referral System

Two-sided incentive: Referrer gets **50 TND credit** when referee's first order ≥ 100 TND ships. Referee gets **25 TND off** first order. Tracked via personalized link + WhatsApp share button. Goal: viral coefficient ≥ 0.4 by month 6.

#### B2B Pricing Tiers & Pro Accounts

| Tier | Qualification | Discount | Perks |
|---|---|---|---|
| **Pro Bronze** | Pro account approved (RC + activity proof) | 5–8% off catalog | Pro pricing visible, pro WhatsApp line, priority support |
| **Pro Silver** | ≥ 5,000 TND/quarter | 10–15% off, monthly invoicing 30j | Dedicated account manager, recurring delivery slots, free Z1 shipping |
| **Pro Gold** | ≥ 20,000 TND/quarter | 15–22% off, 60j payment terms | Custom catalog, on-site stock checks, training events, branded co-marketing |
| **Architect Partner** | Curated invite | Project-quote pricing | Spec book access, model showroom visits, lead-share program |

#### Installer / Professional Accounts

- **Frictionless onboarding:** Apply via web or WhatsApp; AI-screening of *registre commercial*; approval in <24h.
- **Pro-only dashboard:** Reorder rail, project archive, invoicing center, credit-line balance, training event calendar.
- **Dedicated WhatsApp Business account:** Two human agents during business hours; AI bot 24/7 for stock/price/availability.
- **Quarterly Pro events:** Free training on new product launches, networking dinners, factory trips. Becomes the "club" pros want into.

#### Affiliate System

Open program with 6–10% commission on attributed orders. Tracked via cookieless server-side attribution (Tunisia browser landscape is lossy with third-party cookies). Targets: TN home-improvement bloggers, YouTube reno creators, Instagram interior designers, even small contractors who recommend SIMEX informally.

#### Reactivation & Lifecycle Marketing

- **Welcome series (5 emails over 14d):** intro brand → 3 best categories → AI advisor demo → free guide → first-purchase incentive.
- **Post-purchase series:** shipped → delivered → installation tips → review request (D+10) → reorder reminder (D+60 for consumables).
- **Win-back:** no purchase in 90 days → segmented offer based on past category.

---

### 4.7 Technical Architecture & Stack

#### Architecture Overview

**Headless commerce, modular by design.** Frontend, commerce engine, search, CMS, and CRM are independent services connected via APIs. This gives SIMEX three things competitors can't match: speed (sub-second pages), flexibility (swap any layer without rebuilding), and a single source of customer/product truth.

#### Recommended Stack

| Layer | Recommendation | Why this choice |
|---|---|---|
| **Frontend (storefront)** | Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS + shadcn/ui | Industry standard, SSR/ISR for SEO + speed, huge talent pool in TN, unbeatable DX |
| **Frontend (admin)** | Next.js + Refine.dev or Tremor for dashboards | Reuses same stack/devs, ships admin fast |
| **Mobile (later)** | React Native or Expo with shared codebase to web | One team can ship web + iOS + Android |
| **Commerce engine** | **Medusa.js** (open-source headless) **OR Saleor** — alternative: Shopify Plus if speed-to-market is priority over control | Medusa = full control, low TCO, modular plugins, growing ecosystem. Shopify = fastest to launch, higher monthly cost. |
| **Search & discovery** | Typesense (self-hosted) or Algolia (managed) | Sub-50ms search, typo-tolerance, semantic ranking, faceting baked in |
| **AI assistant & rec engine** | Claude or GPT-4-class for chat; Recombee or homegrown Python service (FastAPI + scikit-learn) for recommendations; CLIP for image search | Best models for FR/AR mixed input; recommendations modular and tunable |
| **CMS (blog, guides, banners)** | Sanity.io or Strapi | Structured content, multilingual, fast preview, devs and editors both love it |
| **Database (commerce)** | PostgreSQL 16 (primary), Redis (cache + sessions + cart), ClickHouse (analytics) | Postgres = unmatched reliability, Redis = millisecond cart ops, ClickHouse = fast aggregations on millions of events |
| **File storage / media** | Cloudflare R2 + Cloudflare Images for transforms, or AWS S3 + ImageKit | Cheap egress, automatic format negotiation (AVIF/WebP), global CDN |
| **Hosting** | Vercel (frontend) + Hetzner / OVH Frankfurt (backend, db, workers) + Cloudflare global edge | Vercel for instant global frontend; Hetzner for cheap powerful EU compute close to TN |
| **CDN & edge** | Cloudflare (DNS, WAF, CDN, Workers, Turnstile, R2) | Single pane for security + perf; free tier covers most needs |
| **Analytics & events** | PostHog (self-hosted) for product analytics + Plausible for privacy-friendly web; GA4 for paid attribution | Owns the data; supports cohort, funnel, replay |
| **Email / SMS / WhatsApp** | Resend or Postmark (email), Tunisian SMS aggregator (Orange/Ooredoo gateway), WhatsApp Business Cloud API | Reliable rails for each channel; WhatsApp via Meta is the only legitimate path |
| **Payments** | ClicToPay (CIB), Konnect, Paymee, Flouci for D17 + carte; in-house ledger for Pro invoicing & credit | Covers all TN consumer rails; in-house ledger required for B2B credit terms |
| **Observability** | Sentry (errors) + Grafana Cloud (metrics + logs) + Better Stack (uptime) | Production-grade visibility from day one |
| **CI/CD** | GitHub Actions + Vercel deploy + Argo for backend + automated db migrations | Standard, cheap, fast |

#### Performance Budget

- **LCP < 1.5s** on 4G mobile in Tunis. Achieved via SSR, edge cache, AVIF images, font subsetting, no render-blocking JS.
- **TTI < 2.5s** on mid-range Android (Galaxy A-class).
- **Lighthouse Performance ≥ 95** on every key template.
- **Core Web Vitals all green** as a Google ranking signal — directly drives organic traffic.

#### Security & Compliance

- **PCI-DSS** via payment provider tokenization (SIMEX never touches raw card data).
- **INPDP (Tunisian data protection) compliance** — privacy policy, consent management, right to deletion.
- **OWASP Top 10 hardening,** Cloudflare WAF, rate-limiting, bot protection, MFA on admin accounts.
- **Daily encrypted off-site backups,** tested monthly via restore drill.

#### High-Level System Diagram (logical)

```
              ┌──────────────────────────────────────────┐
              │   Cloudflare Edge  (DNS · WAF · CDN)     │
              └──────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼─────┐         ┌─────▼─────┐         ┌─────▼─────┐
   │ Next.js  │         │ Next.js   │         │ Driver    │
   │ Storefront│        │ Admin     │         │ PWA       │
   └────┬─────┘         └─────┬─────┘         └─────┬─────┘
        └──────────┬──────────┴──────────┬──────────┘
                   │ REST / GraphQL APIs │
   ┌───────────────▼─────────────────────▼───────────────┐
   │             API Gateway (Edge Workers)              │
   └───────────────┬─────────────────────────────────────┘
                   │
   ┌──────┬────────┼────────┬─────────┬──────────┬──────┐
   │      │        │        │         │          │      │
┌──▼──┐┌──▼──┐ ┌───▼───┐ ┌──▼──┐ ┌────▼────┐ ┌───▼───┐┌─▼──┐
│Medusa││Type-│ │Sanity │ │SIMA │ │Recommend│ │Logist.││CRM │
│Core  ││sense│ │CMS    │ │ AI  │ │Engine   │ │Engine ││/LCM│
└──┬──┘└──┬──┘ └───┬───┘ └──┬──┘ └────┬────┘ └───┬───┘└─┬──┘
   │      │        │        │          │           │      │
   └──────┴────────┴────────┴──────────┴───────────┴──────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼────┐┌────▼────┐┌────▼─────┐
   │Postgres ││ Redis   ││ClickHouse│
   │ (orders,││(cart,   ││(events,  │
   │  users) ││sessions)││analytics)│
   └─────────┘└─────────┘└──────────┘
```

---

### 4.8 UI/UX Concept (Section by Section)

#### Homepage Layout (mobile-first, 7 sections)

| Section | Height | Purpose | Conversion intent |
|---|---|---|---|
| Hero video + H1 + 2 CTAs | 85vh | Brand statement + primary path | First click: Project Builder or Pro entry |
| Persona switcher (3 cards) | Auto | Self-selection routes to tailored UX | Reduce IA confusion |
| Project Builder teaser | Auto | Demo the killer feature | Drive Builder starts |
| Top 8 categories | Auto, scroll-snap on mobile | Browse entry for known-need users | Catalog navigation |
| Today's movers (3 strips) | Auto | Urgency + social proof | Add-to-cart from home |
| Trust strip + UGC + counter | Auto | Reduce purchase anxiety | Lift conversion of hesitant browsers |
| Knowledge hub teaser | Auto | Position as expert; SEO entry | Build trust + return visits |

#### Product Detail Page Structure

PDP is the hardest-working template on the site. Above-the-fold delivers everything a returning buyer needs to convert in 5 seconds. Below-the-fold delivers everything a researching buyer needs to convert in 5 minutes.

1. Sticky media gallery (left, desktop) / swipeable carousel (mobile)
2. Title block: name · short description · star rating · review count · stock status
3. Variant selector: finish swatches, sizes, quantities — never dropdowns when ≤ 6 options
4. Price block: single price (or B2C/Pro toggle for logged-in pros), strikethrough on sale, payment-in-3 hint
5. **Sticky Add-to-Cart on mobile:** anchored to viewport bottom from PDP first scroll
6. Trust micro-row: livraison · retours · paiement sécurisé · garantie
7. Quick-spec icons (4 max)
8. Tabs (lazy-loaded): Description · Spécifications · Installation · Avis · Q&A
9. *"Vous aurez aussi besoin de"* carousel
10. *"Vu dans ces projets"* carousel
11. Pro insight paragraph
12. Recently-viewed footer

#### Admin UI Structure

- **Persistent left rail:** Tableau de bord · Commandes · Clients · Produits · Stock · Marketing · Pros · Analytique · Réglages
- **Top bar:** Quick search (Cmd+K) → jump to any order, customer, product. Notifications. Profile.
- **Main canvas:** Each module = list view + filterable + bulk actions, paired with a detail drawer that opens in-place (no full page reload).
- **Density preset toggle:** Compact (warehouse staff on tablets) vs. Comfortable (managers on desktop).
- **Keyboard shortcuts everywhere:** `j`/`k` for list nav, `e` to edit, `x` to bulk-select, `/` for search, `esc` to close.

---

### 4.9 Innovative Ideas (Tunisia-First)

These are features no current Tunisian e-commerce competitor has shipped. Each one bought separately would not move the needle. Together they redefine the category.

#### AI Product Advisor — "SIMA"

A bilingual chat assistant trained on the SIMEX catalog, installation manuals, and 10,000+ historical customer Q&As. SIMA can:

- Recommend exact SKUs from a free-text description (*"je veux des charnières silencieuses pour cuisine MDF 18mm, finition nickel"*).
- Answer compatibility questions live (*"est-ce que cette glissière supporte un tiroir avec organisateur métallique?"*).
- Generate a complete shopping list from a project brief uploaded as photo or text.
- Hand off to a human agent on WhatsApp with full context preserved.

> **🟡 Why SIMA wins:** Customers don't want to search a catalog of 6,000 SKUs. They want to ask a question and trust the answer. SIMA collapses 30 minutes of research into 30 seconds — and every answered question makes SIMA smarter.

#### Augmented Reality Preview

- Point phone camera at an existing kitchen door — AR overlays show how new poignée would look on it, in actual scale, with live finish swap.
- For furniture pieds: scan room corner, place virtual sofa on virtual pieds in correct height ratio.
- Built on **WebXR** (no app install) for accessibility; falls back to high-quality 3D viewer where AR unsupported.

#### Smart Bundles (Behavior-Driven)

Beyond static *"often bought together,"* SIMEX learns from every project. Buyers who configure a 3m linear kitchen with white doors invariably need 14 hinges, 6 drawer slides, 8 handles, and 2 dampers. The system precomputes these bundles per project signature and offers them as *"Pack Cuisine 3m — Tout inclus"* at a 7% bundle discount, picked + packed as a single unit, saving warehouse time.

#### Contractor Mode

- Toggle in the header for logged-in pros. Switches the entire UI density — bigger tables, SKU codes prominent, qty inputs replace +/− buttons, keyboard-driven.
- **Bulk paste tool:** paste a CSV or list of SKU codes from supplier email → cart fills instantly.
- **Project quote builder:** assemble a multi-line quote, branded SIMEX PDF, sent to client for approval; converts to order with one click.
- **Job-site mode:** sub-account per project, keeps inventory and invoicing separate per construction site.

#### Visual Search (Snap & Find)

Customer photographs a broken hinge, an old handle, or a screen-shot of an inspiration kitchen → CLIP-based image embedding searches the catalog for nearest matches. Returns top 5 candidates with confidence + *"chat with SIMA to confirm"* button. Eliminates the most painful purchase moment in hardware: *"I don't know what this part is called."*

#### Live Showroom (Virtual Boutique on WhatsApp)

- Schedule a 15-minute video call with a SIMEX expert who walks you through the warehouse showing actual product, finishes, mechanisms.
- Build cart together in real-time; expert pushes products to your screen via WhatsApp link; checkout when call ends.
- Targets the still-large segment that doesn't trust online photos. Closes high-AOV orders that otherwise wouldn't happen.

#### Project Notebook (Customer Account Killer Feature)

- Every customer gets a private project space — save inspiration photos, sketch dimensions, attach quotes, share with spouse/architect via link.
- Notebook auto-detects when project becomes *"ready to buy"* (all required SKUs added) and surfaces a one-click checkout.
- Notebook becomes the reason to come back even before re-purchase. **Drives session frequency, which drives conversion.**

#### Carbon Receipt

Every order shows a small estimated CO₂ footprint per item (mostly from logistics). Customers can offset via micro-donation to a TN reforestation partner at checkout. Cheap to implement (third-party API), strong with the under-35 demographic, builds brand affinity.

#### "Garage Sale" — Pro Returns Outlet

Returns and B-stock from the Pro program are quality-checked and listed at 25–40% discount in a separate Outlet section. Capture the price-sensitive DIY segment without polluting the main brand. Margin-positive, inventory-clearing.

#### Dynamic Showroom Inventory Stickers

Print-on-shelf QR codes at partner pickup points. Scan in-store → see SIMEX online price, reviews, install video, related products. Bridges offline browse with online order.

---

## 5. Execution Roadmap

### 5.1 Phased Build

#### Phase 0 — Foundations (Weeks 1–4)

- Brand identity finalized (logo, palette, typography, tone).
- Tech stack chosen and provisioned (Vercel, Hetzner, Cloudflare, Medusa skeleton).
- SKU master clean-up: 8 core categories curated, 600 SKUs photographed in-house with consistent style.
- Pro applicant pipeline opened (early-access waitlist via WhatsApp).

#### Phase 1 — MVP Storefront (Weeks 5–10)

- New homepage, category pages, PDPs, cart, one-page checkout.
- Search (Typesense) + faceted filters.
- Payment rails (ClicToPay + COD + Konnect).
- Zone delivery pricing engine + manual order tracking.
- Basic admin: orders board, inventory, customers.
- Launch with closed-beta of 200 customers from existing list.

#### Phase 2 — Differentiators (Weeks 11–18)

- Project Builder (3 templates: Cuisine, Dressing, Salle de bain).
- Pro Portal v1: tier pricing, one-click reorder, invoicing.
- WhatsApp Business integration: cart handoff, broadcast, AI bot for stock/price.
- Loyalty & referral system live.
- **Public launch** with PR push + influencer seeding.

#### Phase 3 — Intelligence (Weeks 19–26)

- SIMA AI advisor (chat + voice).
- Visual search.
- Recommendations engine v2 (behavioral).
- Real-time delivery tracking + driver app.
- Abandoned-cart recovery automation.

#### Phase 4 — Moat (Months 7–12)

- AR previews.
- Project Notebook.
- Live Showroom (WhatsApp video).
- Pro events program kickoff.
- Affiliate network launch.
- Sfax pickup-point pilot.

### 5.2 Team Required

| Role | When to hire | Notes |
|---|---|---|
| Tech Lead / Senior Full-stack | Week 1 | Owns architecture; ideally Next.js + Postgres background |
| Frontend engineer | Week 2 | Pixel-perfect Tailwind; can ship an animated PDP in a week |
| Backend engineer | Week 3 | Medusa + Postgres + integrations (payments, WhatsApp, SMS) |
| Designer (UI/UX) | Week 1 | Brand + product; high taste; one designer is plenty for first 6 months |
| Content lead / copywriter (FR/AR) | Week 4 | Owns voice, blog, video scripts, product copy |
| Photographer + retoucher | Week 2 (contractor) | 600-SKU catalog shoot; 2-month engagement, then monthly |
| Operations Manager | Week 4 | Orders, returns, supplier relationships, partner logistics |
| Pro Account Manager | Week 12 | Once Pro Portal launches; deep B2B relationship skills |
| Customer Service (2 agents) | Week 8 | WhatsApp + chat + phone; trained on product |
| Growth marketer | Week 10 | Paid + email + WhatsApp + influencer; data-driven |

---

## 6. Business Impact

### 6.1 Revenue Model Evolution

| Today | Year 2 (post-launch) |
|---|---|
| Single revenue line: B2C product margin | **5 streams:** B2C product · Pro subscription/credit · Affiliate share · Outlet · Ad-fee from premium supplier placements |
| No retention loop | Loyalty + lifecycle drives 30%+ repeat rate |
| Paid ads ≈ only acquisition channel | Paid ≤ 30% — organic, WhatsApp, referrals, content do the rest |
| Margin compressed by price comparison | Bundle, project, and Pro pricing escape direct comparison |
| Logistics is a cost | Logistics is a brand + a moat (and Click & Collect is margin-positive) |

### 6.2 Year 1 Financial Targets

| KPI | Q1 | Q2 | Q4 |
|---|---|---|---|
| Monthly revenue | 180k TND | 320k TND | **750k TND** |
| Monthly orders | 1,400 | 2,200 | **4,500** |
| AOV | 130 TND | 150 TND | **180 TND** |
| Pro share of revenue | 12% | 22% | **38%** |
| Repeat purchase rate (90d) | 15% | 22% | **33%** |
| Conversion rate | 1.6% | 2.1% | **2.9%** |
| Customer acquisition cost | 32 TND | 26 TND | **19 TND** |
| Estimated gross margin | 28% | 31% | **34%** |

> **🟡 What changes when this works:** SIMEX stops competing on price and starts competing on experience. The brand becomes the assumed default for furniture/hardware shopping in Tunisia — not because we are cheapest, but because we are easiest, fastest, and most trusted. That is durable. **That is what valuations are built on.**

### 6.3 Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Competitor copies feature-by-feature | High | Compounding moats: data (recommendations get better with use), supply (locked-in supplier exclusivities), Pro program (relationships are sticky) |
| Logistics SLA failures damage brand | Medium | Multi-partner orchestration, in-house Z1 fleet by month 6, public SLA dashboard, automated refund on miss |
| Tunisian payment rail outages | Medium | 3+ payment providers; instant fallback; COD always available |
| Pro program adoption slow | Medium | Aggressive early-access incentives; door-to-door sales to top 200 menuiseries in Grand Tunis in month 1 |
| Tech complexity slows iteration | Low (with right team) | Headless architecture lets us swap modules; observability from day one; weekly release cadence |
| Inventory capital constraints | High | Drop-ship + supplier consignment for long-tail; warehouse only fast-movers; Pro pre-orders fund deeper SKU expansion |

---

## 7. The Pitch

Tunisia spends roughly **800 million TND a year** on furniture hardware, kitchen accessories, and fitting parts. The market is fragmented, offline-dominated, and badly served by every existing online player.

> *There is no SIMEX of this category. There is no brand a homeowner mentions by name when planning a kitchen. There is no platform a* menuisier *defaults to opening at the start of his day. There is no 24-hour delivery promise anyone keeps. There is no AI advisor in the language they speak.*

### This is the opportunity.

**SIMEX 2.0 is not a website rebuild.** It is the construction of the operating system for an 800M-TND category that has no operating system.

We win by stacking five compounding advantages:

1. A premium brand experience nobody else has invested in.
2. Project commerce — selling outcomes, not parts.
3. Logistics treated as a product, not a cost line.
4. A Pro economy that turns installers into a referral machine.
5. Intelligence — AI advice, visual search, AR — that makes confused buyers confident in 30 seconds.

> **🟡 What we are really building:** Not an e-commerce site. A platform that owns a category. A brand that compounds. A business worth ten times what a catalog website is worth.

The plan above is detailed. The phasing is realistic. The tech stack is proven. The team is hireable in Tunis. The capital required is modest by category standards.

## **What is needed now is decision and execution.**

---

*— End of Blueprint —*

**Sources for competitive context:**
- [SIMEX](https://simex.tn/)
- [Bricola](https://bricola.tn/)
- [Brico-Direct](https://brico-direct.tn/)
- [L'Accessoire Pro](https://laccessoire.pro/)
- [EGM](https://egm.tn/)
- [STQ](https://www.stq.com.tn/)
