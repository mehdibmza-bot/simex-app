import { db } from "@/lib/db";
import { OrdersClient } from "./orders-client";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  let orders: any[] = [];
  let total = 0;
  try {
    const result = await db.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { nameFr: true, images: { take: 1 } } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    orders = result.map(o => ({
      ...o,
      total: Number(o.total),
      subtotal: Number(o.subtotal),
      shipping: Number(o.shipping),
      discount: Number(o.discount),
      createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
      updatedAt: o.updatedAt instanceof Date ? o.updatedAt.toISOString() : o.updatedAt,
      items: o.items.map((item: any) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })),
    }));
    total = orders.length;
  } catch { /* use demo data */ }

  return <OrdersClient initialOrders={orders} initialTotal={total} />;
}
