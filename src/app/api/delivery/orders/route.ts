import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";

// Statuses a delivery agent is allowed to set
const DELIVERY_ALLOWED_STATUSES = ["SHIPPED", "DELIVERED", "RETURNED"];

async function getDeliverySession(req: NextRequest) {
  const token = req.cookies.get("simex_session")?.value;
  if (!token) return null;
  const session = await verifySession(token);
  if (!session) return null;
  if (session.role !== "DELIVERY" && session.role !== "ADMIN" && session.role !== "STAFF") return null;
  return session;
}

// GET /api/delivery/orders — returns orders assigned to the calling delivery agent
export async function GET(req: NextRequest) {
  const session = await getDeliverySession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  try {
    const where: any = {
      // Admins/Staff see all; delivery agents see only their own
      ...(session.role === "DELIVERY" ? { deliveryAgentId: session.userId } : {}),
    };
    if (status && status !== "ALL") where.status = status;
    if (q) {
      where.OR = [
        { number: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { user: { name: { contains: q } } },
      ];
    }

    const orders = await db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { nameFr: true, images: { take: 1 } } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders: orders.map((o) => ({
        ...o,
        total: Number(o.total),
        subtotal: Number(o.subtotal),
        shipping: Number(o.shipping),
        discount: Number(o.discount),
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        items: o.items.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        })),
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "DB error" }, { status: 500 });
  }
}

// PATCH /api/delivery/orders — delivery agent updates tracking/status/notes on their own order
export async function PATCH(req: NextRequest) {
  const session = await getDeliverySession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status, trackingCode, deliveryNotes } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Verify ownership for delivery agents
    if (session.role === "DELIVERY") {
      const existing = await db.order.findUnique({ where: { id }, select: { deliveryAgentId: true } });
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (existing.deliveryAgentId !== session.userId) {
        return NextResponse.json({ error: "Forbidden — not your order" }, { status: 403 });
      }
      // Restrict status changes for delivery agents
      if (status && !DELIVERY_ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Status change not allowed" }, { status: 403 });
      }
    }

    const order = await db.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(trackingCode !== undefined && { trackingCode }),
        ...(deliveryNotes !== undefined && { deliveryNotes }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      order: { ...order, total: Number(order.total), subtotal: Number(order.subtotal) },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "DB error" }, { status: 500 });
  }
}
