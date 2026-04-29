import { db } from "@/lib/db";
import { PromotionsClient } from "./promotions-client";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  let promotions: any[] = [];
  try {
    promotions = await db.promotion.findMany({ orderBy: { createdAt: "desc" } });
  } catch { /* demo */ }

  return <PromotionsClient initialPromos={promotions} />;
}
