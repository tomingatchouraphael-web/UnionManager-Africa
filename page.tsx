"use client";

import { useState, useEffect } from "react";
import { 
  Users, TrendingUp, Calendar, AlertCircle, 
  DollarSign, FileText, Bell, ArrowUpRight,
  ArrowDownRight, Activity, Shield, Zap
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const cotisationsData = [
  { mois: "Jan", montant: 1200000 },
  { mois: "Fév", montant: 1850000 },
  { mois: "Mar", montant: 1600000 },
  { mois: "Avr", montant: 2100000 },
  { mois: "Mai", montant: 1900000 },
  { mois: "Jun", montant: 2400000 },
  { mois: "Jul", montant: 2200000 },
  { mois: "Aoû", montant: 2600000 },
];

const membresParRegion = [
  { region: "Dakar", membres: 420 },
  { region: "Thiès", membres: 280 },
  { region: "Saint-Louis", membres: 190 },
  { region: "Ziguinchor", membres: 150 },
  { region: "Kaolack", membres: 130 },
];

const statutMembres = [
  { name: "Actifs", value: 1240, color: "#10B981" },
  { name: "En retard", value: 320, color: "#F59E0B" },
  { name: "Inactifs", value: 180, color: "#EF4444" },
];

const statsCards = [
  {
    title: "Total Membres",
    value: "1,740",
    change: "+12%",
    up: true,
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    title: "Membres Actifs",
    value: "1,240",
    change: "+8%",
    up: true,
    icon: Activity,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    title: "Cotisations (FCFA)",
    value: "2,6M",
    change: "+18%",
    up: true,
    icon: DollarSign,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    title: "Réunions Prévues",
    value: "8",
    change: "Ce mois",
    up: true,
    icon: Calendar,
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    title: "Plaintes en Cours",
    value: "23",
    change: "-5%",
    up: false,
    icon: AlertCircle,
    color: "from-red-500 to-rose-600",
    bg: "bg-red-50",
    text: "text-red-600",
  },
  {
    title: "Solde Trésorerie",
    value: "14,2M",
    change: "+22%",
    up: true,
    icon: TrendingUp,
    color: "from-cyan-500 to-sky-600",
    bg: "bg-cyan-50",
    text: "text-cyan-600",
  },
];

const recentActivities = [
  { action: "Nouveau membre inscrit", name: "Amadou Diallo", time: "Il y a 15 min", type: "member" },
  { action: "Cotisation reçue", name: "Section Dakar-Nord", time: "Il y a 1h", type: "payment" },
  { action: "Réunion planifiée", name: "Assemblée Générale Q3", time: "Il y a 2h", type: "meeting" },
  { action: "Plainte déposée", name: "Fatou Sow vs Entreprise X", time: "Il y a 3h", type: "complaint" },
  { action: "Document uploadé", name: "PV Réunion Juillet 2025", time: "Il y a 5h", type: "document" },
];

const prochaines_reunions = [
  { titre: "AG Section Dakar", date: "15 Août 2025", participants: 85, lieu: "Salle Conférence A" },
  { titre: "Comité Exécutif", date: "18 Août 2025", participants: 12, lieu: "Siège National" },
  { titre: "Négociation Salariale", date: "22 Août 2025", participants: 6, lieu: "Ministère du Travail" },
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Bonjour");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Bonjour");
    else if (h < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-['Outfit',sans-serif]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium tracking-wider uppercase">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              {greeting}, <span className="text-emerald-600">Secrétaire Général</span> 👋
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-all shadow-sm">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                SG
              </div>
              <span className="text-sm font-semibold text-gray-700">Moussa Camara</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statsCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 ${card.bg} rounded-xl`}>
                  <Icon size={20} className={card.text} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${card.up ? "text-emerald-600" : "text-red-500"}`}>
                  {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Cotisations Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Évolution des Cotisations</h3>
              <p className="text-sm text-gray-500">8 derniers mois (FCFA)</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">+18% ce mois</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cotisationsData}>
              <defs>
                <linearGradient id="colorCot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000000}M`} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString()} FCFA`, "Cotisations"]} />
              <Area type="monotone" dataKey="montant" stroke="#10B981" strokeWidth={2.5} fill="url(#colorCot)" dot={{ fill: "#10B981", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Statut des Membres</h3>
          <p className="text-sm text-gray-500 mb-4">Répartition actuelle</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statutMembres} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statutMembres.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [v, "membres"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {statutMembres.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Membres par Région</h3>
          <p className="text-sm text-gray-500 mb-4">Top 5 régions</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={membresParRegion} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip />
              <Bar dataKey="membres" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  act.type === "member" ? "bg-blue-500" :
                  act.type === "payment" ? "bg-emerald-500" :
                  act.type === "meeting" ? "bg-purple-500" :
                  act.type === "complaint" ? "bg-red-500" : "bg-gray-400"
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700">{act.action}</p>
                  <p className="text-xs text-gray-500 truncate">{act.name}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Prochaines Réunions</h3>
          <div className="space-y-3">
            {prochaines_reunions.map((r, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700">{r.titre}</p>
                  <span className="text-xs text-emerald-600 font-medium ml-2 flex-shrink-0">{r.participants} pers.</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">📅 {r.date}</span>
                </div>
                <span className="text-xs text-gray-400">📍 {r.lieu}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
