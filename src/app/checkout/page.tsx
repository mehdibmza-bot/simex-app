"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, useUI } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  getDelegationsByGovernorate,
  TUNISIA_GOVERNORATE_OPTIONS,
} from "@/data/tunisia-governorates";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const showToast = useUI((s) => s.showToast);
  const [loading, setLoading] = useState(false);
  const [pm, setPm] = useState<"COD" | "CARD" | "D17" | "KONNECT">("COD");
  const [governorate, setGovernorate] = useState("");
  const [delegation, setDelegation] = useState("");

  const delegationOptions = useMemo(
    () => getDelegationsByGovernorate(governorate),
    [governorate]
  );

  const shipping = subtotal > 200 ? 0 : 8;
  const total = subtotal + shipping;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      items: items.map((i) => ({ productId: i.id, qty: i.qty })),
      email: fd.get("email"),
      name: fd.get("name"),
      phone: fd.get("phone"),
      address: {
        line1: fd.get("address"),
        line2: fd.get("address2"),
        city: fd.get("city"),
        governorate: fd.get("governorate"),
      },
      paymentMethod: pm,
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        clear();
        showToast(`Commande #${data.orderNumber} confirmée !`, "✓");
        router.push("/");
      } else {
        showToast("Erreur lors de la commande", "⚠");
      }
    } catch {
      showToast("Erreur réseau", "⚠");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-32 text-center">
        <h1 className="display text-4xl mb-4">Panier vide</h1>
        <p className="text-neutral-500 mb-6">Ajoutez des produits avant de passer commande.</p>
        <Button onClick={() => router.push("/products")}>Voir le catalogue</Button>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream py-12 min-h-screen">
      <div className="container max-w-5xl">
        <h1 className="display text-4xl mb-8">Finaliser ma commande</h1>
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="bg-white rounded-2xl p-6 space-y-5">
            <h2 className="display text-2xl">Coordonnées & livraison</h2>
            <div className="grid grid-cols-2 gap-3">
              <Input name="name" placeholder="Nom complet" required />
              <Input name="phone" placeholder="Téléphone" required />
            </div>
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="address" placeholder="Adresse" required />
            <Input
              name="address2"
              placeholder="Adresse complementaire (optionnel): etage, immeuble, repere..."
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                name="governorate"
                required
                value={governorate}
                onChange={(e) => {
                  setGovernorate(e.target.value);
                  setDelegation("");
                }}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-brand-red"
              >
                <option value="">Gouvernorat</option>
                {TUNISIA_GOVERNORATE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <select
                name="city"
                required
                disabled={!governorate}
                value={delegation}
                onChange={(e) => setDelegation(e.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-brand-red disabled:cursor-not-allowed disabled:bg-neutral-100"
              >
                <option value="">Ville / Delegation</option>
                {delegationOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Mode de paiement</p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { v: "COD", label: "Espèces à la livraison" },
                    { v: "CARD", label: "Carte bancaire" },
                    { v: "D17", label: "D17 / Flouci" },
                    { v: "KONNECT", label: "Konnect" },
                  ] as const
                ).map((o) => (
                  <button
                    type="button"
                    key={o.v}
                    onClick={() => setPm(o.v)}
                    className={`p-3 rounded-xl border-2 text-sm text-left transition-colors ${
                      pm === o.v ? "border-brand-red bg-brand-red/5" : "border-neutral-200"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="bg-brand-black text-white rounded-2xl p-6 self-start sticky top-28">
            <h2 className="display text-2xl tracking-wider mb-5">Récapitulatif</h2>
            <div className="space-y-2 text-sm mb-4 max-h-60 overflow-y-auto">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-3 py-1">
                  <span className="text-neutral-300 line-clamp-1 flex-1">
                    {i.name} × {i.qty}
                  </span>
                  <span className="font-semibold whitespace-nowrap">
                    {formatPrice(i.price * i.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-800 pt-4 space-y-1.5 text-sm">
              <Row label="Sous-total" value={formatPrice(subtotal)} />
              <Row label="Livraison" value={shipping === 0 ? "Offerte" : formatPrice(shipping)} />
              <div className="border-t border-neutral-800 my-2" />
              <Row label="Total" value={formatPrice(total)} bold />
            </div>
            <Button type="submit" disabled={loading} size="lg" className="w-full mt-5">
              {loading ? "Validation..." : "Confirmer ma commande"}
            </Button>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-bold" : "text-neutral-400"}>{label}</span>
      <span className={bold ? "display text-2xl text-brand-red" : "font-semibold"}>{value}</span>
    </div>
  );
}
