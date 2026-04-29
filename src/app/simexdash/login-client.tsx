"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react";

export default function SimexLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) return; // soft-lock after 5 failed attempts (UX only)
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAttempts((n) => n + 1);
        setError(data.error || "Identifiants incorrects");
        setLoading(false);
        return;
      }
      if (data.role === "DELIVERY") {
        router.push("/delivery");
      } else if (data.role === "ADMIN" || data.role === "STAFF") {
        router.push("/simexdash/dashboard");
      } else {
        setError("Accès non autorisé.");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau, réessayez.");
      setLoading(false);
    }
  };

  const locked = attempts >= 5;

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+')] opacity-[0.03] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-brand-red/10 border border-brand-red/20 mb-6 shadow-[0_0_40px_rgba(220,38,38,0.15)]">
            <ShieldCheck className="w-8 h-8 text-brand-red" />
          </div>
          <div>
            <span className="font-black text-4xl tracking-[6px] text-white">SIMEX</span>
            <p className="text-[10px] text-brand-red font-black tracking-[3px] uppercase mt-2 opacity-80">
              Accès Sécurisé · Système Interne
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-[2rem] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <h1 className="text-base font-black text-white uppercase tracking-widest leading-none">Authentification</h1>
              <p className="text-neutral-500 text-[11px] font-medium mt-1.5">Réservé au personnel autorisé uniquement</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" />
          </div>

          {/* Attempts warning */}
          {attempts >= 3 && !locked && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-400 font-bold">
                {5 - attempts} tentative{5 - attempts > 1 ? "s" : ""} restante{5 - attempts > 1 ? "s" : ""}
              </p>
            </div>
          )}

          {locked ? (
            <div className="text-center py-8 space-y-3">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-sm font-black text-white uppercase tracking-wide">Accès bloqué</p>
              <p className="text-xs text-neutral-500">Trop de tentatives échouées. Rechargez la page pour réessayer.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="•••@simex.tn"
                    className="w-full h-12 pl-11 pr-4 bg-neutral-800/80 border border-neutral-700/80 rounded-xl text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red/50 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className="w-full h-12 pl-11 pr-12 bg-neutral-800/80 border border-neutral-700/80 rounded-xl text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <p className="text-xs text-red-400 font-bold">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-brand-red hover:bg-brand-red/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-brand-red/25 hover:shadow-brand-red/40 hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Vérification...
                  </span>
                ) : (
                  "Accéder au système"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-neutral-700 mt-6 font-medium tracking-wider">
          SIMEX · Système de Gestion Interne · Accès Restreint
        </p>
      </div>
    </div>
  );
}
