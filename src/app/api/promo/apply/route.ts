import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ ok: false, msg: "Code manquant." }, { status: 400 });
    }

    const promo = await db.promotion.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!promo) {
      return NextResponse.json({ ok: false, msg: "Code invalide ou expiré." });
    }
    if (!promo.isActive) {
      return NextResponse.json({ ok: false, msg: "Ce code est désactivé." });
    }
    const now = new Date();
    if (promo.startsAt > now) {
      return NextResponse.json({ ok: false, msg: "Ce code n'est pas encore actif." });
    }
    if (promo.endsAt < now) {
      return NextResponse.json({ ok: false, msg: "Ce code a expiré." });
    }
    if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({ ok: false, msg: "Ce code a atteint sa limite d'utilisation." });
    }

    const TYPE_LABELS: Record<string, string> = {
      flash:      "⚡ Flash Sale",
      happy_hour: "🌟 Happy Hour",
      bundle:     "🎁 Bundle",
      tier:       "⭐ Tier Pro",
      coupon:     "🏷️ Code promo",
    };
    const label = `${TYPE_LABELS[promo.type] ?? "🏷️"} -${promo.value}%`;

    return NextResponse.json({
      ok: true,
      msg: `Code appliqué : ${label}`,
      promo: {
        id: promo.id,
        code: promo.code,
        type: promo.type,
        value: Number(promo.value),
        label,
        description: promo.description,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, msg: "Erreur serveur." }, { status: 500 });
  }
}
