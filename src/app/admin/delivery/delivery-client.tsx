"use client";

import { useState } from "react";
import { MapPin, Pencil, Truck, Clock, Plus, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const INITIAL_ZONES = [
  { id: "z1", name: "Grand Tunis", cities: ["Tunis", "Ariana", "Ben Arous", "La Marsa", "La Goulette"], standardPrice: 7, expressPrice: 15, freeThreshold: 200, days: "24h" },
  { id: "z2", name: "Zone Nord", cities: ["Bizerte", "Nabeul", "Sousse", "Hammamet", "Zaghouan"], standardPrice: 10, expressPrice: 20, freeThreshold: 300, days: "48h" },
  { id: "z3", name: "Zone Centre", cities: ["Sfax", "Monastir", "Mahdia", "Kairouan", "Sidi Bouzid"], standardPrice: 12, expressPrice: 25, freeThreshold: 350, days: "48-72h" },
  { id: "z4", name: "Zone Sud", cities: ["Gabès", "Gafsa", "Tozeur", "Médenine", "Tataouine", "Kébili"], standardPrice: 15, expressPrice: 30, freeThreshold: 400, days: "72h" },
  { id: "z5", name: "Zone Ouest", cities: ["Jendouba", "Béja", "Siliana", "Kef", "Kasserine"], standardPrice: 12, expressPrice: 22, freeThreshold: 350, days: "48-72h" },
];

export function DeliveryClient() {
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [editZone, setEditZone] = useState<any>(null);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const setF = (k: string, v: any) => setEditForm((f: any) => ({ ...f, [k]: v }));

  const openEdit = (z: any) => {
    setEditZone(z);
    setEditForm({ ...z, citiesStr: z.cities.join(", ") });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    const updated = { ...editForm, cities: editForm.citiesStr.split(",").map((c: string) => c.trim()).filter(Boolean) };
    delete updated.citiesStr;
    setZones(zs => zs.map(z => z.id === editZone.id ? updated : z));
    showToast("Zone de livraison mise à jour ✓");
    setSaving(false);
    setModal(false);
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-5 right-5 z-[100] bg-brand-black text-white text-sm px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">{toast}</div>}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5 text-brand-red" />
        </div>
        <div>
          <h3 className="font-bold text-brand-black">Zones de livraison</h3>
          <p className="text-sm text-neutral-500 mt-0.5">Configurez les prix et délais de livraison par région.</p>
        </div>
      </div>

      {/* Zone cards */}
      <div className="space-y-3">
        {zones.map(z => (
          <div key={z.id} className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-red" />
                <h4 className="font-bold text-brand-black">{z.name}</h4>
              </div>
              <button onClick={() => openEdit(z)} className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-600 border border-neutral-200 transition-all">
                <Pencil className="w-3 h-3" /> Modifier
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {z.cities.map(c => (
                <span key={c} className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-xs text-neutral-600">{c}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-neutral-50 rounded-xl p-3">
                <p className="text-xs text-neutral-500 mb-0.5">Standard</p>
                <p className="font-black text-brand-black">{z.standardPrice} TND</p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3">
                <p className="text-xs text-neutral-500 mb-0.5">Express</p>
                <p className="font-black text-brand-black">{z.expressPrice} TND</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-xs text-emerald-600 mb-0.5">Gratuit dès</p>
                <p className="font-black text-emerald-700">{z.freeThreshold} TND</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-0.5">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <p className="text-xs text-blue-500">Délai</p>
                </div>
                <p className="font-black text-blue-700">{z.days}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-neutral-900 text-white px-8 py-7 shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Modifier — {editZone?.name}</h2>
                <p className="text-neutral-400 text-sm font-medium mt-0.5">Zone de livraison</p>
              </div>
              <button onClick={() => setModal(false)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all shrink-0"><X className="w-5 h-5" /></button>
            </div>
          {editForm && (
            <div className="overflow-y-auto flex-1 px-8 py-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Nom de la zone</p>
                <input value={editForm.name} onChange={e => setF("name", e.target.value)}
                  className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">Villes (séparées par des virgules)</p>
                <textarea value={editForm.citiesStr} onChange={e => setF("citiesStr", e.target.value)} rows={3}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Livraison standard (TND)</p>
                  <input value={editForm.standardPrice} onChange={e => setF("standardPrice", Number(e.target.value))} type="number" min="0"
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Livraison express (TND)</p>
                  <input value={editForm.expressPrice} onChange={e => setF("expressPrice", Number(e.target.value))} type="number" min="0"
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Gratuit dès (TND)</p>
                  <input value={editForm.freeThreshold} onChange={e => setF("freeThreshold", Number(e.target.value))} type="number" min="0"
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-1.5">Délai livraison</p>
                  <input value={editForm.days} onChange={e => setF("days", e.target.value)} placeholder="24h"
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={save} disabled={saving} className="flex-1">{saving ? "…" : "Enregistrer"}</Button>
                <Button variant="outline" onClick={() => setModal(false)}>Annuler</Button>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
