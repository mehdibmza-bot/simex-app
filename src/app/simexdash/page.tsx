import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import SimexLoginClient from "./login-client";

export default async function SimexDashEntryPage() {
  // If already authenticated as ADMIN/STAFF, skip the login form
  const cookieStore = await cookies();
  const token = cookieStore.get("simex_session")?.value;
  if (token) {
    const session = await verifySession(token);
    if (session?.role === "ADMIN" || session?.role === "STAFF") {
      redirect("/simexdash/dashboard");
    }
    if (session?.role === "DELIVERY") {
      redirect("/delivery");
    }
  }

  return <SimexLoginClient />;
}
