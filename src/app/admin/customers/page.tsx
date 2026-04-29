import { db } from "@/lib/db";
import { CustomersClient } from "./customers-client";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  let users: any[] = [];
  try {
    users = await db.user.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true, proTier: true, taxId: true, discount: true, notes: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
  } catch { /* demo */ }

  return <CustomersClient initialUsers={users} initialTotal={users.length} />;
}
