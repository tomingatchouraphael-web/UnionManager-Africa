"use client";

import { useState } from "react";
import { Plus, Search, AlertCircle, Clock, CheckCircle, XCircle, Eye, ChevronRight } from "lucide-react";

const PLAINTES = [
  { id: "PLT-2025-001", declarant: "Moussa Ndiaye", entreprise: "SENELEC", objet: "Licenciement abusif", categorie: "licenciement", priorite: "haute", statut: "en instruction", date: "2025-07-01", responsable: "Me. Fatou Diop", description: "Le membre a été licencié sans préavis et sans motif valable après 15 ans de service." },
  { id: "PLT-2025-002", declarant: "Aissatou Badji", entreprise: "Ministère Éducation", objet: "Harcèlement au travail", categorie: "harcèlement", priorite: "haute", statut: "ouverte", date: "2025-07-05", responsable: "Non assigné", description: "Plainte pour harcèlement moral de la part du supérieur hiérarchique." },
  { id: "PLT-2025-003", declarant: "Cheikh Thiam", entreprise: "Port Autonome Dakar", objet: "Non-paiement heures supplémentaires", categorie: "salaire", priorite: "normale", statut: "en médiation", date: "2025-06-20", responsable: "Ibrahima Gueye", description: "Heures supplémentaires effectuées depuis 6 mois non compensées." },
  { id: "PLT-2025-004", declarant: "Ramatou Kouyaté", entreprise: "Société X", objet: "Discrimination à l'embauche", categorie: "discrimination", priorite: "normale", statut: "résolue", date: "2025-05-15", responsable: "Me. Fatou Diop", description: "Discrimination à raison du sexe lors du processus de promotion interne." },
  { id: "PLT-2025-005", declarant: "Omar Faye", entreprise: "Banque de Dakar", objet: "Conditions de travail dangereuses", categorie: "sécurité", priorite: "urgente", statut: "ouverte", date: "2025-07-10", responsable: "Non assigné", description: "Locaux non conformes aux normes de sécurité incendie." },
];

const STATUT_CFG: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  ouverte: { label: "Ouverte", cls: "bg-blue-50 text-blue-700 border-blue-200", icon: AlertCircle },
  "en instruction": { label: "En instruction", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  "en médiation": { label: "En médiation", cls: "bg-purple-50 text-purple-700 border-purple-200", icon: Clock },
  résolue: { label: "Résolue", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  classée: { label: "Classée", cls: "bg-gray-100 text-gray-600 border-gray-200", icon: XCircle },
};

const PRIORITE_CFG: Record<string, string> = {
  urgente: "bg-red-100 text-red-700",
  haute: "bg-orange-100 text-orange-700",
  normale: "bg-gray-100 text-gray-600",
};

const CATEGORIE_CFG: Record<string, string> = {
  licenciement: "bg-red-50 text-red-700",
  harcèlement: "bg-purple-50 text-purple-700",
  salaire: "bg-amber-50 text-amber-700",
  discrimination: "bg-blue-50 text-blue-700",
  sécurité: "bg-orange-50 text-orange-700",
};

function NouvellePlaintegModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Déclarer une Plainte</h2>
          <p className="text-sm text-gray-500">Enregistrez une nouvelle plainte syndicale</p>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Membre déclarant", placeholder: "Rechercher un membre...", required: true },
            { label: "Entreprise / Administration concernée", placeholder: "Ex: SENELEC", required: true },
            { label: "Objet de la plainte", placeholder: "Résumé en une ligne...", required: true },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
              <input className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400" placeholder={f.placeholder} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catégorie</label>
              <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400">
                {["Licenciement abusif", "Harcèlement", "Non-paiement salaire", "Discrimination", "Sécurité au travail", "Autre"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priorité</label>
              <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400">
                {["Normale", "Haute", "Urgente"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description détaillée <span className="text-red-500">*</span></label>
            <textarea className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 resize-none" rows={4} placeholder="Décrivez les faits en détail..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Responsable assigné</label>
            <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400">
              <option>Non assigné</option>
              <option>Me. Fatou Diop - Juriste</option>
              <option>Ibrahima Gueye - Délégué</option>
            </select>
          </div>
        </div>
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Annuler</button>
          <button className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700">Enregistrer la Plainte</button>
        </div>
      </div>
    </div>
  );
}

export default function PlaintesPage() {
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState("Tous");
  const [showCreate, setShowCreate] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const counts = {
    ouverte: PLAINTES.filter(p => p.statut === "ouverte").length,
    "en instruction": PLAINTES.filter(p => p.statut === "en instruction").length,
    résolue: PLAINTES.filter(p => p.statut === "résolue").length,
  };

  const filtered = PLAINTES.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.declarant.toLowerCase().includes(q) || p.objet.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchStatut = statut === "Tous" || p.statut === statut;
    return matchSearch && matchStatut;
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-['Outfit',sans-serif]">
      {showCreate && <NouvellePlaintegModal onClose={() => setShowCreate(false)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Plaintes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{PLAINTES.length} dossiers enregistrés</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 shadow-sm">
          <Plus size={15} /> Nouvelle Plainte
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Dossiers", value: PLAINTES.length, cls: "border-gray-200", val_cls: "text-gray-900" },
          { label: "Ouvertes", value: counts.ouverte, cls: "border-blue-200 bg-blue-50/50", val_cls: "text-blue-700" },
          { label: "En instruction", value: counts["en instruction"], cls: "border-amber-200 bg-amber-50/50", val_cls: "text-amber-700" },
          { label: "Résolues", value: counts.résolue, cls: "border-emerald-200 bg-emerald-50/50", val_cls: "text-emerald-700" },
        ].map((c, i) => (
          <div key={i} className={`bg-white rounded-2xl p-4 border ${c.cls} shadow-sm`}>
            <p className={`text-3xl font-bold ${c.val_cls}`}>{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex gap-3 items-center flex-wrap">
        <div className="flex-1 min-w-52 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom, objet, référence..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400" />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {["Tous", "ouverte", "en instruction", "en médiation", "résolue"].map(s => (
            <button key={s} onClick={() => setStatut(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${statut === s ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Plaintes List */}
      <div className="space-y-3">
        {filtered.map(p => {
          const cfg = STATUT_CFG[p.statut] || STATUT_CFG.ouverte;
          const StatusIcon = cfg.icon;
          const isExpanded = expanded === p.id;
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : p.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${CATEGORIE_CFG[p.categorie] || "bg-gray-100"}`}>
                    <AlertCircle size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-gray-400">{p.id}</span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${PRIORITE_CFG[p.priorite]}`}>{p.priorite}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
                        <StatusIcon size={10} className="inline mr-1" />{cfg.label}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900">{p.objet}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>👤 {p.declarant}</span>
                      <span>🏢 {p.entreprise}</span>
                      <span>📅 {new Date(p.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`text-gray-300 mt-1 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                  <p className="text-sm text-gray-700 mb-4">{p.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">Responsable</p>
                      <p className="text-sm font-semibold text-gray-800">{p.responsable}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">Catégorie</p>
                      <p className="text-sm font-semibold text-gray-800 capitalize">{p.categorie}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">Date ouverture</p>
                      <p className="text-sm font-semibold text-gray-800">{new Date(p.date).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      <Eye size={13} /> Voir dossier complet
                    </button>
                    {p.statut !== "résolue" && (
                      <button className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
                        Mettre à jour le statut
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
