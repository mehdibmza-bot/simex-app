import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const items = await db.tickerEvent.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await db.tickerEvent.create({
    data: {
      icon:     body.icon     ?? "🛒",
      message:  body.message  ?? "",
      time:     body.time     ?? "",
      isActive: body.isActive ?? true,
      order:    body.order    ?? 0,
    },
  });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  const item = await db.tickerEvent.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.tickerEvent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
