import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const items = await db.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await db.testimonial.create({
    data: {
      name:     body.name     ?? "",
      city:     body.city     ?? "",
      initials: body.initials ?? "",
      color:    body.color    ?? "from-blue-600 to-blue-400",
      rating:   body.rating   ?? 5,
      product:  body.product  ?? "",
      body:     body.body     ?? "",
      date:     body.date     ?? "",
      verified: body.verified ?? true,
      isActive: body.isActive ?? true,
      order:    body.order    ?? 0,
    },
  });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  const item = await db.testimonial.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
