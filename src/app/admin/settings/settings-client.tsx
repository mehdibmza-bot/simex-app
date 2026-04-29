"use client";

import { useState } from "react";
import { Save, Store, CreditCard, Globe, Bell, Shield, Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TabProps { id: string; label: string; icon: React.ElementType }
const TABS: TabProps[] = [
  { id: "store", label: "Boutique", icon: Store },
  { id: "payment", label: "Paiement", icon: CreditCard },
  { id: "socials", label: "Réseaux", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Sécurité", icon: Shield },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold text-brand-black text-sm mb-4 pb-2 border-b border-neutral-100">{children}</h3>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red", props.className)} />;
}

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState("store");
  const [toast, setToast] = useState<string | null>(null);
  const [store, setStore] = useState({ name: "SIMEX.tn", tagline: "Quincaillerie du meuble en Tunisie", phone: "+216 71 000 000", email: "contact@simex.tn", address: "Z.I. Ben Arous, Tunis, Tunisie", vatNumber: "TN-1234567/B" });
  const [payment, setPayment] = useState({ card: true, d17: true, konnect: true, cod: true, transfer: false, proNet30: true });
  const [socials, setSocials] = useState({ instagram: "https://instagram.com/simex.tn", facebook: "https://facebook.com/simex.tn", linkedin: "", whatsapp: "+21671000000" });
  const [notifs, setNotifs] = useState({ newOrder: true, lowStock: true, newReview: false, dailyReport: true, weeklyReport: true });
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: "60", maxLoginAttempts: "5" });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const save = () => showToast("Paramètres enregistrés ✓");

  const setS = (k: string, v: any) => setStore(f => ({ ...f, [k]: v }));
  const setP = (k: string, v: any) => setPayment(f => ({ ...f, [k]: v }));
  const setSo = (k: string, v: any) => setSocials(f => ({ ...f, [k]: v }));
  const setN = (k: string, v: any) => setNotifs(f => ({ ...f, [k]: v }));
  const setSec = (k: string, v: any) => setSecurity(f => ({ ...f, [k]: v }));

  return (
    <div className="max-w-3xl space-y-4">
      {toast && <div className="fixed top-5 right-5 z-[100] bg-brand-black text-white text-sm px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">{toast}</div>}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-1.5 flex gap-1 overflow-x-auto">
        {TABS.map(t => {
          const TIcon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn("flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
                activeTab === t.id ? "bg-brand-red text-white shadow-sm" : "text-neutral-500 hover:text-brand-black hover:bg-neutral-100"
              )}
            ><TIcon className="w-4 h-4" />{t.label}</button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        {/* Store info */}
        {activeTab === "store" && (
          <>
            <SectionTitle>Informations de la boutique</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom de la boutique"><Input value={store.name} onChange={e => setS("name", e.target.value)} /></Field>
              <Field label="Tagline"><Input value={store.tagline} onChange={e => setS("tagline", e.target.value)} /></Field>
              <Field label="Téléphone"><Input value={store.phone} onChange={e => setS("phone", e.target.value)} placeholder="+216 xx xxx xxx" /></Field>
              <Field label="Email"><Input value={store.email} onChange={e => setS("email", e.target.value)} type="email" /></Field>
              <Field label="Adresse">
                <Input value={store.address} onChange={e => setS("address", e.target.value)} />
              </Field>
              <Field label="Matricule fiscal"><Input value={store.vatNumber} onChange={e => setS("vatNumber", e.target.value)} className="font-mono" /></Field>
            </div>
          </>
        )}

        {/* Payment */}
        {activeTab === "payment" && (
          <>
            <SectionTitle>Méthodes de paiement</SectionTitle>
            <div className="space-y-3">
              {[
                { key: "card", label: "Carte bancaire", desc: "Visa / Mastercard en ligne" },
                { key: "d17", label: "D17", desc: "Paiement mobile D17" },
                { key: "konnect", label: "Konnect", desc: "Paiement mobile Konnect" },
                { key: "cod", label: "Paiement à la livraison", desc: "Cash on delivery" },
                { key: "transfer", label: "Virement bancaire", desc: "BIAT / STB / Attijari" },
                { key: "proNet30", label: "Crédit Pro Net 30", desc: "Uniquement pour comptes Pro validés" },
              ].map(p => (
                <label key={p.key} className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 cursor-pointer hover:border-brand-red/50 transition-all">
                  <div>
                    <p className="font-semibold text-sm text-brand-black">{p.label}</p>
                    <p className="text-xs text-neutral-500">{p.desc}</p>
                  </div>
                  <div className={cn("relative w-10 h-6 rounded-full transition-all", (payment as any)[p.key] ? "bg-brand-red" : "bg-neutral-200")}>
                    <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", (payment as any)[p.key] ? "left-[18px]" : "left-0.5")} />
                    <input type="checkbox" className="sr-only" checked={(payment as any)[p.key]} onChange={e => setP(p.key, e.target.checked)} />
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {/* Socials */}
        {activeTab === "socials" && (
          <>
            <SectionTitle>Réseaux sociaux & Contact</SectionTitle>
            <div className="space-y-4">
              <Field label="Instagram">
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input value={socials.instagram} onChange={e => setSo("instagram", e.target.value)} className="pl-10" placeholder="https://instagram.com/…" />
                </div>
              </Field>
              <Field label="Facebook">
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input value={socials.facebook} onChange={e => setSo("facebook", e.target.value)} className="pl-10" placeholder="https://facebook.com/…" />
                </div>
              </Field>
              <Field label="LinkedIn">
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input value={socials.linkedin} onChange={e => setSo("linkedin", e.target.value)} className="pl-10" placeholder="https://linkedin.com/…" />
                </div>
              </Field>
              <Field label="WhatsApp (numéro sans +)">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input value={socials.whatsapp} onChange={e => setSo("whatsapp", e.target.value)} className="pl-10 font-mono" placeholder="21671000000" />
                </div>
              </Field>
            </div>
          </>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <>
            <SectionTitle>Préférences de notifications</SectionTitle>
            <div className="space-y-3">
              {[
                { key: "newOrder", label: "Nouvelle commande", desc: "Alerte email à chaque commande" },
                { key: "lowStock", label: "Stock faible", desc: "Quand un produit passe sous 5 unités" },
                { key: "newReview", label: "Nouvel avis", desc: "À chaque avis client laissé" },
                { key: "dailyReport", label: "Rapport quotidien", desc: "Résumé des ventes du jour" },
                { key: "weeklyReport", label: "Rapport hebdomadaire", desc: "Bilan de la semaine" },
              ].map(n => (
                <label key={n.key} className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 cursor-pointer hover:border-brand-red/50 transition-all">
                  <div>
                    <p className="font-semibold text-sm text-brand-black">{n.label}</p>
                    <p className="text-xs text-neutral-500">{n.desc}</p>
                  </div>
                  <div className={cn("relative w-10 h-6 rounded-full transition-all", (notifs as any)[n.key] ? "bg-brand-red" : "bg-neutral-200")}>
                    <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", (notifs as any)[n.key] ? "left-[18px]" : "left-0.5")} />
                    <input type="checkbox" className="sr-only" checked={(notifs as any)[n.key]} onChange={e => setN(n.key, e.target.checked)} />
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <>
            <SectionTitle>Sécurité du compte admin</SectionTitle>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 cursor-pointer hover:border-brand-red/50 transition-all">
                <div>
                  <p className="font-semibold text-sm text-brand-black">Double authentification (2FA)</p>
                  <p className="text-xs text-neutral-500">Ajoute une couche de sécurité à la connexion admin</p>
                </div>
                <div className={cn("relative w-10 h-6 rounded-full transition-all", security.twoFactor ? "bg-brand-red" : "bg-neutral-200")}>
                  <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", security.twoFactor ? "left-[18px]" : "left-0.5")} />
                  <input type="checkbox" className="sr-only" checked={security.twoFactor} onChange={e => setSec("twoFactor", e.target.checked)} />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Timeout session (minutes)">
                  <Input value={security.sessionTimeout} onChange={e => setSec("sessionTimeout", e.target.value)} type="number" min="5" max="1440" />
                </Field>
                <Field label="Tentatives de connexion max">
                  <Input value={security.maxLoginAttempts} onChange={e => setSec("maxLoginAttempts", e.target.value)} type="number" min="1" max="20" />
                </Field>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={save}><Save className="w-4 h-4 mr-2" />Enregistrer les modifications</Button>
      </div>
    </div>
  );
}
