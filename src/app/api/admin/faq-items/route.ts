import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const items = await db.faqItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await db.faqItem.create({
    data: {
      question: body.question ?? "",
      answer:   body.answer   ?? "",
      order:    body.order    ?? 0,
      isActive: body.isActive ?? true,
    },
  });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  const item = await db.faqItem.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.faqItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
