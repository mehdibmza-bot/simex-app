import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = 20;

  try {
    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (q) {
      where.OR = [
        { number: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { user: { name: { contains: q } } },
      ];
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { nameFr: true, images: { take: 1 } } } } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, limit });
  } catch {
    return NextResponse.json({ orders: [], total: 0, page, limit });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, trackingCode, notes, deliveryAgentId, deliveryAgentName } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const order = await db.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(trackingCode !== undefined && { trackingCode }),
        ...(notes !== undefined && { notes }),
        ...(deliveryAgentId !== undefined && { deliveryAgentId }),
        ...(deliveryAgentName !== undefined && { deliveryAgentName }),
      },
    });
    return NextResponse.json({ order });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "DB error" }, { status: 500 });
  }
}
