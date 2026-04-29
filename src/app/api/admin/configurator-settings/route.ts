import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Configurator settings are stored as a JSON singleton row in a SiteConfig table.
// For now, we use a simple file-based approach via a JSON config object persisted
// in a dedicated SiteConfig prisma model (or a flat key-value store).
// Since no SiteConfig model exists yet, we use a simple in-memory store with
// localStorage persistence on the client side, and return defaults from this route.

const DEFAULT_CONFIG = {
  // Configurator general
  configuratorEnabled: true,
  configuratorTitle: "Configurateur de Meubles",
  configuratorSubtitle: "Personnalisez votre meuble selon vos besoins",

  // Steps visible
  showStepMaterial: true,
  showStepDimensions: true,
  showStepColor: true,
  showStepFinish: true,
  showStepAccessories: true,

  // Dimensions limits
  minWidth: 200,
  maxWidth: 3000,
  minHeight: 200,
  maxHeight: 2500,
  minDepth: 100,
  maxDepth: 800,
  defaultWidth: 600,
  defaultHeight: 900,
  defaultDepth: 300,

  // Pricing multipliers
  basePriceMultiplier: 1.0,
  rushOrderMultiplier: 1.25,
  proDiscountPercent: 10,
  enableDynamicPricing: true,

  // Lead time
  standardLeadTimeDays: 21,
  rushLeadTimeDays: 10,
  rushOptionEnabled: true,

  // 3D Viewer
  viewer3DEnabled: true,
  viewerDefaultRotation: true,
  viewerShowDimensions: true,
  viewerBackgroundColor: "#f8f8f8",

  // Quote & ordering
  requireLoginToOrder: false,
  allowGuestQuote: true,
  autoSendQuoteEmail: true,
  quoteValidityDays: 30,

  // Materials available
  availableMaterials: ["MDF", "AGGLOMERE", "CONTREPLAQUE", "BOIS_MASSIF", "ALUMINUM"],
  availableFinishes: ["MAT", "GLOSS", "LAQUE", "MELAMINE", "PLACAGE"],
  availableColors: ["BLANC", "GRIS", "NOIR", "WENGE", "CHENE", "NOYER"],
};

// In-memory store (resets on server restart — good enough for a demo/admin config)
let configStore: Record<string, any> = { ...DEFAULT_CONFIG };

export async function GET() {
  return NextResponse.json({ config: configStore });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    configStore = { ...configStore, ...body };
    return NextResponse.json({ config: configStore });
  } catch {
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}

export async function DELETE() {
  configStore = { ...DEFAULT_CONFIG };
  return NextResponse.json({ config: configStore });
}
