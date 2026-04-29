import { db } from "@/lib/db";
import { HomepageClient } from "./homepage-client";

export const dynamic = "force-dynamic";

// Default slides when DB is empty
const DEFAULT_SLIDES = [
  {
    id: "default-1", order: 0, isActive: true,
    eyebrow: "Catalogue 2026 · Quincaillerie de meuble",
    titleLine1: "La quincaillerie", titleLine2: "de meuble à", titleLine3: "votre service.",
    description: "Un large choix de produits de qualité, une expérience d'achat rapide et des conseils personnalisés pour vos projets.",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
    btn1Label: "Découvrir le catalogue", btn1Href: "/products",
    btn2Label: "Espace Pro", btn2Href: "/builder",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "default-2", order: 1, isActive: true,
    eyebrow: "Innovation · Simex Front Clamps",
    titleLine1: "Installation", titleLine2: "de tiroirs", titleLine3: "100% précise.",
    description: "Dites adieu aux mesures compliquées ! Avec nos Front Installation Clamps, la pose de vos façades devient un jeu d'enfant.",
    imageUrl: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1600&q=80",
    btn1Label: "Acheter la paire (46 DT)", btn1Href: "/products",
    btn2Label: "Voir la vidéo", btn2Href: "/builder",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "default-3", order: 2, isActive: true,
    eyebrow: "Gola LED · Design Moderne",
    titleLine1: "Cuisines", titleLine2: "sans poignées", titleLine3: "lumineuses.",
    description: "Transformez votre cuisine avec nos profilés Gola LED. Un look minimaliste, un éclairage intégré.",
    imageUrl: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1600&q=80",
    btn1Label: "Voir les profilés", btn1Href: "/products",
    btn2Label: "Guide technique", btn2Href: "/builder",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_SECTIONS = [
  { key: "happy_hour",   label: "Happy Hour",         order: 0,  isVisible: true },
  { key: "promotions",   label: "Offres Flash",        order: 1,  isVisible: true },
  { key: "personas",     label: "Qui êtes-vous ?",     order: 2,  isVisible: true },
  { key: "categories",   label: "Catégories",          order: 3,  isVisible: true },
  { key: "products",     label: "Produits phares",     order: 4,  isVisible: true },
  { key: "daily_deal",   label: "Deal du jour",        order: 5,  isVisible: true },
  { key: "black_friday", label: "Black Friday",        order: 6,  isVisible: true },
  { key: "builder",      label: "Configurateur",       order: 7,  isVisible: true },
  { key: "pro_banner",   label: "Espace Pro",          order: 8,  isVisible: true },
  { key: "mission",      label: "Notre mission",       order: 9,  isVisible: true },
  { key: "video",        label: "Showcase vidéo",      order: 10, isVisible: true },
  { key: "testimonials", label: "Témoignages",         order: 11, isVisible: true },
  { key: "trust",        label: "Barre de confiance",  order: 12, isVisible: true },
  { key: "faq",          label: "FAQ",                 order: 13, isVisible: true },
  { key: "newsletter",   label: "Newsletter",          order: 14, isVisible: true },
];

async function getData() {
  try {
    const [rawSlides, rawSections] = await Promise.all([
      db.sliderSlide.findMany({ orderBy: { order: "asc" } }),
      db.homepageSection.findMany({ orderBy: { order: "asc" } }),
    ]);

    // Auto-seed sections if empty
    let sections = rawSections;
    if (sections.length === 0) {
      await db.homepageSection.createMany({ data: DEFAULT_SECTIONS });
      sections = await db.homepageSection.findMany({ orderBy: { order: "asc" } });
    }

    const slides = rawSlides.map((s: any) => ({
      ...s,
      createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : s.createdAt,
      updatedAt: s.updatedAt instanceof Date ? s.updatedAt.toISOString() : s.updatedAt,
    }));

    return { slides: slides.length ? slides : DEFAULT_SLIDES, sections };
  } catch {
    return { slides: DEFAULT_SLIDES, sections: [] };
  }
}

export default async function HomepageDashboardPage() {
  const { slides, sections } = await getData();
  return <HomepageClient initialSlides={slides} initialSections={sections} />;
}
