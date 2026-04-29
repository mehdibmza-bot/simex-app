"use client";

import { useState } from "react";
import { Mail, Lock, User as UserIcon, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUI } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AuthModal() {
  const t = useI18n((s) => s.t);
  const open = useUI((s) => s.authOpen);
  const setOpen = useUI((s) => s.setAuth);
  const showToast = useUI((s) => s.showToast);
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${tab === "signin" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      if (res.ok) {
        showToast(tab === "signin" ? "Bienvenue !" : "Compte créé !", "✓");
        setOpen(false);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Erreur", "⚠");
      }
    } catch {
      showToast("Erreur réseau", "⚠");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="bg-brand-black text-white p-6">
          <DialogTitle className="display text-2xl tracking-wider text-white">
            {t("auth_title")}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="flex bg-brand-cream rounded-full p-1 mb-6">
            {[
              { key: "signin" as const, label: t("signin") },
              { key: "signup" as const, label: t("signup") },
            ].map((b) => (
              <button
                key={b.key}
                onClick={() => setTab(b.key)}
                className={cn(
                  "flex-1 px-5 py-2 rounded-full text-sm font-semibold transition-colors",
                  tab === b.key ? "bg-brand-black text-white" : "text-neutral-500"
                )}
              >
                {b.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {tab === "signup" && (
              <>
                <Field icon={UserIcon} name="name" placeholder={t("full_name")} />
                <Field icon={Phone} name="phone" placeholder={t("phone")} />
              </>
            )}
            <Field icon={Mail} name="email" type="email" placeholder={t("email")} />
            <Field icon={Lock} name="password" type="password" placeholder={t("password")} />
            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "..." : tab === "signin" ? t("signin_btn") : t("signup_btn")}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  icon: Icon,
  ...props
}: { icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
      <Input {...props} required className="pl-10 h-11" />
    </label>
  );
}
