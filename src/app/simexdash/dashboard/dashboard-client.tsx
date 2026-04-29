"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Wallet,
  Package,
  Users as UsersIcon,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Props {
  data: {
    kpis: {
      totalRevenue: number;
      totalOrders: number;
      products: number;
      users: number;
      avgOrder: number;
    };
    series: { date: string; revenue: number; orders: number }[];
    recentOrders: any[];
  };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  RETURNED: "bg-neutral-200 text-neutral-700",
};

const CATEGORY_DATA = [
  { name: "Charnières", value: 32, fill: "#E1252A" },
  { name: "Glissières", value: 24, fill: "#0A0A0A" },
  { name: "Poignées", value: 18, fill: "#D4A24C" },
  { name: "LED", value: 14, fill: "#10b981" },
  { name: "Autre", value: 12, fill: "#6366f1" },
];

export function AdminDashboard({ data }: Props) {
  const { kpis, series, recentOrders } = data;

  const kpiCards = [
    {
      label: "Chiffre d'affaires",
      value: formatPrice(kpis.totalRevenue),
      icon: Wallet,
      delta: "+12.4%",
      up: true,
    },
    {
      label: "Commandes",
      value: kpis.totalOrders.toString(),
      icon: ShoppingCart,
      delta: "+8.1%",
      up: true,
    },
    {
      label: "Panier moyen",
      value: formatPrice(kpis.avgOrder),
      icon: TrendingUp,
      delta: "+3.2%",
      up: true,
    },
    {
      label: "Produits actifs",
      value: kpis.products.toString(),
      icon: Package,
      delta: "+24",
      up: true,
    },
    {
      label: "Clients",
      value: kpis.users.toString(),
      icon: UsersIcon,
      delta: "+5.8%",
      up: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="display text-3xl text-brand-black">Tableau de bord</h2>
        <p className="text-sm text-neutral-500">
          Vue d&apos;ensemble des 30 derniers jours
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCards.map((k) => (
          <div
            key={k.label}
            className="bg-white rounded-2xl p-5 border border-neutral-200 hover:shadow-lg hover:border-neutral-300 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center">
                <k.icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs font-bold inline-flex items-center gap-0.5 ${
                  k.up ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {k.up ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {k.delta}
              </span>
            </div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
              {k.label}
            </p>
            <p className="display text-2xl text-brand-black">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-brand-black">Chiffre d&apos;affaires</h3>
              <p className="text-xs text-neutral-500">30 derniers jours · TND</p>
            </div>
            <span className="text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
              Quotidien
            </span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E1252A" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#E1252A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#999" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#999" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #eee" }}
                  formatter={(v: any) => formatPrice(Number(v))}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#E1252A"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h3 className="font-bold text-brand-black mb-1">Mix catégories</h3>
          <p className="text-xs text-neutral-500 mb-4">Part des ventes</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconSize={10}
                  wrapperStyle={{ fontSize: 11 }}
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-brand-black">Commandes récentes</h3>
            <a href="/simexdash/dashboard/orders" className="text-xs text-brand-red font-semibold">
              Voir tout →
            </a>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-neutral-500 text-center py-10">
              Aucune commande pour le moment.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider">
                    <th className="py-2 px-2">N°</th>
                    <th className="py-2 px-2">Client</th>
                    <th className="py-2 px-2">Montant</th>
                    <th className="py-2 px-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-neutral-100">
                      <td className="py-3 px-2 font-mono text-xs text-brand-red">
                        #{o.number}
                      </td>
                      <td className="py-3 px-2">{o.customer}</td>
                      <td className="py-3 px-2 font-semibold">{formatPrice(o.total)}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            STATUS_COLORS[o.status] || "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h3 className="font-bold text-brand-black mb-1">Volume commandes</h3>
          <p className="text-xs text-neutral-500 mb-4">30 derniers jours</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#999" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 10, fill: "#999" }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#0A0A0A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
