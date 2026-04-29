"use client";

import { useState, useEffect } from "react";
import {
  Settings2, Save, RefreshCw, ToggleLeft, ToggleRight, Check, X,
  Ruler, Palette, Package, Clock, Eye, ShoppingCart, Sliders, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Config = Record<string, any>;

const DEFAULTS: Config = {
  configuratorEnabled: true,
  configuratorTitle: "Configurateur de Meubles",
  configuratorSubtitle: "Personnalisez votre meuble selon vos besoins",
  showStepMaterial: true,
  showStepDimensions: true,
  showStepColor: true,
  showStepFinish: true,
  showStepAccessories: true,
  minWidth: 200, maxWidth: 3000, defaultWidth: 600,
  minHeight: 200, maxHeight: 2500, defaultHeight: 900,
  minDepth: 100, maxDepth: 800, defaultDepth: 300,
  basePriceMultiplier: 1.0,
  rushOrderMultiplier: 1.25,
  proDiscountPercent: 10,
  enableDynamicPricing: true,
  standardLeadTimeDays: 21,
  rushLeadTimeDays: 10,
  rushOptionEnabled: true,
  viewer3DEnabled: true,
  viewerDefaultRotation: true,
  viewerShowDimensions: true,
  viewerBackgroundColor: "#f8f8f8",
  requireLoginToOrder: false,
  allowGuestQuote: true,
  autoSendQuoteEmail: true,
  quoteValidityDays: 30,
  availableMaterials: ["MDF", "AGGLOMERE", "CONTREPLAQUE", "BOIS_MASSIF", "ALUMINUM"],
  availableFinishes: ["MAT", "GLOSS", "LAQUE", "MELAMINE", "PLACAGE"],
  availableColors: ["BLANC", "GRIS", "NOIR", "WENGE", "CHENE", "NOYER"],
};

const ALL_MATERIALS = ["MDF", "AGGLOMERE", "CONTREPLAQUE", "BOIS_MASSIF", "ALUMINUM", "INOX", "VERRE"];
const ALL_FINISHES  = ["MAT", "GLOSS", "LAQUE", "MELAMINE", "PLACAGE", "VERNIS", "PATINE"];
const ALL_COLORS    = ["BLANC", "GRIS", "NOIR", "WENGE", "CHENE", "NOYER", "ACAJOU", "BLANC_CASSE", "ANTHRACITE"];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex w-12 h-6 rounded-full transition-all duration-300 focus:outline-none",
        value ? "bg-brand-red shadow-lg shadow-brand-red/20" : "bg-neutral-200"
      )}
    >
      <span className={cn(
        "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300",
        value ? "left-6" : "left-0.5"
      )} />
    </button>
  );
}

function NumberField({ label, value, onChange, min, max, step = 1, unit = "mm" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
          autoComplete="off"
          className="flex-1 h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all"
        />
        {unit && <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[2rem] border border-neutral-200/60 overflow-hidden shadow-sm">
      <div className="px-8 py-6 border-b border-neutral-100 flex items-center gap-4 bg-neutral-50/30">
        <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-neutral-600" />
        </div>
        <h2 className="font-black text-neutral-900 uppercase tracking-widest text-sm">{title}</h2>
      </div>
      <div className="p-8 space-y-6">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-6 py-2">
      <div className="space-y-0.5 flex-1">
        <p className="text-sm font-black text-neutral-900 uppercase tracking-tight">{label}</p>
        {desc && <p className="text-[11px] font-bold text-neutral-400">{desc}</p>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

export function ConfiguratorSettingsClient() {
  const [config, setConfig] = useState<Config>({ ...DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [dirty, setDirty] = useState(false);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/configurator-settings");
      const data = await res.json();
      setConfig(data.config);
    } catch { showToast("Erreur de chargement", "err"); }
    setLoading(false);
    setDirty(false);
  };

  useEffect(() => { fetchConfig(); }, []);

  const set = (key: string, value: any) => {
    setConfig(c => ({ ...c, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/configurator-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || "Erreur", "err");
      setConfig(data.config);
      setDirty(false);
      showToast("Configuration sauvegardée ✓");
    } catch { showToast("Erreur réseau", "err"); }
    setSaving(false);
  };

  const resetToDefaults = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/configurator-settings", { method: "DELETE" });
      const data = await res.json();
      setConfig(data.config);
      setDirty(false);
      showToast("Réinitialisation effectuée");
    } catch { showToast("Erreur", "err"); }
    setSaving(false);
  };

  const toggleArrayItem = (key: string, item: string) => {
    const arr: string[] = config[key] || [];
    const next = arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    set(key, next);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-[2rem] bg-neutral-50 flex items-center justify-center animate-pulse">
            <Settings2 className="w-8 h-8 text-neutral-200" />
          </div>
          <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Chargement de la configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-8 right-8 z-[200] text-white text-sm px-6 py-4 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-right-8 duration-300 flex items-center gap-3",
          toast.type === "ok" ? "bg-neutral-900 border-white/5" : "bg-red-600 border-red-500"
        )}>
          {toast.type === "ok" ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight uppercase">Configurateur</h1>
          <div className="flex items-center gap-3">
            <span className={cn(
              "flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold border",
              config.configuratorEnabled
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-neutral-100 text-neutral-500 border-neutral-200"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", config.configuratorEnabled ? "bg-emerald-500 animate-pulse" : "bg-neutral-400")} />
              {config.configuratorEnabled ? "CONFIGURATEUR ACTIF" : "CONFIGURATEUR DÉSACTIVÉ"}
            </span>
            {dirty && (
              <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold border border-amber-100">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> MODIFICATIONS NON SAUVEGARDÉES
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetToDefaults} disabled={saving} className="h-11 px-5 rounded-xl border-neutral-200 gap-2 font-bold text-xs uppercase tracking-wider">
            <RefreshCw className="w-4 h-4" /> Réinitialiser
          </Button>
          <Button onClick={save} disabled={saving || !dirty} className={cn(
            "h-11 px-6 rounded-xl gap-2 font-bold text-xs uppercase tracking-wider transition-all",
            dirty
              ? "bg-brand-red hover:bg-brand-red2 text-white shadow-lg shadow-brand-red/20"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          )}>
            <Save className="w-4 h-4" />
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>

      {/* Master Toggle */}
      <div className={cn("rounded-[2rem] border p-8 transition-all", config.configuratorEnabled ? "bg-white border-emerald-200/60 shadow-sm" : "bg-neutral-100 border-neutral-200")}>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={cn("w-14 h-14 rounded-[1.5rem] flex items-center justify-center", config.configuratorEnabled ? "bg-emerald-50 text-emerald-500" : "bg-neutral-200 text-neutral-400")}>
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Configurateur Principal</h3>
              <p className="text-neutral-400 text-sm font-medium mt-1">
                {config.configuratorEnabled ? "Les clients peuvent configurer leurs meubles en ligne" : "Le configurateur est masqué pour les clients"}
              </p>
            </div>
          </div>
          <Toggle value={config.configuratorEnabled} onChange={v => set("configuratorEnabled", v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* General Info */}
        <Section icon={Settings2} title="Textes & Affichage">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Titre du configurateur</label>
              <input
                type="text"
                value={config.configuratorTitle}
                onChange={e => set("configuratorTitle", e.target.value)}
                autoComplete="off"
                className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Sous-titre</label>
              <textarea
                value={config.configuratorSubtitle}
                onChange={e => set("configuratorSubtitle", e.target.value)}
                rows={2}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all resize-none"
              />
            </div>
          </div>
        </Section>

        {/* Steps */}
        <Section icon={Sliders} title="Étapes du Configurateur">
          <div className="space-y-4 divide-y divide-neutral-50">
            <ToggleRow label="Matériaux" desc="Sélection du matériau principal" value={config.showStepMaterial} onChange={v => set("showStepMaterial", v)} />
            <ToggleRow label="Dimensions" desc="Largeur, Hauteur, Profondeur" value={config.showStepDimensions} onChange={v => set("showStepDimensions", v)} />
            <ToggleRow label="Couleur" desc="Choix de la couleur principale" value={config.showStepColor} onChange={v => set("showStepColor", v)} />
            <ToggleRow label="Finition" desc="Type de finition de surface" value={config.showStepFinish} onChange={v => set("showStepFinish", v)} />
            <ToggleRow label="Accessoires" desc="Poignées, charnières, tiroirs, etc." value={config.showStepAccessories} onChange={v => set("showStepAccessories", v)} />
          </div>
        </Section>

        {/* Dimensions */}
        <Section icon={Ruler} title="Limites de Dimensions">
          <div className="grid grid-cols-3 gap-4">
            <NumberField label="Largeur min" value={config.minWidth} onChange={(v: number) => set("minWidth", v)} min={50} max={config.maxWidth} />
            <NumberField label="Largeur défaut" value={config.defaultWidth} onChange={(v: number) => set("defaultWidth", v)} min={config.minWidth} max={config.maxWidth} />
            <NumberField label="Largeur max" value={config.maxWidth} onChange={(v: number) => set("maxWidth", v)} min={config.defaultWidth} max={5000} />

            <NumberField label="Hauteur min" value={config.minHeight} onChange={(v: number) => set("minHeight", v)} min={50} max={config.maxHeight} />
            <NumberField label="Hauteur défaut" value={config.defaultHeight} onChange={(v: number) => set("defaultHeight", v)} min={config.minHeight} max={config.maxHeight} />
            <NumberField label="Hauteur max" value={config.maxHeight} onChange={(v: number) => set("maxHeight", v)} min={config.defaultHeight} max={5000} />

            <NumberField label="Profondeur min" value={config.minDepth} onChange={(v: number) => set("minDepth", v)} min={50} max={config.maxDepth} />
            <NumberField label="Profondeur défaut" value={config.defaultDepth} onChange={(v: number) => set("defaultDepth", v)} min={config.minDepth} max={config.maxDepth} />
            <NumberField label="Profondeur max" value={config.maxDepth} onChange={(v: number) => set("maxDepth", v)} min={config.defaultDepth} max={2000} />
          </div>
        </Section>

        {/* Pricing */}
        <Section icon={Zap} title="Tarification Dynamique">
          <ToggleRow label="Tarification dynamique" desc="Le prix varie selon les dimensions et matériaux choisis" value={config.enableDynamicPricing} onChange={v => set("enableDynamicPricing", v)} />
          <div className="pt-4 grid grid-cols-3 gap-4">
            <NumberField label="Multiplicateur de base" value={config.basePriceMultiplier} onChange={(v: number) => set("basePriceMultiplier", v)} step={0.05} unit="×" />
            <NumberField label="Urgence (rush)" value={config.rushOrderMultiplier} onChange={(v: number) => set("rushOrderMultiplier", v)} step={0.05} unit="×" />
            <NumberField label="Remise Pro" value={config.proDiscountPercent} onChange={(v: number) => set("proDiscountPercent", v)} min={0} max={50} unit="%" />
          </div>
        </Section>

        {/* Lead Times */}
        <Section icon={Clock} title="Délais de Fabrication">
          <ToggleRow label="Option fabrication express" desc="Permet aux clients de sélectionner un délai réduit (avec surcoût)" value={config.rushOptionEnabled} onChange={v => set("rushOptionEnabled", v)} />
          <div className="pt-4 grid grid-cols-2 gap-4">
            <NumberField label="Délai standard" value={config.standardLeadTimeDays} onChange={(v: number) => set("standardLeadTimeDays", v)} min={1} max={120} unit="jours" />
            <NumberField label="Délai express" value={config.rushLeadTimeDays} onChange={(v: number) => set("rushLeadTimeDays", v)} min={1} max={config.standardLeadTimeDays} unit="jours" />
          </div>
        </Section>

        {/* 3D Viewer */}
        <Section icon={Eye} title="Visionneuse 3D">
          <ToggleRow label="Activer la visionneuse 3D" desc="Aperçu en temps réel du meuble configuré" value={config.viewer3DEnabled} onChange={v => set("viewer3DEnabled", v)} />
          <div className="pt-4 space-y-4">
            <ToggleRow label="Rotation automatique" desc="Le modèle tourne automatiquement à l'ouverture" value={config.viewerDefaultRotation} onChange={v => set("viewerDefaultRotation", v)} />
            <ToggleRow label="Afficher les dimensions" desc="Cotations visibles dans la visionneuse" value={config.viewerShowDimensions} onChange={v => set("viewerShowDimensions", v)} />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Couleur de fond de la visionneuse</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={config.viewerBackgroundColor}
                  onChange={e => set("viewerBackgroundColor", e.target.value)}
                  className="w-14 h-10 rounded-xl border border-neutral-200 cursor-pointer overflow-hidden"
                />
                <span className="text-sm font-black text-neutral-600 font-mono tracking-widest">{config.viewerBackgroundColor}</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Order & Quote */}
        <Section icon={ShoppingCart} title="Commande & Devis">
          <div className="space-y-4 divide-y divide-neutral-50">
            <ToggleRow label="Connexion requise pour commander" desc="Les invités peuvent consulter mais doivent se connecter pour commander" value={config.requireLoginToOrder} onChange={v => set("requireLoginToOrder", v)} />
            <ToggleRow label="Devis invité autorisé" desc="Les visiteurs non connectés peuvent générer un devis PDF" value={config.allowGuestQuote} onChange={v => set("allowGuestQuote", v)} />
            <ToggleRow label="Envoi automatique par email" desc="Envoie le devis par email dès sa génération" value={config.autoSendQuoteEmail} onChange={v => set("autoSendQuoteEmail", v)} />
          </div>
          <div className="pt-4">
            <NumberField label="Validité du devis" value={config.quoteValidityDays} onChange={(v: number) => set("quoteValidityDays", v)} min={1} max={365} unit="jours" />
          </div>
        </Section>
      </div>

      {/* Materials, Finishes, Colors — Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Materials */}
        <div className="bg-white rounded-[2rem] border border-neutral-200/60 overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-neutral-100 flex items-center gap-4 bg-neutral-50/30">
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-neutral-600" />
            </div>
            <h2 className="font-black text-neutral-900 uppercase tracking-widest text-sm">Matériaux Disponibles</h2>
          </div>
          <div className="p-6 space-y-2">
            {ALL_MATERIALS.map(m => {
              const active = (config.availableMaterials || []).includes(m);
              return (
                <button
                  key={m}
                  onClick={() => toggleArrayItem("availableMaterials", m)}
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest",
                    active ? "bg-neutral-900 text-white border-neutral-900 shadow-lg" : "bg-neutral-50 text-neutral-400 border-neutral-100 hover:border-neutral-200"
                  )}
                >
                  {m}
                  <div className={cn("w-5 h-5 rounded-lg flex items-center justify-center", active ? "bg-white/20" : "bg-neutral-200")}>
                    {active ? <Check className="w-3 h-3 text-white" /> : <X className="w-3 h-3 text-neutral-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Finishes */}
        <div className="bg-white rounded-[2rem] border border-neutral-200/60 overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-neutral-100 flex items-center gap-4 bg-neutral-50/30">
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
              <Sliders className="w-5 h-5 text-neutral-600" />
            </div>
            <h2 className="font-black text-neutral-900 uppercase tracking-widest text-sm">Finitions Disponibles</h2>
          </div>
          <div className="p-6 space-y-2">
            {ALL_FINISHES.map(f => {
              const active = (config.availableFinishes || []).includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleArrayItem("availableFinishes", f)}
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest",
                    active ? "bg-neutral-900 text-white border-neutral-900 shadow-lg" : "bg-neutral-50 text-neutral-400 border-neutral-100 hover:border-neutral-200"
                  )}
                >
                  {f}
                  <div className={cn("w-5 h-5 rounded-lg flex items-center justify-center", active ? "bg-white/20" : "bg-neutral-200")}>
                    {active ? <Check className="w-3 h-3 text-white" /> : <X className="w-3 h-3 text-neutral-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-[2rem] border border-neutral-200/60 overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-neutral-100 flex items-center gap-4 bg-neutral-50/30">
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
              <Palette className="w-5 h-5 text-neutral-600" />
            </div>
            <h2 className="font-black text-neutral-900 uppercase tracking-widest text-sm">Couleurs Disponibles</h2>
          </div>
          <div className="p-6 space-y-2">
            {ALL_COLORS.map(c => {
              const active = (config.availableColors || []).includes(c);
              const colorMap: Record<string, string> = {
                BLANC: "#f9f9f9", GRIS: "#9ca3af", NOIR: "#111827", WENGE: "#3d2314",
                CHENE: "#c8a97e", NOYER: "#7c4a2d", ACAJOU: "#4a1728", BLANC_CASSE: "#f3efe7", ANTHRACITE: "#374151",
              };
              return (
                <button
                  key={c}
                  onClick={() => toggleArrayItem("availableColors", c)}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl border transition-all",
                    active ? "bg-neutral-900 text-white border-neutral-900 shadow-lg" : "bg-neutral-50 text-neutral-400 border-neutral-100 hover:border-neutral-200"
                  )}
                >
                  <div className="w-6 h-6 rounded-lg border border-black/10 shadow-sm" style={{ background: colorMap[c] || "#999" }} />
                  <span className="font-black text-xs uppercase tracking-widest flex-1 text-left">{c}</span>
                  <div className={cn("w-5 h-5 rounded-lg flex items-center justify-center", active ? "bg-white/20" : "bg-neutral-200")}>
                    {active ? <Check className="w-3 h-3 text-white" /> : <X className="w-3 h-3 text-neutral-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Save Footer */}
      {dirty && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-neutral-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl border border-white/5 flex items-center gap-6">
            <p className="text-sm font-bold">Modifications non sauvegardées</p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={fetchConfig} className="h-10 px-5 rounded-xl text-neutral-400 hover:text-white font-bold text-xs uppercase tracking-wider">
                Annuler
              </Button>
              <Button onClick={save} disabled={saving} className="h-10 px-6 rounded-xl bg-brand-red hover:bg-brand-red2 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-red/30">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Sauvegarde..." : "Sauvegarder maintenant"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
