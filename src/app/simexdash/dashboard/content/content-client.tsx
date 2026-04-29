"use client";

import { useState } from "react";
import {
  MessageSquare, HelpCircle, Radio, Video, Zap, ShoppingBag,
  Plus, Trash2, Pencil, Check, X, ChevronUp, ChevronDown, Star,
  Save, Flag, Briefcase, Target, Wrench, Shield, Mail, Phone, Globe, Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string; name: string; city: string; initials: string; color: string;
  rating: number; product: string; body: string; date: string;
  verified: boolean; isActive: boolean; order: number; createdAt: string;
}
interface FaqItem { id: string; question: string; answer: string; order: number; isActive: boolean; }
interface TickerEvent { id: string; icon: string; message: string; time: string; isActive: boolean; order: number; }
interface VideoItem { id: string; title: string; duration: string; thumbUrl: string; videoUrl: string; order: number; isActive: boolean; }
interface Product { id: string; name: string; sku: string | null; price: number; comparePrice: number | null; image: string; }
interface Props {
  testimonials: Testimonial[];
  faqItems: FaqItem[];
  tickerEvents: TickerEvent[];
  videoItems: VideoItem[];
  products: Product[];
  siteContent: Record<string, any>;
}

const TABS = [
  { id: "ticker",       label: "Ticker Live",     icon: Radio },
  { id: "testimonials", label: "Témoignages",      icon: MessageSquare },
  { id: "faq",          label: "FAQ",              icon: HelpCircle },
  { id: "videos",       label: "Vidéos Tutos",     icon: Video },
  { id: "happy_hour",   label: "Happy Hour",       icon: Zap },
  { id: "daily_deal",   label: "Deal du Jour",     icon: ShoppingBag },
  { id: "black_friday", label: "Black Friday",     icon: Flag },
  { id: "pro_banner",   label: "Espace Pro",       icon: Briefcase },
  { id: "mission",      label: "Notre Mission",    icon: Target },
  { id: "builder",      label: "Configurateur",    icon: Wrench },
  { id: "trust_bar",    label: "Barre Confiance",  icon: Shield },
  { id: "newsletter",   label: "Newsletter",       icon: Mail },
  { id: "contact",      label: "Contact & Footer", icon: Phone },
  { id: "header_nav",   label: "Navigation",       icon: Globe },
] as const;

type TabId = (typeof TABS)[number]["id"];

const AVATAR_COLORS = [
  "from-blue-600 to-blue-400", "from-emerald-600 to-teal-400",
  "from-purple-600 to-violet-400", "from-amber-500 to-orange-400",
  "from-rose-600 to-pink-400", "from-cyan-600 to-sky-400",
];

// ─── Main component ────────────────────────────────────────────────────────────

export function ContentClient({ testimonials: init_t, faqItems: init_f, tickerEvents: init_e, videoItems: init_v, products, siteContent: initSite }: Props) {
  const [tab, setTab] = useState<TabId>("ticker");

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-brand-black mb-1">Contenu de la boutique</h1>
      <p className="text-sm text-neutral-500 mb-6">Gérez les sections dynamiques affichées sur le site</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              tab === id
                ? "bg-brand-red text-white shadow-md"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-brand-red/40 hover:text-brand-red"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "ticker"       && <TickerTab init={init_e} />}
      {tab === "testimonials" && <TestimonialsTab init={init_t} />}
      {tab === "faq"          && <FaqTab init={init_f} />}
      {tab === "videos"       && <VideosTab init={init_v} />}
      {tab === "happy_hour"   && <HappyHourTab init={initSite["happy_hour"] ?? {}} />}
      {tab === "daily_deal"   && <DailyDealTab products={products} init={initSite["daily_deal"] ?? {}} />}
      {tab === "black_friday" && <BlackFridayTab init={initSite["black_friday"] ?? {}} />}
      {tab === "pro_banner"   && <ProBannerTab init={initSite["pro_banner"] ?? {}} />}
      {tab === "mission"      && <MissionTab init={initSite["mission"] ?? {}} />}
      {tab === "builder"      && <BuilderTab init={initSite["builder"] ?? {}} />}
      {tab === "trust_bar"    && <TrustBarTab init={initSite["trust_bar"] ?? {}} />}
      {tab === "newsletter"   && <NewsletterTab init={initSite["newsletter"] ?? {}} />}
      {tab === "contact"      && <ContactTab init={initSite["contact"] ?? {}} />}
      {tab === "header_nav"   && <HeaderNavTab init={initSite["header_nav"] ?? {}} />}
    </div>
  );
}

// ─── Ticker Tab ────────────────────────────────────────────────────────────────

function TickerTab({ init }: { init: TickerEvent[] }) {
  const [items, setItems] = useState(init);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const EMPTY = { id: "", icon: "🛒", message: "", time: "", isActive: true, order: 0 };
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const save = async () => {
    setSaving(true);
    try {
      if (editId) {
        const r = await fetch("/api/admin/ticker-events", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...form }) });
        const updated = await r.json();
        setItems((prev) => prev.map((x) => (x.id === editId ? updated : x)));
      } else {
        const r = await fetch("/api/admin/ticker-events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: items.length }) });
        const created = await r.json();
        setItems((prev) => [...prev, created]);
      }
      setForm(EMPTY);
      setEditId(null);
      showToast("✓ Sauvegardé");
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    await fetch("/api/admin/ticker-events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const toggle = async (item: TickerEvent) => {
    const r = await fetch("/api/admin/ticker-events", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, isActive: !item.isActive }) });
    const updated = await r.json();
    setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
  };

  const edit = (item: TickerEvent) => { setForm({ ...item }); setEditId(item.id); };
  const cancel = () => { setForm(EMPTY); setEditId(null); };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50">{toast}</div>}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5">
        <h3 className="font-bold text-brand-black mb-4">{editId ? "Modifier l'événement" : "Nouvel événement"}</h3>
        <div className="grid grid-cols-[80px_1fr_150px] gap-3">
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Icône</label>
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-center text-lg" maxLength={4} />
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Message *</label>
            <input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Ex: Ahmed B. vient d'acheter..." className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Temps (optionnel)</label>
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="il y a 2 min" className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={save} disabled={!form.message || saving} className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
            {saving ? "..." : <><Check className="w-4 h-4" />{editId ? "Mettre à jour" : "Ajouter"}</>}
          </button>
          {editId && <button onClick={cancel} className="flex items-center gap-2 border border-neutral-200 px-4 py-2 rounded-xl text-sm"><X className="w-4 h-4" />Annuler</button>}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className={cn("bg-white rounded-xl border p-3 flex items-center gap-3", !item.isActive && "opacity-50")}>
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-brand-black truncate">{item.message}</p>
              {item.time && <p className="text-xs text-neutral-400">{item.time}</p>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toggle(item)} title={item.isActive ? "Désactiver" : "Activer"} className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", item.isActive ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200")}>
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => edit(item)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => del(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-neutral-400 text-center py-8">Aucun événement. Ajoutez-en un ci-dessus.</p>}
      </div>
    </div>
  );
}

// ─── Testimonials Tab ──────────────────────────────────────────────────────────

const EMPTY_TESTIMONIAL = {
  id: "", name: "", city: "", initials: "", color: "from-blue-600 to-blue-400",
  rating: 5, product: "", body: "", date: "", verified: true, isActive: true, order: 0, createdAt: "",
};

function TestimonialsTab({ init }: { init: Testimonial[] }) {
  const [items, setItems] = useState(init);
  const [form, setForm] = useState(EMPTY_TESTIMONIAL);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const save = async () => {
    setSaving(true);
    try {
      if (editId) {
        const r = await fetch("/api/admin/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...form }) });
        const updated = await r.json();
        setItems((prev) => prev.map((x) => (x.id === editId ? updated : x)));
      } else {
        const r = await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: items.length }) });
        const created = await r.json();
        setItems((prev) => [...prev, created]);
      }
      setForm({ ...EMPTY_TESTIMONIAL });
      setEditId(null);
      showToast("✓ Sauvegardé");
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    await fetch("/api/admin/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const toggle = async (item: Testimonial) => {
    const r = await fetch("/api/admin/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, isActive: !item.isActive }) });
    const updated = await r.json();
    setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
  };

  const edit = (item: Testimonial) => { setForm({ ...item }); setEditId(item.id); };
  const cancel = () => { setForm({ ...EMPTY_TESTIMONIAL }); setEditId(null); };

  const autoInitials = (name: string) =>
    name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50">{toast}</div>}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5">
        <h3 className="font-bold text-brand-black mb-4">{editId ? "Modifier l'avis" : "Nouvel avis"}</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Nom *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, initials: autoInitials(e.target.value) })} placeholder="Ahmed Benali" className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Ville</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Tunis" className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Produit acheté</label>
            <input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} placeholder="Charnières soft-close 110°" className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Date (texte)</label>
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Mars 2026" className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs text-neutral-500 mb-1 block">Avis *</label>
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} placeholder="Qualité impeccable..." className="w-full border rounded-xl px-3 py-2 text-sm resize-none" />
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Note</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((s) => (
                <button key={s} onClick={() => setForm({ ...form, rating: s })} className={cn("w-7 h-7 rounded-full flex items-center justify-center transition-colors", s <= form.rating ? "bg-amber-400 text-white" : "bg-neutral-100 text-neutral-400 hover:bg-amber-100")}>
                  <Star className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Couleur avatar</label>
            <div className="flex gap-1.5">
              {AVATAR_COLORS.map((c) => (
                <button key={c} onClick={() => setForm({ ...form, color: c })} className={cn("w-6 h-6 rounded-full bg-gradient-to-br ring-2 transition-all", c, form.color === c ? "ring-brand-red ring-offset-1" : "ring-transparent hover:ring-neutral-300")} />
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none mt-4">
            <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} className="rounded" />
            Vérifié
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={save} disabled={!form.name || !form.body || saving} className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
            {saving ? "..." : <><Check className="w-4 h-4" />{editId ? "Mettre à jour" : "Ajouter"}</>}
          </button>
          {editId && <button onClick={cancel} className="flex items-center gap-2 border border-neutral-200 px-4 py-2 rounded-xl text-sm"><X className="w-4 h-4" />Annuler</button>}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className={cn("bg-white rounded-2xl border p-4 flex flex-col gap-2", !item.isActive && "opacity-50")}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br text-white text-xs font-bold flex items-center justify-center shrink-0", item.color)}>{item.initials || item.name.slice(0,2)}</div>
                <div>
                  <p className="text-sm font-bold text-brand-black">{item.name}</p>
                  <p className="text-xs text-neutral-400">{item.city} · {item.date}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {[1,2,3,4,5].map((s) => <Star key={s} className={cn("w-3 h-3", s <= item.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200")} />)}
              </div>
            </div>
            <p className="text-xs text-neutral-600 line-clamp-2">"{item.body}"</p>
            {item.product && <span className="text-[11px] text-brand-red bg-brand-red/8 rounded-full px-2 py-0.5 self-start">{item.product}</span>}
            <div className="flex gap-1 mt-1">
              <button onClick={() => toggle(item)} className={cn("flex-1 h-7 rounded-lg text-xs font-semibold transition-colors", item.isActive ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200")}>
                {item.isActive ? "Actif" : "Inactif"}
              </button>
              <button onClick={() => edit(item)} className="h-7 w-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"><Pencil className="w-3 h-3" /></button>
              <button onClick={() => del(item.id)} className="h-7 w-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-2 text-sm text-neutral-400 text-center py-8">Aucun témoignage. Ajoutez-en un ci-dessus.</p>}
      </div>
    </div>
  );
}

// ─── FAQ Tab ───────────────────────────────────────────────────────────────────

function FaqTab({ init }: { init: FaqItem[] }) {
  const [items, setItems] = useState(init);
  const [form, setForm] = useState({ id: "", question: "", answer: "", order: 0, isActive: true });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const save = async () => {
    setSaving(true);
    try {
      if (editId) {
        const r = await fetch("/api/admin/faq-items", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...form }) });
        const updated = await r.json();
        setItems((prev) => prev.map((x) => (x.id === editId ? updated : x)));
      } else {
        const r = await fetch("/api/admin/faq-items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: items.length }) });
        const created = await r.json();
        setItems((prev) => [...prev, created]);
      }
      setForm({ id: "", question: "", answer: "", order: 0, isActive: true });
      setEditId(null);
      showToast("✓ Sauvegardé");
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    await fetch("/api/admin/faq-items", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const toggle = async (item: FaqItem) => {
    const r = await fetch("/api/admin/faq-items", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, isActive: !item.isActive }) });
    const updated = await r.json();
    setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
  };

  const edit = (item: FaqItem) => { setForm({ ...item }); setEditId(item.id); };
  const cancel = () => { setForm({ id: "", question: "", answer: "", order: 0, isActive: true }); setEditId(null); };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-5">
        <h3 className="font-bold text-brand-black mb-4">{editId ? "Modifier la question" : "Nouvelle question"}</h3>
        <div className="space-y-3 mb-3">
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Question *</label>
            <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Quel est votre délai de livraison ?" className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Réponse *</label>
            <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} placeholder="Nous livrons en 24h à Tunis..." className="w-full border rounded-xl px-3 py-2 text-sm resize-none" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={save} disabled={!form.question || !form.answer || saving} className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
            {saving ? "..." : <><Check className="w-4 h-4" />{editId ? "Mettre à jour" : "Ajouter"}</>}
          </button>
          {editId && <button onClick={cancel} className="flex items-center gap-2 border border-neutral-200 px-4 py-2 rounded-xl text-sm"><X className="w-4 h-4" />Annuler</button>}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id} className={cn("bg-white rounded-xl border p-4", !item.isActive && "opacity-50")}>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-black">{item.question}</p>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.answer}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggle(item)} className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors", item.isActive ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200")}>
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => edit(item)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => del(item.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-neutral-400 text-center py-8">Aucune question. Ajoutez-en une ci-dessus.</p>}
      </div>
    </div>
  );
}

// ─── Videos Tab ────────────────────────────────────────────────────────────────

function VideosTab({ init }: { init: VideoItem[] }) {
  const [items, setItems] = useState(init);
  const EMPTY = { id: "", title: "", duration: "", thumbUrl: "", videoUrl: "", order: 0, isActive: true };
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const save = async () => {
    setSaving(true);
    try {
      if (editId) {
        const r = await fetch("/api/admin/video-items", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...form }) });
        const updated = await r.json();
        setItems((prev) => prev.map((x) => (x.id === editId ? updated : x)));
      } else {
        const r = await fetch("/api/admin/video-items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: items.length }) });
        const created = await r.json();
        setItems((prev) => [...prev, created]);
      }
      setForm(EMPTY);
      setEditId(null);
      showToast("✓ Sauvegardé");
    } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    await fetch("/api/admin/video-items", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const toggle = async (item: VideoItem) => {
    const r = await fetch("/api/admin/video-items", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, isActive: !item.isActive }) });
    const updated = await r.json();
    setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
  };

  const edit = (item: VideoItem) => { setForm({ ...item }); setEditId(item.id); };
  const cancel = () => { setForm(EMPTY); setEditId(null); };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-5">
        <h3 className="font-bold text-brand-black mb-4">{editId ? "Modifier la vidéo" : "Nouvelle vidéo tutoriel"}</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2">
            <label className="text-xs text-neutral-500 mb-1 block">Titre *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Installer une charnière clip-on" className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Durée</label>
            <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3:42" className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 mb-1 block">URL miniature</label>
            <input value={form.thumbUrl} onChange={(e) => setForm({ ...form, thumbUrl: e.target.value })} placeholder="https://..." className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-neutral-500 mb-1 block">URL vidéo (YouTube embed ou fichier)</label>
            <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/embed/..." className="w-full border rounded-xl px-3 py-2 text-sm" />
          </div>
        </div>
        {form.thumbUrl && (
          <div className="mb-3">
            <img src={form.thumbUrl} alt="preview" className="h-24 rounded-xl object-cover" />
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={save} disabled={!form.title || saving} className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
            {saving ? "..." : <><Check className="w-4 h-4" />{editId ? "Mettre à jour" : "Ajouter"}</>}
          </button>
          {editId && <button onClick={cancel} className="flex items-center gap-2 border border-neutral-200 px-4 py-2 rounded-xl text-sm"><X className="w-4 h-4" />Annuler</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.id} className={cn("bg-white rounded-2xl border overflow-hidden", !item.isActive && "opacity-50")}>
            {item.thumbUrl && <img src={item.thumbUrl} alt={item.title} className="w-full h-32 object-cover" />}
            <div className="p-3">
              <p className="text-sm font-semibold text-brand-black line-clamp-2">{item.title}</p>
              {item.duration && <p className="text-xs text-neutral-400 mt-0.5">{item.duration}</p>}
              <div className="flex gap-1 mt-2">
                <button onClick={() => toggle(item)} className={cn("flex-1 h-7 rounded-lg text-xs font-semibold transition-colors", item.isActive ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200")}>{item.isActive ? "Actif" : "Inactif"}</button>
                <button onClick={() => edit(item)} className="h-7 w-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => del(item.id)} className="h-7 w-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-3 text-sm text-neutral-400 text-center py-8">Aucune vidéo. Ajoutez-en une ci-dessus.</p>}
      </div>
    </div>
  );
}

// ─── Happy Hour Tab ────────────────────────────────────────────────────────────

function HappyHourTab({ init }: { init: Record<string, any> }) {
  const [form, setForm] = useState({
    title:   init.title   ?? "",
    subtitle: init.subtitle ?? "",
    ctaText: init.ctaText ?? "",
    ctaLink: init.ctaLink ?? "/products?promo=1",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "happy_hour", value: JSON.stringify(form) }),
      });
      setToast("✓ Sauvegardé — rechargez la page d'accueil pour voir les changements");
      setTimeout(() => setToast(""), 4000);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 max-w-xs">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <p className="text-xs text-neutral-400 mb-5">Laissez un champ vide pour utiliser la valeur par défaut (i18n)</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Titre (bandeau rouge)</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: HAPPY HOUR · -30% sur tout" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Sous-titre</label>
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Ex: Profitez avant minuit !" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Texte du bouton</label>
            <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="Ex: Profiter →" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Lien du bouton</label>
            <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} placeholder="/products?promo=1" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>
        <button onClick={save} disabled={saving} className="mt-5 flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}

// ─── Daily Deal Tab ────────────────────────────────────────────────────────────

function DailyDealTab({ products, init }: { products: Product[]; init: Record<string, any> }) {
  const [form, setForm] = useState({
    productId:  init.productId  ?? "",
    dealPrice:  init.dealPrice  ?? "",
    totalStock: init.totalStock ?? 100,
    sold:       init.sold       ?? 53,
    category:   init.category   ?? "",
    rating:     init.rating     ?? 4.9,
    features:   (init.features ?? []).join("\n"),
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const selectedProduct = products.find((p) => p.id === form.productId);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        dealPrice: form.dealPrice ? Number(form.dealPrice) : undefined,
        totalStock: Number(form.totalStock),
        sold: Number(form.sold),
        rating: Number(form.rating),
        features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "daily_deal", value: JSON.stringify(payload) }),
      });
      setToast("✓ Sauvegardé — rechargez la page d'accueil");
      setTimeout(() => setToast(""), 4000);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 max-w-xs">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Produit *</label>
            <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white">
              <option value="">— Utiliser le produit par défaut —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}{p.sku ? ` (${p.sku})` : ""} — {p.price.toFixed(2)} DT</option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="flex items-center gap-3 bg-brand-cream rounded-xl p-3">
              {selectedProduct.image && <img src={selectedProduct.image} alt={selectedProduct.name} className="w-12 h-12 rounded-lg object-cover" />}
              <div>
                <p className="text-sm font-semibold text-brand-black">{selectedProduct.name}</p>
                <p className="text-xs text-neutral-500">
                  Prix catalogue: {selectedProduct.price.toFixed(2)} DT
                  {selectedProduct.comparePrice && ` · Comparatif: ${selectedProduct.comparePrice.toFixed(2)} DT`}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1 block">Prix deal (remplace le prix catalogue)</label>
              <input type="number" value={form.dealPrice} onChange={(e) => setForm({ ...form, dealPrice: e.target.value })} placeholder={selectedProduct ? String(selectedProduct.price) : "19.90"} step="0.01" min="0" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1 block">Catégorie (texte affiché)</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Glissières premium" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1 block">Stock total</label>
              <input type="number" value={form.totalStock} onChange={(e) => setForm({ ...form, totalStock: Number(e.target.value) })} min="1" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1 block">Déjà vendus</label>
              <input type="number" value={form.sold} onChange={(e) => setForm({ ...form, sold: Number(e.target.value) })} min="0" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Caractéristiques (une par ligne)</label>
            <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4} placeholder={"Sortie totale 100%\nFermeture amortie\nCharge 35 kg"} className="w-full border rounded-xl px-4 py-2.5 text-sm resize-none" />
          </div>
        </div>
        <button onClick={save} disabled={saving} className="mt-5 flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}

// ─── Black Friday Tab ──────────────────────────────────────────────────────────

const DEFAULT_BF_DEALS = [
  { label: "Charnières", discount: "-40%", emoji: "🔩", bg: "from-red-900 to-red-950", href: "/products?cat=charnieres&promo=bf" },
  { label: "Glissières", discount: "-35%", emoji: "📏", bg: "from-neutral-900 to-neutral-950", href: "/products?cat=glissieres&promo=bf" },
  { label: "Poignées",   discount: "-45%", emoji: "✨", bg: "from-amber-900 to-amber-950",  href: "/products?cat=poignees&promo=bf" },
  { label: "Éclairage LED", discount: "-30%", emoji: "💡", bg: "from-yellow-900 to-yellow-950", href: "/products?cat=led&promo=bf" },
];

function BlackFridayTab({ init }: { init: Record<string, any> }) {
  const [form, setForm] = useState({
    date: init.date ?? "2026-11-27T00:00:00",
    couponCode: init.couponCode ?? "BF2026",
    subtitle: init.subtitle ?? "",
  });
  const [deals, setDeals] = useState<any[]>(init.deals ?? DEFAULT_BF_DEALS);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const EMPTY_DEAL = { label: "", discount: "", emoji: "🔥", bg: "from-red-900 to-red-950", href: "/products" };
  const [dealForm, setDealForm] = useState(EMPTY_DEAL);
  const [editDealIdx, setEditDealIdx] = useState<number | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "black_friday", value: JSON.stringify({ ...form, deals }) }),
      });
      showToast("✓ Sauvegardé — rechargez la page d'accueil");
    } finally { setSaving(false); }
  };

  const addDeal = () => {
    if (!dealForm.label) return;
    if (editDealIdx !== null) {
      setDeals((d) => d.map((x, i) => i === editDealIdx ? { ...dealForm } : x));
      setEditDealIdx(null);
    } else {
      setDeals((d) => [...d, { ...dealForm }]);
    }
    setDealForm(EMPTY_DEAL);
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 max-w-xs">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-brand-black">Paramètres Black Friday</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Date de l'événement</label>
            <input type="datetime-local" value={form.date.replace("T", "T").slice(0,16)} onChange={(e) => setForm({ ...form, date: e.target.value + ":00" })} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Code promo</label>
            <input value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })} placeholder="BF2026" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Sous-titre</label>
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Les meilleures offres de l'année..." className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-bold text-brand-black mb-3">Cartes deals ({deals.length})</h4>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {deals.map((d, i) => (
              <div key={i} className="bg-neutral-900 rounded-xl p-3 text-white text-center relative group">
                <div className="text-2xl mb-1">{d.emoji}</div>
                <p className="text-xs opacity-70">{d.label}</p>
                <p className="font-black text-brand-red">{d.discount}</p>
                <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                  <button onClick={() => { setDealForm({ ...d }); setEditDealIdx(i); }} className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center"><Pencil className="w-3 h-3" /></button>
                  <button onClick={() => setDeals((prev) => prev.filter((_, j) => j !== i))} className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[40px_1fr_80px_120px_1fr] gap-2 bg-neutral-50 rounded-xl p-3">
            <input value={dealForm.emoji} onChange={(e) => setDealForm({ ...dealForm, emoji: e.target.value })} className="border rounded-lg px-2 py-1.5 text-center text-sm" maxLength={4} placeholder="🔥" />
            <input value={dealForm.label} onChange={(e) => setDealForm({ ...dealForm, label: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm" placeholder="Catégorie *" />
            <input value={dealForm.discount} onChange={(e) => setDealForm({ ...dealForm, discount: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm font-mono" placeholder="-40%" />
            <input value={dealForm.href} onChange={(e) => setDealForm({ ...dealForm, href: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm" placeholder="/products?cat=..." />
            <button onClick={addDeal} disabled={!dealForm.label} className="bg-brand-red text-white rounded-lg text-sm font-semibold disabled:opacity-40">
              {editDealIdx !== null ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </div>

        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder tout"}
        </button>
      </div>
    </div>
  );
}

// ─── Pro Banner Tab ────────────────────────────────────────────────────────────

const DEFAULT_PERKS = [
  { icon: "Percent", label: "Remises jusqu'à −25%", sub: "sur toutes les commandes pro" },
  { icon: "Truck",   label: "Livraison prioritaire", sub: "express 24h partout en Tunisie" },
  { icon: "PhoneCall", label: "Conseiller dédié", sub: "disponible 7j/7 par WhatsApp" },
  { icon: "BadgeCheck", label: "Accès catalogue complet", sub: "+5 000 références pro" },
];

const PERK_ICONS = ["Percent", "Truck", "PhoneCall", "BadgeCheck", "Star", "Shield", "Zap", "Globe"];

function ProBannerTab({ init }: { init: Record<string, any> }) {
  const [form, setForm] = useState({
    title: init.title ?? "",
    description: init.description ?? "",
    ctaText: init.ctaText ?? "",
    ctaLink: init.ctaLink ?? "/pro",
    whatsappNumber: init.whatsappNumber ?? "21697730083",
  });
  const [perks, setPerks] = useState<any[]>(init.perks ?? DEFAULT_PERKS);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const EMPTY_PERK = { icon: "BadgeCheck", label: "", sub: "" };
  const [perkForm, setPerkForm] = useState(EMPTY_PERK);
  const [editPerkIdx, setEditPerkIdx] = useState<number | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "pro_banner", value: JSON.stringify({ ...form, perks }) }),
      });
      showToast("✓ Sauvegardé");
    } finally { setSaving(false); }
  };

  const addPerk = () => {
    if (!perkForm.label) return;
    if (editPerkIdx !== null) {
      setPerks((p) => p.map((x, i) => i === editPerkIdx ? { ...perkForm } : x));
      setEditPerkIdx(null);
    } else {
      setPerks((p) => [...p, { ...perkForm }]);
    }
    setPerkForm(EMPTY_PERK);
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 max-w-xs">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-brand-black">Section Espace Pro</h3>
        <p className="text-xs text-neutral-400">Laissez vide pour utiliser les valeurs par défaut</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Titre principal</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Vous êtes pro ?" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Menuisiers, architectes d'intérieur..." className="w-full border rounded-xl px-4 py-2.5 text-sm resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Texte bouton CTA</label>
            <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="Rejoindre l'Espace Pro" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Lien CTA</label>
            <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} placeholder="/pro" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Numéro WhatsApp (sans +)</label>
            <input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="21697730083" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-bold text-brand-black mb-3">Avantages Pro ({perks.length})</h4>
          <div className="space-y-2 mb-3">
            {perks.map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-neutral-50 rounded-xl p-2.5">
                <span className="text-xs font-mono text-neutral-400 w-20 shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.label}</p>
                  <p className="text-xs text-neutral-500 truncate">{p.sub}</p>
                </div>
                <button onClick={() => { setPerkForm({ ...p }); setEditPerkIdx(i); }} className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => setPerks((prev) => prev.filter((_, j) => j !== i))} className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[120px_1fr_1fr_80px] gap-2 bg-neutral-50 rounded-xl p-3">
            <select value={perkForm.icon} onChange={(e) => setPerkForm({ ...perkForm, icon: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm">
              {PERK_ICONS.map((ic) => <option key={ic}>{ic}</option>)}
            </select>
            <input value={perkForm.label} onChange={(e) => setPerkForm({ ...perkForm, label: e.target.value })} placeholder="Avantage *" className="border rounded-lg px-2 py-1.5 text-sm" />
            <input value={perkForm.sub} onChange={(e) => setPerkForm({ ...perkForm, sub: e.target.value })} placeholder="Sous-titre" className="border rounded-lg px-2 py-1.5 text-sm" />
            <button onClick={addPerk} disabled={!perkForm.label} className="bg-brand-red text-white rounded-lg text-sm font-semibold disabled:opacity-40">
              {editPerkIdx !== null ? "OK" : <><Plus className="w-3.5 h-3.5 inline" /></>}
            </button>
          </div>
        </div>

        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder tout"}
        </button>
      </div>
    </div>
  );
}

// ─── Mission Tab ───────────────────────────────────────────────────────────────

const MISSION_ICONS = ["Sparkles", "ShieldCheck", "Palette", "Zap", "Target", "Star", "Globe", "Heart"];

function MissionTab({ init }: { init: Record<string, any> }) {
  const [form, setForm] = useState({
    eyebrow: init.eyebrow ?? "",
    title: init.title ?? "",
    quote: init.quote ?? "",
  });
  const [pillars, setPillars] = useState<any[]>(init.pillars ?? []);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const EMPTY_PILLAR = { icon: "Sparkles", title: "", desc: "" };
  const [pillarForm, setPillarForm] = useState(EMPTY_PILLAR);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "mission", value: JSON.stringify({ ...form, pillars: pillars.length ? pillars : undefined }) }),
      });
      showToast("✓ Sauvegardé");
    } finally { setSaving(false); }
  };

  const addPillar = () => {
    if (!pillarForm.title) return;
    if (editIdx !== null) {
      setPillars((p) => p.map((x, i) => i === editIdx ? { ...pillarForm } : x));
      setEditIdx(null);
    } else {
      setPillars((p) => [...p, { ...pillarForm }]);
    }
    setPillarForm(EMPTY_PILLAR);
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 max-w-xs">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-brand-black">Section Notre Mission</h3>
        <p className="text-xs text-neutral-400">Laissez vide pour utiliser les textes par défaut (i18n)</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Eyebrow (texte rouge au-dessus du titre)</label>
            <input value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} placeholder="Notre raison d'être" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Titre principal</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nous simplifions vos projets" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Citation (encadré en italique)</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} placeholder="Chez SIMEX, nous croyons que..." className="w-full border rounded-xl px-4 py-2.5 text-sm resize-none" />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-bold text-brand-black mb-1">Piliers ({pillars.length}) — 3 recommandés</h4>
          <p className="text-xs text-neutral-400 mb-3">Si vide, les 3 piliers par défaut (i18n) sont utilisés</p>
          <div className="space-y-2 mb-3">
            {pillars.map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-neutral-50 rounded-xl p-2.5">
                <span className="text-xs font-mono text-neutral-400 w-20 shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-neutral-500 truncate">{p.desc}</p>
                </div>
                <button onClick={() => { setPillarForm({ ...p }); setEditIdx(i); }} className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => setPillars((prev) => prev.filter((_, j) => j !== i))} className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[120px_1fr_1fr_80px] gap-2 bg-neutral-50 rounded-xl p-3">
            <select value={pillarForm.icon} onChange={(e) => setPillarForm({ ...pillarForm, icon: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm">
              {MISSION_ICONS.map((ic) => <option key={ic}>{ic}</option>)}
            </select>
            <input value={pillarForm.title} onChange={(e) => setPillarForm({ ...pillarForm, title: e.target.value })} placeholder="Titre *" className="border rounded-lg px-2 py-1.5 text-sm" />
            <input value={pillarForm.desc} onChange={(e) => setPillarForm({ ...pillarForm, desc: e.target.value })} placeholder="Description" className="border rounded-lg px-2 py-1.5 text-sm" />
            <button onClick={addPillar} disabled={!pillarForm.title} className="bg-brand-red text-white rounded-lg text-sm font-semibold disabled:opacity-40">
              {editIdx !== null ? "OK" : <><Plus className="w-3.5 h-3.5 inline" /></>}
            </button>
          </div>
        </div>

        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}

// ─── Builder Tab ───────────────────────────────────────────────────────────────

const BUILDER_ICONS = ["Boxes", "ListChecks", "Percent", "Video", "Zap", "Wrench", "Star", "Globe"];

function BuilderTab({ init }: { init: Record<string, any> }) {
  const [form, setForm] = useState({
    eyebrow: init.eyebrow ?? "",
    title: init.title ?? "",
    desc: init.desc ?? "",
    ctaText: init.ctaText ?? "",
  });
  const [features, setFeatures] = useState<any[]>(init.features ?? []);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const EMPTY_FEAT = { icon: "Boxes", text: "" };
  const [featForm, setFeatForm] = useState(EMPTY_FEAT);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "builder", value: JSON.stringify({ ...form, features: features.length ? features : undefined }) }),
      });
      showToast("✓ Sauvegardé");
    } finally { setSaving(false); }
  };

  const addFeat = () => {
    if (!featForm.text) return;
    if (editIdx !== null) {
      setFeatures((f) => f.map((x, i) => i === editIdx ? { ...featForm } : x));
      setEditIdx(null);
    } else {
      setFeatures((f) => [...f, { ...featForm }]);
    }
    setFeatForm(EMPTY_FEAT);
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 max-w-xs">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-brand-black">Section Configurateur</h3>
        <p className="text-xs text-neutral-400">Laissez vide pour utiliser les textes i18n par défaut</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Eyebrow</label>
            <input value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} placeholder="Outil exclusif" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Titre</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Construisez votre projet" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Description</label>
            <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} placeholder="Notre configurateur intelligent..." className="w-full border rounded-xl px-4 py-2.5 text-sm resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1 block">Texte bouton CTA</label>
            <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="Lancer le configurateur" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-bold text-brand-black mb-1">Fonctionnalités ({features.length})</h4>
          <p className="text-xs text-neutral-400 mb-3">Si vide, les 4 fonctionnalités i18n par défaut sont utilisées</p>
          <div className="space-y-2 mb-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-neutral-50 rounded-xl p-2.5">
                <span className="text-xs font-mono text-neutral-400 w-20 shrink-0">{f.icon}</span>
                <p className="flex-1 text-sm truncate">{f.text}</p>
                <button onClick={() => { setFeatForm({ ...f }); setEditIdx(i); }} className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => setFeatures((prev) => prev.filter((_, j) => j !== i))} className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[120px_1fr_80px] gap-2 bg-neutral-50 rounded-xl p-3">
            <select value={featForm.icon} onChange={(e) => setFeatForm({ ...featForm, icon: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm">
              {BUILDER_ICONS.map((ic) => <option key={ic}>{ic}</option>)}
            </select>
            <input value={featForm.text} onChange={(e) => setFeatForm({ ...featForm, text: e.target.value })} placeholder="Fonctionnalité *" className="border rounded-lg px-2 py-1.5 text-sm" />
            <button onClick={addFeat} disabled={!featForm.text} className="bg-brand-red text-white rounded-lg text-sm font-semibold disabled:opacity-40">
              {editIdx !== null ? "OK" : <><Plus className="w-3.5 h-3.5 inline" /></>}
            </button>
          </div>
        </div>

        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}

// ─── Trust Bar Tab ─────────────────────────────────────────────────────────────

const TRUST_ICONS = ["Truck", "Shield", "Lock", "Headphones", "Star", "Zap", "Globe", "BadgeCheck"];

function TrustBarTab({ init }: { init: Record<string, any> }) {
  const [items, setItems] = useState<any[]>(init.items ?? []);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const EMPTY = { icon: "Truck", title: "", desc: "" };
  const [form, setForm] = useState(EMPTY);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "trust_bar", value: JSON.stringify({ items: items.length ? items : undefined }) }),
      });
      showToast("✓ Sauvegardé");
    } finally { setSaving(false); }
  };

  const add = () => {
    if (!form.title) return;
    if (editIdx !== null) {
      setItems((p) => p.map((x, i) => i === editIdx ? { ...form } : x));
      setEditIdx(null);
    } else {
      setItems((p) => [...p, { ...form }]);
    }
    setForm(EMPTY);
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 max-w-xs">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-brand-black">Barre de confiance (Trust Bar)</h3>
        <p className="text-xs text-neutral-400">Si vide, les 4 éléments i18n par défaut sont utilisés (Livraison / Qualité / Paiement / SAV)</p>

        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-neutral-50 rounded-xl p-2.5">
              <span className="text-xs font-mono text-neutral-400 w-20 shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{item.title}</p>
                <p className="text-xs text-neutral-500 truncate">{item.desc}</p>
              </div>
              <button onClick={() => { setForm({ ...item }); setEditIdx(i); }} className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Pencil className="w-3 h-3" /></button>
              <button onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))} className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-neutral-400 text-center py-4">Aucun élément — les 4 défauts i18n seront utilisés</p>}
        </div>

        <div className="grid grid-cols-[120px_1fr_1fr_80px] gap-2 bg-neutral-50 rounded-xl p-3">
          <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="border rounded-lg px-2 py-1.5 text-sm">
            {TRUST_ICONS.map((ic) => <option key={ic}>{ic}</option>)}
          </select>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre *" className="border rounded-lg px-2 py-1.5 text-sm" />
          <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Sous-titre" className="border rounded-lg px-2 py-1.5 text-sm" />
          <button onClick={add} disabled={!form.title} className="bg-brand-red text-white rounded-lg text-sm font-semibold disabled:opacity-40">
            {editIdx !== null ? "OK" : <><Plus className="w-3.5 h-3.5 inline" /></>}
          </button>
        </div>

        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}

// ─── Newsletter Tab ────────────────────────────────────────────────────────────

function NewsletterTab({ init }: { init: Record<string, any> }) {
  const [form, setForm] = useState({ title: init.title ?? "", subtitle: init.subtitle ?? "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "newsletter", value: JSON.stringify(form) }),
      });
      setToast("✓ Sauvegardé");
      setTimeout(() => setToast(""), 3000);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50">{toast}</div>}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-brand-black">Section Newsletter</h3>
        <p className="text-xs text-neutral-400">Laissez vide pour utiliser les textes i18n par défaut</p>
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1 block">Titre</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Restez informé des nouveautés" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 mb-1 block">Sous-titre</label>
          <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Recevez les offres exclusives..." className="w-full border rounded-xl px-4 py-2.5 text-sm" />
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}

// ─── Contact & Footer Tab ──────────────────────────────────────────────────────

function ContactTab({ init }: { init: Record<string, any> }) {
  const [form, setForm] = useState({
    phone:    init.phone    ?? "+216 97 730 083",
    email:    init.email    ?? "societesimex@gmail.com",
    address:  init.address  ?? "Moknine, Tunisie",
    hours:    init.hours    ?? "Lun-Sam · 9h-18h",
    whatsapp: init.whatsapp ?? "21697730083",
  });
  const [socials, setSocials] = useState<any>(init.socials ?? {
    facebook: "#", instagram: "#", youtube: "#", tiktok: "#", linkedin: "#",
  });
  const [payments, setPayments] = useState<string[]>(init.payments ?? ["VISA","Mastercard","D17","Konnect","COD"]);
  const [newPayment, setNewPayment] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "contact", value: JSON.stringify({ ...form, socials, payments }) }),
      });
      showToast("✓ Sauvegardé — rechargez pour voir les changements dans le footer");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 max-w-xs">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
        {/* Contact info */}
        <div>
          <h3 className="font-bold text-brand-black mb-4">Informations de contact</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1 block flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+216 97 730 083" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1 block flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="societesimex@gmail.com" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1 block">Adresse</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Moknine, Tunisie" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1 block">Horaires</label>
              <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} placeholder="Lun-Sam · 9h-18h" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1 block">WhatsApp (sans +)</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="21697730083" className="w-full border rounded-xl px-4 py-2.5 text-sm font-mono" />
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="border-t pt-4">
          <h3 className="font-bold text-brand-black mb-4 flex items-center gap-2"><Globe className="w-4 h-4" />Réseaux sociaux</h3>
          <div className="grid grid-cols-2 gap-3">
            {(["facebook","instagram","youtube","tiktok","linkedin"] as const).map((net) => (
              <div key={net}>
                <label className="text-xs font-semibold text-neutral-600 mb-1 block capitalize">{net}</label>
                <input value={socials[net] ?? ""} onChange={(e) => setSocials({ ...socials, [net]: e.target.value })} placeholder={`https://${net}.com/...`} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment badges */}
        <div className="border-t pt-4">
          <h3 className="font-bold text-brand-black mb-3">Badges de paiement acceptés</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {payments.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-neutral-100 rounded-lg px-3 py-1.5">
                <span className="text-sm font-semibold">{p}</span>
                <button onClick={() => setPayments((prev) => prev.filter((_, j) => j !== i))} className="text-neutral-400 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newPayment} onChange={(e) => setNewPayment(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newPayment.trim()) { setPayments((p) => [...p, newPayment.trim()]); setNewPayment(""); } }} placeholder="Ajouter un badge (ex: PayPal)" className="flex-1 border rounded-xl px-4 py-2.5 text-sm" />
            <button onClick={() => { if (newPayment.trim()) { setPayments((p) => [...p, newPayment.trim()]); setNewPayment(""); } }} disabled={!newPayment.trim()} className="bg-neutral-200 text-brand-black px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder tout"}
        </button>
      </div>
    </div>
  );
}

// ─── Header Navigation Tab ─────────────────────────────────────────────────────

const DEFAULT_NAV = [
  { href: "/products", label: "Tous les produits", emoji: "🛍️", highlight: false, pro: false },
  { href: "/products?cat=charnieres", label: "Charnières", emoji: "🔩", highlight: false, pro: false },
  { href: "/products?cat=glissieres", label: "Glissières", emoji: "📏", highlight: false, pro: false },
  { href: "/products?cat=poignees", label: "Poignées", emoji: "✋", highlight: false, pro: false },
  { href: "/products?cat=eclairage", label: "Éclairage LED", emoji: "💡", highlight: false, pro: false },
  { href: "/builder", label: "Configurateur", emoji: "🔧", highlight: true, pro: false },
  { href: "/pro", label: "Espace Pro", emoji: "💼", highlight: false, pro: true },
];

function HeaderNavTab({ init }: { init: Record<string, any> }) {
  const [links, setLinks] = useState<any[]>(init.links ?? DEFAULT_NAV);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const EMPTY = { href: "", label: "", emoji: "", highlight: false, pro: false };
  const [form, setForm] = useState(EMPTY);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "header_nav", value: JSON.stringify({ links }) }),
      });
      showToast("✓ Sauvegardé — rechargez pour voir la navigation mise à jour");
    } finally { setSaving(false); }
  };

  const add = () => {
    if (!form.href || !form.label) return;
    if (editIdx !== null) {
      setLinks((l) => l.map((x, i) => i === editIdx ? { ...form } : x));
      setEditIdx(null);
    } else {
      setLinks((l) => [...l, { ...form }]);
    }
    setForm(EMPTY);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    setLinks((l) => { const n = [...l]; [n[i], n[j]] = [n[j], n[i]]; return n; });
  };

  return (
    <div className="space-y-6">
      {toast && <div className="fixed top-4 right-4 bg-brand-red text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 max-w-xs">{toast}</div>}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-brand-black">Liens de navigation (Header)</h3>
        <p className="text-xs text-neutral-400">Ordre d'affichage dans le menu principal du site</p>

        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-2 bg-neutral-50 rounded-xl p-2.5">
              <span className="text-lg w-7 text-center shrink-0">{link.emoji || "•"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {link.label}
                  {link.highlight && <span className="ml-2 text-[10px] bg-brand-red text-white rounded-full px-1.5 py-0.5">★ Mis en avant</span>}
                  {link.pro && <span className="ml-2 text-[10px] bg-brand-gold/30 text-brand-gold rounded-full px-1.5 py-0.5">PRO</span>}
                </p>
                <p className="text-xs text-neutral-400 truncate font-mono">{link.href}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                <button onClick={() => move(i, 1)} disabled={i === links.length-1} className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                <button onClick={() => { setForm({ ...link }); setEditIdx(i); }} className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))} className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/edit form */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-bold text-brand-black mb-3">{editIdx !== null ? "Modifier le lien" : "Ajouter un lien"}</h4>
          <div className="grid grid-cols-[50px_1fr_1fr] gap-2 mb-2">
            <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="🔩" className="border rounded-xl px-2 py-2.5 text-center text-sm" maxLength={4} />
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Libellé *" className="border rounded-xl px-3 py-2.5 text-sm" />
            <input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/products?cat=... *" className="border rounded-xl px-3 py-2.5 text-sm font-mono" />
          </div>
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.checked })} className="rounded" />
              Mis en avant (surlignage rouge)
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={form.pro} onChange={(e) => setForm({ ...form, pro: e.target.checked })} className="rounded" />
              Badge PRO (doré)
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={add} disabled={!form.href || !form.label} className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
              <Check className="w-4 h-4" />{editIdx !== null ? "Mettre à jour" : "Ajouter"}
            </button>
            {editIdx !== null && <button onClick={() => { setForm(EMPTY); setEditIdx(null); }} className="flex items-center gap-2 border border-neutral-200 px-4 py-2 rounded-xl text-sm"><X className="w-4 h-4" />Annuler</button>}
          </div>
        </div>

        <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-brand-red text-white px-5 py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
          <Save className="w-4 h-4" />{saving ? "Sauvegarde..." : "Sauvegarder la navigation"}
        </button>
      </div>
    </div>
  );
}
