import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const slides = await db.sliderSlide.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slide = await db.sliderSlide.create({
    data: {
      eyebrow:    body.eyebrow    ?? "",
      titleLine1: body.titleLine1 ?? "",
      titleLine2: body.titleLine2 ?? "",
      titleLine3: body.titleLine3 ?? "",
      description:body.description ?? "",
      imageUrl:   body.imageUrl   ?? "",
      btn1Label:  body.btn1Label  ?? "Découvrir",
      btn1Href:   body.btn1Href   ?? "/products",
      btn2Label:  body.btn2Label  ?? "En savoir plus",
      btn2Href:   body.btn2Href   ?? "/builder",
      order:      body.order      ?? 0,
      isActive:   body.isActive   ?? true,
    },
  });
  return NextResponse.json(slide);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  const slide = await db.sliderSlide.update({ where: { id }, data });
  return NextResponse.json(slide);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.sliderSlide.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
