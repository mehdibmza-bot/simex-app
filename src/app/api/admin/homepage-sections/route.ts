import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Default sections — created on first GET if DB is empty
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

export async function GET() {
  let sections = await db.homepageSection.findMany({ orderBy: { order: "asc" } });

  // Seed defaults on first call
  if (sections.length === 0) {
    await db.homepageSection.createMany({ data: DEFAULT_SECTIONS });
    sections = await db.homepageSection.findMany({ orderBy: { order: "asc" } });
  }

  return NextResponse.json(sections);
}

export async function PUT(req: NextRequest) {
  // Accepts array of { id, isVisible, order }
  const updates: { id: string; isVisible?: boolean; order?: number }[] = await req.json();
  await Promise.all(
    updates.map((u) =>
      db.homepageSection.update({
        where: { id: u.id },
        data: { isVisible: u.isVisible, order: u.order },
      })
    )
  );
  const sections = await db.homepageSection.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(sections);
}
