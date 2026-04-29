"use client";

import { useState } from "react";
import {
  Layers, SlidersHorizontal, Plus, Pencil, Trash2, X, GripVertical,
  Eye, EyeOff, ToggleLeft, ToggleRight, Image as ImgIcon, ChevronUp, ChevronDown, Check,
  ExternalLink, Save, Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Slide {
  id: string; order: number; isActive: boolean;
  eyebrow: string; titleLine1: string; titleLine2: string; titleLine3: string;
  description: string; imageUrl: string;
  btn1Label: string; btn1Href: string; btn2Label: string; btn2Href: string;
}

interface Section { id: string; key: string; label: string; isVisible: boolean; order: number; }

interface Props { initialSlides: Slide[]; initialSections: Section[]; }

// ─── Empty slide template ─────────────────────────────────────────────────────
const EMPTY_SLIDE: Omit<Slide, "id" | "order"> = {
  isActive: true,
  eyebrow: "", titleLine1: "", titleLine2: "", titleLine3: "",
  description: "",
  imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
  btn1Label: "Découvrir", btn1Href: "/products",
  btn2Label: "En savoir plus", btn2Href: "/builder",
};

// ─── Section icons map ────────────────────────────────────────────────────────
const SECTION_ICONS: Record<string, string> = {
  happy_hour: "⏱️", promotions: "🏷️", personas: "👤", categories: "📦",
  products: "⭐", daily_deal: "🔥", black_friday: "🖤", builder: "🔧",
  pro_banner: "💼", mission: "🎯", video: "🎬", testimonials: "💬",
  trust: "🛡️", faq: "❓", newsletter: "📧",
};

// ─── Slide Form Modal ─────────────────────────────────────────────────────────
function SlideModal({ slide, onSave, onClose }: {
  slide: Partial<Slide> | null;
  onSave: (data: Partial<Slide>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Slide>>(slide ?? { ...EMPTY_SLIDE });
  const set = (k: keyof Slide, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-neutral-900 text-white px-8 py-7 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              {slide?.id ? "Modifier le slide" : "Nouveau slide"}
            </h2>
            <p className="text-neutral-400 text-sm mt-0.5">Hero slider · Page d'accueil</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-5">
          {/* Preview */}
          {form.imageUrl && (
            <div className="relative h-36 rounded-2xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${form.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
              <div className="absolute inset-0 p-5 flex flex-col justify-center">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{form.eyebrow || "Eyebrow text"}</p>
                <p className="text-white font-black text-xl leading-tight mt-1">
                  {form.titleLine1 || "Titre ligne 1"} <span className="text-red-400">{form.titleLine2 || "ligne 2"}</span> {form.titleLine3 || "ligne 3"}
                </p>
              </div>
              <div className="absolute top-3 right-3 bg-black/50 rounded-lg px-2 py-1 text-[10px] text-white font-semibold flex items-center gap-1">
                <Monitor className="w-3 h-3" /> Aperçu
              </div>
            </div>
          )}

          {/* Image URL */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-1.5 flex items-center gap-1.5">
              <ImgIcon className="w-3.5 h-3.5" /> Image de fond (URL)
            </p>
            <input value={form.imageUrl ?? ""} onChange={e => set("imageUrl", e.target.value)}
              placeholder="https://images.unsplash.com/…"
              className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Eyebrow */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-1.5">Eyebrow (petite étiquette rouge)</p>
            <input value={form.eyebrow ?? ""} onChange={e => set("eyebrow", e.target.value)}
              placeholder="Catalogue 2026 · Quincaillerie"
              className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red"
            />
          </div>

          {/* Title lines */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">Titre (3 lignes — ligne 2 en rouge)</p>
            <div className="space-y-2">
              {(["titleLine1", "titleLine2", "titleLine3"] as const).map((k, i) => (
                <div key={k} className="flex items-center gap-2">
                  <span className={cn(
                    "w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0",
                    i === 1 ? "bg-brand-red text-white" : "bg-neutral-100 text-neutral-500"
                  )}>{i + 1}</span>
                  <input
                    value={(form as any)[k] ?? ""}
                    onChange={e => set(k, e.target.value)}
                    placeholder={["Ligne 1", "Ligne 2 (rouge)", "Ligne 3"][i]}
                    className="flex-1 h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-1.5">Description</p>
            <textarea value={form.description ?? ""} onChange={e => set("description", e.target.value)}
              rows={3} placeholder="Texte de description sous le titre…"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none"
            />
          </div>

          {/* Buttons */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">Boutons CTA</p>
            <div className="space-y-2">
              {[
                { lk: "btn1Label" as const, hk: "btn1Href" as const, label: "Bouton principal (rouge)" },
                { lk: "btn2Label" as const, hk: "btn2Href" as const, label: "Bouton secondaire (ghost)" },
              ].map(b => (
                <div key={b.lk} className="grid grid-cols-2 gap-2">
                  <input value={(form as any)[b.lk] ?? ""} onChange={e => set(b.lk, e.target.value)}
                    placeholder={b.label}
                    className="h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:border-brand-red"
                  />
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input value={(form as any)[b.hk] ?? ""} onChange={e => set(b.hk, e.target.value)}
                      placeholder="/products"
                      className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 pl-8 pr-3 text-sm focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active toggle */}
          <button onClick={() => set("isActive", !form.isActive)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-semibold transition-all",
              form.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
            )}
          >
            {form.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {form.isActive ? "Slide actif" : "Slide inactif"}
          </button>
        </div>

        <div className="px-8 py-5 border-t border-neutral-100 flex gap-3 shrink-0">
          <Button onClick={() => onSave(form)} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {slide?.id ? "Enregistrer les modifications" : "Créer le slide"}
          </Button>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────
export function HomepageClient({ initialSlides, initialSections }: Props) {
  const [tab, setTab] = useState<"slider" | "sections">("slider");
  const [slides, setSlides] = useState<Slide[]>(initialSlides as Slide[]);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [slideModal, setSlideModal] = useState<Slide | null | "new">(null);
  const [toast, setToast] = useState<string | null>(null);
  const [savingSlide, setSavingSlide] = useState(false);
  const [savingSections, setSavingSections] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // ── Slide CRUD ──────────────────────────────────────────────────────────────
  const handleSaveSlide = async (data: Partial<Slide>) => {
    setSavingSlide(true);
    try {
      const isEdit = slideModal !== "new" && (slideModal as Slide)?.id && !(slideModal as Slide)?.id?.startsWith("default-");
      const res = await fetch("/api/admin/slider", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { ...data, id: (slideModal as Slide).id } : { ...data, order: slides.length }),
      });
      const saved = await res.json();
      if (isEdit) {
        setSlides(ss => ss.map(s => s.id === saved.id ? saved : s));
      } else {
        setSlides(ss => [...ss, saved]);
      }
      showToast(isEdit ? "Slide mis à jour ✓" : "Slide créé ✓");
      setSlideModal(null);
    } catch { showToast("Erreur de sauvegarde"); }
    setSavingSlide(false);
  };

  const handleDeleteSlide = async (id: string) => {
    if (id.startsWith("default-")) { showToast("Créez d'abord via le formulaire pour pouvoir supprimer"); return; }
    if (!confirm("Supprimer ce slide ?")) return;
    await fetch("/api/admin/slider", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setSlides(ss => ss.filter(s => s.id !== id));
    showToast("Slide supprimé");
  };

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= slides.length) return;
    const arr = [...slides];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    arr[idx].order = idx;
    arr[next].order = next;
    setSlides(arr);
  };

  // ── Section toggle/reorder ──────────────────────────────────────────────────
  const toggleSection = (id: string) => {
    setSections(ss => ss.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= sections.length) return;
    const arr = [...sections];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    arr[idx].order = idx;
    arr[next].order = next;
    setSections(arr);
  };

  const saveSections = async () => {
    setSavingSections(true);
    try {
      await fetch("/api/admin/homepage-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections.map((s, i) => ({ id: s.id, isVisible: s.isVisible, order: i }))),
      });
      showToast("Sections sauvegardées ✓");
    } catch { showToast("Erreur"); }
    setSavingSections(false);
  };

  const visibleCount = sections.filter(s => s.isVisible).length;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-[300] bg-brand-black text-white text-sm px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-black uppercase tracking-tight">Page d'accueil</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Gérez le slider et les sections visibles</p>
        </div>
        <a
          href="/" target="_blank"
          className="flex items-center gap-2 px-4 h-10 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:border-brand-red hover:text-brand-red transition-all"
        >
          <ExternalLink className="w-4 h-4" /> Voir la page
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-2xl w-fit">
        {([
          { key: "slider", label: "Hero Slider", icon: SlidersHorizontal },
          { key: "sections", label: "Sections", icon: Layers },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-bold transition-all",
              tab === key ? "bg-white text-brand-black shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── SLIDER TAB ── */}
      {tab === "slider" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">{slides.filter(s => s.isActive).length}/{slides.length} slides actifs</p>
            <Button onClick={() => setSlideModal("new")}>
              <Plus className="w-4 h-4 mr-2" /> Nouveau slide
            </Button>
          </div>

          <div className="space-y-3">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className={cn(
                  "bg-white rounded-2xl border overflow-hidden transition-all",
                  slide.isActive ? "border-neutral-200" : "border-neutral-100 opacity-60"
                )}
              >
                <div className="flex items-stretch gap-0">
                  {/* Preview image */}
                  <div className="relative w-40 shrink-0 hidden sm:block">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${slide.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 p-3 flex flex-col justify-end">
                      <p className="text-white font-black text-xs leading-tight line-clamp-2">
                        {slide.titleLine1} <span className="text-red-400">{slide.titleLine2}</span> {slide.titleLine3}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider",
                            slide.isActive ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                          )}>
                            {slide.isActive ? "Actif" : "Inactif"}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-semibold">#{idx + 1}</span>
                        </div>
                        <p className="text-[10px] text-brand-red font-bold uppercase tracking-widest truncate">{slide.eyebrow}</p>
                        <p className="font-black text-brand-black text-sm mt-0.5 truncate">
                          {slide.titleLine1} · {slide.titleLine2} · {slide.titleLine3}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{slide.description}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-lg font-semibold truncate max-w-[140px]">
                            {slide.btn1Label}
                          </span>
                          <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-lg font-semibold truncate max-w-[140px]">
                            {slide.btn2Label}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => moveSlide(idx, -1)} disabled={idx === 0}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 transition-all">
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button onClick={() => moveSlide(idx, 1)} disabled={idx === slides.length - 1}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 transition-all">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => setSlideModal(slide)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-brand-black transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteSlide(slide.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTIONS TAB ── */}
      {tab === "sections" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              <span className="font-bold text-brand-black">{visibleCount}</span>/{sections.length} sections visibles
            </p>
            <Button onClick={saveSections} disabled={savingSections}>
              <Save className="w-4 h-4 mr-2" />
              {savingSections ? "Sauvegarde…" : "Sauvegarder l'ordre"}
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 transition-colors",
                  section.isVisible ? "" : "bg-neutral-50 opacity-60"
                )}
              >
                {/* Drag handle indicator + order */}
                <GripVertical className="w-4 h-4 text-neutral-300 shrink-0" />

                {/* Icon + label */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl w-8 text-center">{SECTION_ICONS[section.key] ?? "📄"}</span>
                  <div>
                    <p className="font-semibold text-brand-black text-sm">{section.label}</p>
                    <p className="text-[10px] text-neutral-400 font-mono">{section.key}</p>
                  </div>
                </div>

                {/* Visible badge */}
                <span className={cn(
                  "text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider hidden sm:inline-flex items-center gap-1",
                  section.isVisible ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                )}>
                  {section.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {section.isVisible ? "Visible" : "Masqué"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveSection(idx, -1)} disabled={idx === 0}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 transition-all">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 transition-all">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => toggleSection(section.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 h-9 rounded-xl border text-xs font-semibold transition-all ml-1",
                      section.isVisible
                        ? "bg-white text-neutral-600 border-neutral-200 hover:border-rose-300 hover:text-rose-600"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    )}
                  >
                    {section.isVisible
                      ? <><EyeOff className="w-3.5 h-3.5" /> Masquer</>
                      : <><Eye className="w-3.5 h-3.5" /> Afficher</>
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-semibold">Astuce</p>
              <p className="text-amber-700 mt-0.5">Utilisez les flèches pour réordonner. Cliquez <strong>Sauvegarder l'ordre</strong> pour appliquer les changements sur la page d'accueil.</p>
            </div>
          </div>
        </div>
      )}

      {/* Slide modal */}
      {slideModal !== null && (
        <SlideModal
          slide={slideModal === "new" ? null : slideModal}
          onSave={handleSaveSlide}
          onClose={() => setSlideModal(null)}
        />
      )}
    </div>
  );
}
