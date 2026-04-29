"use client";

import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, TrendingDown, ShoppingBag, Users, Tag, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const BRAND_RED = "#E1252A";
const BRAND_GOLD = "#D4A24C";
const COLORS = [BRAND_RED, BRAND_GOLD, "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6"];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function buildRevenueData() {
  const days: any[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push({
      date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      revenue: rand(1200, 8500),
      orders: rand(5, 45),
    });
  }
  return days;
}

const REVENUE_DATA = buildRevenueData();

const CATEGORY_DATA = [
  { name: "Charnières", value: 28 },
  { name: "Coulisses", value: 18 },
  { name: "Poignées", value: 15 },
  { name: "Serrures", value: 12 },
  { name: "Pieds meubles", value: 10 },
  { name: "Étagères", value: 9 },
  { name: "Salle de bain", value: 8 },
];

const TOP_PRODUCTS = [
  { name: "Charnière Clip-Top 110°", sales: 142 },
  { name: "Coulisse à billes 500mm", sales: 118 },
  { name: "Poignée inox 128mm", sales: 97 },
  { name: "Serrure à bec-de-cane", sales: 85 },
  { name: "Pied réglable 150mm", sales: 74 },
  { name: "Console tablette 200mm", sales: 66 },
  { name: "Ferme-porte hydraulique", sales: 58 },
];

const MONTHLY = [
  { month: "Jan", rev: 24000, prev: 19000 },
  { month: "Fév", rev: 28000, prev: 22000 },
  { month: "Mar", rev: 31000, prev: 25000 },
  { month: "Avr", rev: 29000, prev: 27000 },
  { month: "Mai", rev: 38000, prev: 29000 },
  { month: "Jun", rev: 42000, prev: 32000 },
];

interface KpiProps { label: string; value: string; sub: string; trend: number; icon: React.ElementType; color: string }
function KpiCard({ label, value, sub, trend, icon: Icon, color }: KpiProps) {
  const up = trend >= 0;
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-start justify-between">
      <div>
        <p className="text-xs text-neutral-500 mb-1">{label}</p>
        <p className={cn("text-2xl font-black mb-1", color)}>{value}</p>
        <div className={cn("flex items-center gap-1 text-xs font-semibold", up ? "text-emerald-600" : "text-rose-600")}>
          {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {up ? "+" : ""}{trend}% {sub}
        </div>
      </div>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color === "text-brand-red" ? "bg-brand-red/10" : "bg-neutral-100")}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
    </div>
  );
}

export function AnalyticsClient() {
  const totalRev = REVENUE_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = REVENUE_DATA.reduce((s, d) => s + d.orders, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Revenu 30j" value={`${(totalRev/1000).toFixed(1)}k TND`} sub="vs mois préc." trend={14} icon={DollarSign} color="text-brand-red" />
        <KpiCard label="Commandes 30j" value={String(totalOrders)} sub="vs mois préc." trend={8} icon={ShoppingBag} color="text-blue-600" />
        <KpiCard label="Nouveaux clients" value="47" sub="vs mois préc." trend={-3} icon={Users} color="text-amber-600" />
        <KpiCard label="Panier moyen" value="178 TND" sub="vs mois préc." trend={5} icon={Tag} color="text-emerald-600" />
      </div>

      {/* Revenue + Orders 30d */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5">
        <h3 className="font-bold text-brand-black mb-4">Revenus & Commandes — 30 derniers jours</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BRAND_RED} stopOpacity={0.15} />
                <stop offset="95%" stopColor={BRAND_RED} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradOrd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BRAND_GOLD} stopOpacity={0.15} />
                <stop offset="95%" stopColor={BRAND_GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} interval={4} />
            <YAxis yAxisId="rev" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v: number, n: string) => n === "revenue" ? `${v.toLocaleString("fr-FR")} TND` : `${v} cmds`}
              labelStyle={{ fontSize: 12 }} contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenu (TND)" stroke={BRAND_RED} fill="url(#gradRev)" strokeWidth={2} dot={false} />
            <Area yAxisId="ord" type="monotone" dataKey="orders" name="Commandes" stroke={BRAND_GOLD} fill="url(#gradOrd)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h3 className="font-bold text-brand-black mb-4">Répartition par catégorie</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={CATEGORY_DATA} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {CATEGORY_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {CATEGORY_DATA.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="flex-1 text-neutral-600 truncate">{c.name}</span>
                  <span className="font-bold text-brand-black">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h3 className="font-bold text-brand-black mb-4">Top produits (ventes)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOP_PRODUCTS} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} tickLine={false} axisLine={false} width={110} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="sales" name="Ventes" radius={[0, 6, 6, 0]}>
                {TOP_PRODUCTS.map((_, i) => <Cell key={i} fill={i === 0 ? BRAND_RED : i === 1 ? BRAND_GOLD : "#E5E7EB"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly comparison */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5">
        <h3 className="font-bold text-brand-black mb-4">Comparaison mensuelle (6 derniers mois)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={MONTHLY} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => `${v.toLocaleString("fr-FR")} TND`} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="rev" name="Cette année" fill={BRAND_RED} radius={[6, 6, 0, 0]} />
            <Bar dataKey="prev" name="Année préc." fill="#E5E7EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
