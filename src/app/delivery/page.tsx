import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DeliveryOrdersClient } from "./delivery-orders-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DeliveryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("simex_session")?.value;
  const session = token ? await verifySession(token) : null;

  if (!session || (session.role !== "DELIVERY" && session.role !== "ADMIN" && session.role !== "STAFF")) {
    redirect("/simexdash");
  }

  try {
    const where =
      session.role === "DELIVERY"
        ? { deliveryAgentId: session.userId }
        : {};

    const orders = await db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { nameFr: true, images: { take: 1 } } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const serialized = orders.map((o) => ({
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
    }));

    return <DeliveryOrdersClient initialOrders={serialized} agentName={session.email} />;
  } catch {
    return <DeliveryOrdersClient initialOrders={[]} agentName={session.email} />;
  }
}
