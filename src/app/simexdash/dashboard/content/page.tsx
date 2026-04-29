import { db } from "@/lib/db";
import { ContentClient } from "./content-client";

export const dynamic = "force-dynamic";

// ── Default CMS seeds ─────────────────────────────────────────────────────────
const DEFAULT_SITE_CONTENT: Record<string, any> = {
  happy_hour: {
    title: "HAPPY HOUR · -30% sur tout",
    subtitle: "Profitez de notre flash sale, livraison express incluse",
    ctaText: "Profiter →",
    ctaLink: "/products?promo=1",
  },
  daily_deal: {
    name: "Glissière à billes soft-close 500mm",
    category: "Glissières premium",
    originalPrice: 38,
    dealPrice: 19.9,
    sku: "GLS-500SC",
    image: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=900&q=85&auto=format&fit=crop",
    totalStock: 100,
    sold: 53,
    rating: 4.9,
    reviews: 128,
    features: ["Sortie totale 100%", "Fermeture amortie", "Charge 35 kg", "Finition nickel mat"],
  },
  black_friday: {
    date: "2026-11-27T00:00:00",
    couponCode: "BF2026",
    subtitle: "Les meilleures offres de l'année. Une seule nuit. Soyez prêt.",
    badge: "Black Friday 2026",
    deals: [
      { label: "Charnières",    discount: "-40%", emoji: "🔩", bg: "from-red-900 to-red-950",     href: "/products?cat=charnieres&promo=bf" },
      { label: "Glissières",   discount: "-35%", emoji: "📏", bg: "from-neutral-900 to-neutral-950", href: "/products?cat=glissieres&promo=bf" },
      { label: "Poignées",     discount: "-45%", emoji: "✨", bg: "from-amber-900 to-amber-950",  href: "/products?cat=poignees&promo=bf" },
      { label: "Éclairage LED", discount: "-30%", emoji: "💡", bg: "from-yellow-900 to-yellow-950", href: "/products?cat=led&promo=bf" },
    ],
  },
  pro_banner: {
    title: "Vous êtes professionnel ?",
    description: "Menuisiers, cuisinistes, décorateurs d'intérieur — rejoignez le réseau SIMEX Pro et accédez à des tarifs réservés, une livraison prioritaire et un conseiller dédié.",
    ctaText: "Créer un compte Pro",
    ctaLink: "/pro",
    whatsappNumber: "21697730083",
    perks: [
      { icon: "Percent",    label: "Remises jusqu'à −25%",       sub: "sur toutes les commandes pro" },
      { icon: "Truck",      label: "Livraison prioritaire",       sub: "express 24h partout en Tunisie" },
      { icon: "PhoneCall",  label: "Conseiller dédié",            sub: "disponible 7j/7 par WhatsApp" },
      { icon: "BadgeCheck", label: "Accès catalogue complet",     sub: "+5 000 références pro" },
    ],
  },
  mission: {
    eyebrow: "SIMEX · Votre partenaire confort",
    title: "L'art de bien équiper sa maison.",
    quote: "Que vous soyez sur le point de vous marier et de meubler votre futur foyer, ou que vous souhaitiez simplement rénover votre intérieur, SIMEX vous propose tout le nécessaire : des charnières invisibles aux profilés Gola LED. Visitez notre showroom à Moknine, notre équipe est prête à vous accompagner dans l'aventure de votre vie.",
    pillars: [
      { icon: "Sparkles",    title: "Solutions coulissantes",  desc: "Gagnez de l'espace avec nos mécanismes de portes coulissantes silencieux et robustes." },
      { icon: "ShieldCheck", title: "Supports pliables",       desc: "Optimisez chaque cm² de votre cuisine ou salon avec nos équerres pliables haute résistance." },
      { icon: "Palette",     title: "Pieds & Finitions",       desc: "Arpentez le luxe avec nos pieds de meubles chromés et nos bandes de chant PVC/ABS premium." },
    ],
  },
  builder: {
    eyebrow: "Outil exclusif SIMEX",
    title: "Le configurateur qui pense pour vous.",
    desc: "Décrivez votre projet. Nous calculons la liste exacte de quincaillerie qu'il vous faut.",
    ctaText: "Lancer le configurateur",
    features: [
      { icon: "Boxes",       text: "Sélectionnez vos meubles & dimensions" },
      { icon: "ListChecks",  text: "Liste de pièces générée en 5 secondes" },
      { icon: "Percent",     text: "Bundles avec -7% de remise auto" },
      { icon: "Video",       text: "Vidéos de pose pour chaque pièce" },
    ],
  },
  trust_bar: {
    items: [
      { icon: "Truck",       title: "Livraison 24-48h",          desc: "Toute la Tunisie · Suivi real-time" },
      { icon: "Shield",      title: "Qualité Garantie",           desc: "Produits testés et robustes" },
      { icon: "Lock",        title: "Paiement à la livraison",    desc: "COD, D17 ou carte bancaire" },
      { icon: "Headphones",  title: "Conseil Expert",             desc: "Une équipe à Moknine à votre écoute" },
    ],
  },
  newsletter: {
    title: "Restez dans la boucle.",
    subtitle: "Inscrivez-vous et recevez en avant-première les Happy Hours, ventes flash et nouveaux produits.",
  },
  personas: {
    eyebrow: "Trouvez votre voie",
    title: "Qui êtes-vous aujourd'hui ?",
    personas: [
      { icon: "Home",      title: "Je rénove chez moi",    desc: "Cuisine, dressing, salle de bain… Trouvez la quincaillerie qui transformera votre intérieur.", href: "/products?audience=home",   accent: "from-rose-500 to-brand-red" },
      { icon: "Wrench",    title: "Je répare un meuble",   desc: "Charnière cassée, glissière qui coince ? Identifiez et commandez la pièce exacte.",             href: "/products?audience=repair", accent: "from-amber-400 to-amber-600" },
      { icon: "Briefcase", title: "Je suis professionnel", desc: "Menuisier, cuisiniste, décorateur. Compte Pro, remises, paiement à 30j.",                       href: "/pro",                      accent: "from-zinc-700 to-brand-black" },
    ],
  },
  contact: {
    phone: "+216 97 730 083",
    email: "societesimex@gmail.com",
    address: "Moknine, Monastir — Tunisie",
    hours: "Lun–Sam · 9h–18h",
    whatsapp: "21697730083",
    socials: { facebook: "#", instagram: "#", youtube: "#", tiktok: "#", linkedin: "#" },
    payments: ["VISA", "Mastercard", "D17", "Konnect", "COD"],
  },
  header_nav: {
    links: [
      { href: "/products",              label: "Tous les produits", emoji: "🛒" },
      { href: "/products?cat=charnieres", label: "Charnières",      emoji: "🔩" },
      { href: "/products?cat=glissieres", label: "Glissières",      emoji: "📦" },
      { href: "/products?cat=poignees",   label: "Poignées",        emoji: "🚩" },
      { href: "/products?cat=led",        label: "Éclairage LED",   emoji: "💡" },
      { href: "/builder",                label: "Configurateur",    emoji: "⚙️", highlight: true },
      { href: "/pro",                    label: "★ Espace Pro",     emoji: "👷", pro: true },
    ],
  },
};

const DEFAULT_TICKER_EVENTS = [
  { icon: "🛒", message: "Ahmed B. de Tunis vient d'acheter 2× Charnières soft-close 110°",        time: "il y a 2 min", order: 1 },
  { icon: "⭐", message: "Sonia M. laisse 5 étoiles — \"Livraison ultra rapide, merci SIMEX !\"",  time: "",              order: 2 },
  { icon: "🔥", message: "31 personnes regardent les Glissières full-extension en ce moment",       time: "",              order: 3 },
  { icon: "🛒", message: "Mohamed K. de Sfax vient d'acheter 1× Ruban LED 5m 3000K",              time: "il y a 7 min",  order: 4 },
  { icon: "💬", message: "\"Qualité premium, montage facile\" — Ines R., Sousse",                  time: "",              order: 5 },
  { icon: "🛒", message: "Hamdi L. de Bizerte vient d'acheter 3× Spots LED encastrés 3W",         time: "il y a 11 min", order: 6 },
  { icon: "⚡", message: "Flash Sale active — −30% sur les charnières avec le code SIMEX20",       time: "",              order: 7 },
  { icon: "🛒", message: "Rania T. de Monastir vient d'acheter 1× Kit amortisseur soft-close",    time: "il y a 17 min", order: 8 },
  { icon: "🎁", message: "Offre bienvenue − code BIENVENU pour −10% sur votre 1ère commande",      time: "",              order: 9 },
  { icon: "📦", message: "Commande livrée en 20h à Tunis — satisfaction client 100%",              time: "",              order: 10 },
];

const DEFAULT_TESTIMONIALS = [
  { name: "Ahmed Benali",   city: "Tunis",    initials: "AB", color: "from-blue-600 to-blue-400",      rating: 5, product: "Charnières soft-close 110°",       body: "Qualité impeccable. J'ai équipé toute ma cuisine avec les charnières SIMEX — fermeture en douceur parfaite, aucun claquement. Livraison à Tunis en moins de 24h comme promis. Je recommande à 100%.", date: "Mars 2026",    verified: true, order: 1 },
  { name: "Sonia Mejri",    city: "Sfax",     initials: "SM", color: "from-emerald-600 to-teal-400",   rating: 5, product: "Glissières full-extension 450mm",   body: "J'ai commandé pour rénover mes tiroirs de cuisine. Montage facile avec les instructions fournies, glissement ultra silencieux. Le prix est imbattable comparé aux magasins locaux. Très satisfaite !", date: "Février 2026", verified: true, order: 2 },
  { name: "Karim Tlili",    city: "Sousse",   initials: "KT", color: "from-purple-600 to-violet-400",  rating: 5, product: "Ruban LED 5m 3000K",               body: "Excellent rapport qualité-prix. La lumière est chaleureuse et l'installation est vraiment simple. Mon salon est complètement transformé. J'ai déjà passé une deuxième commande pour la salle à manger.", date: "Janvier 2026", verified: true, order: 3 },
  { name: "Ines Dridi",     city: "Monastir", initials: "ID", color: "from-amber-500 to-orange-400",   rating: 5, product: "Poignées aluminium noir mat 128mm", body: "Belle finition, très moderne. Les poignées ont complètement changé l'esthétique de mes meubles. J'ai eu peur que la couleur ne corresponde pas, mais c'est parfait. Livraison rapide malgré la distance.", date: "Avril 2026",   verified: true, order: 4 },
  { name: "Hamdi Layouni",  city: "Bizerte",  initials: "HL", color: "from-rose-600 to-pink-400",      rating: 5, product: "Kit amortisseur soft-close",        body: "Service client au top ! J'avais une question sur la compatibilité, ils ont répondu en 10 minutes sur WhatsApp. Le produit est nickel, mes tiroirs ferment maintenant sans bruit. Merci SIMEX.", date: "Mars 2026",    verified: true, order: 5 },
  { name: "Rania Troudi",   city: "Nabeul",   initials: "RT", color: "from-cyan-600 to-sky-400",       rating: 4, product: "Spots LED encastrés 3W",           body: "Très bons spots LED, lumière douce et chaleureuse. La pose est simple même pour un non-professionnel. Un seul bémol : j'aurais aimé une notice en arabe, mais le service client a compensé par appel vidéo.", date: "Février 2026", verified: true, order: 6 },
];

const DEFAULT_FAQ_ITEMS = [
  { question: "Comment puis-je suivre ma commande ?",   answer: "Une fois votre commande passée, vous recevrez un email de confirmation contenant un lien de suivi. Cliquez dessus pour voir l'état actuel de votre commande en temps réel : préparation, expédition, livraison.", order: 1 },
  { question: "Quels sont les délais de livraison ?",   answer: "Les délais varient en fonction de votre localisation. En général, comptez entre 24h et 48h pour les livraisons en Tunisie.", order: 2 },
  { question: "Que faire si je n'ai pas reçu ma commande ?", answer: "Si votre commande n'est pas arrivée dans les délais prévus, contactez-nous à societesimex@gmail.com ou au +216 97 730 083.", order: 3 },
  { question: "Puis-je modifier l'adresse de livraison ?", answer: "Une fois la commande passée, contactez-nous directement pour effectuer ce changement, à condition que la commande n'ait pas encore été expédiée.", order: 4 },
  { question: "Quels modes de paiement acceptez-vous ?", answer: "CB via ClicToPay, D17/Flouci, Konnect, espèces à la livraison, virement, et compte Pro à 30 jours.", order: 5 },
];

const DEFAULT_VIDEO_ITEMS = [
  { title: "Installer une charnière clip-on",  duration: "3:42", thumbUrl: "https://images.unsplash.com/photo-1556909114-44e3e9c5b8a8?w=800&q=80&auto=format&fit=crop", videoUrl: "", order: 1 },
  { title: "Régler une glissière soft-close",  duration: "2:15", thumbUrl: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80&auto=format&fit=crop", videoUrl: "", order: 2 },
  { title: "Brancher un ruban LED 12V",        duration: "4:08", thumbUrl: "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800&q=80&auto=format&fit=crop", videoUrl: "", order: 3 },
];

// ── Auto-seed empty tables ─────────────────────────────────────────────────────
async function seedDefaults() {
  const [tickerCount, testimonialCount, faqCount, videoCount, siteContentKeys] = await Promise.all([
    db.tickerEvent.count(),
    db.testimonial.count(),
    db.faqItem.count(),
    db.videoItem.count(),
    db.siteContent.findMany({ select: { key: true } }),
  ]);

  const existingKeys = new Set(siteContentKeys.map((r) => r.key));

  await Promise.all([
    tickerCount === 0 && db.tickerEvent.createMany({ data: DEFAULT_TICKER_EVENTS }),
    testimonialCount === 0 && db.testimonial.createMany({ data: DEFAULT_TESTIMONIALS }),
    faqCount === 0 && db.faqItem.createMany({ data: DEFAULT_FAQ_ITEMS }),
    videoCount === 0 && db.videoItem.createMany({ data: DEFAULT_VIDEO_ITEMS }),
    ...Object.entries(DEFAULT_SITE_CONTENT)
      .filter(([key]) => !existingKeys.has(key))
      .map(([key, value]) =>
        db.siteContent.create({ data: { key, value: JSON.stringify(value) } })
      ),
  ].filter(Boolean));
}

export default async function ContentPage() {
  // Seed defaults on first visit (no-op if already seeded)
  await seedDefaults();

  const [testimonials, faqItems, tickerEvents, videoItems, products, rawSiteContent] =
    await Promise.all([
      db.testimonial.findMany({ orderBy: { order: "asc" } }),
      db.faqItem.findMany({ orderBy: { order: "asc" } }),
      db.tickerEvent.findMany({ orderBy: { order: "asc" } }),
      db.videoItem.findMany({ orderBy: { order: "asc" } }),
      db.product.findMany({
        where: { status: "active" },
        include: { images: { take: 1, orderBy: { order: "asc" } } },
        orderBy: { nameFr: "asc" },
        take: 100,
      }),
      db.siteContent.findMany(),
    ]);

  const siteContent: Record<string, any> = {};
  for (const row of rawSiteContent) {
    try { siteContent[row.key] = JSON.parse(row.value); } catch { siteContent[row.key] = {}; }
  }

  const serialized = {
    testimonials: testimonials.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    })),
    faqItems,
    tickerEvents,
    videoItems,
    products: products.map((p) => ({
      id: p.id,
      name: p.nameFr || p.nameEn || p.nameAr || p.sku || p.id,
      sku: p.sku,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      image: p.images[0]?.url ?? "",
    })),
    siteContent,
  };

  return <ContentClient {...serialized} />;
}
