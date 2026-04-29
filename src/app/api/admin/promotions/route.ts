import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const promotions = await db.promotion.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ promotions });
  } catch {
    return NextResponse.json({ promotions: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, usageCount, createdAt, ...data } = body; // strip auto fields
    const promo = await db.promotion.create({
      data: {
        ...data,
        code: data.code?.trim().toUpperCase(),
        value: parseFloat(data.value),
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
      },
    });
    return NextResponse.json({ promo });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, usageCount: _uc, createdAt: _ca, ...data } = await req.json();
    const updateData: any = { ...data };
    if (data.value !== undefined) updateData.value = parseFloat(data.value);
    if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit ? parseInt(data.usageLimit) : null;
    if (data.startsAt) updateData.startsAt = new Date(data.startsAt);
    if (data.endsAt) updateData.endsAt = new Date(data.endsAt);
    if (data.code) updateData.code = data.code.trim().toUpperCase();
    const promo = await db.promotion.update({ where: { id }, data: updateData });
    return NextResponse.json({ promo });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.promotion.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

