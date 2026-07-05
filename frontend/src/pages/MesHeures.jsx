import React, { useEffect, useState } from "react";
import Layout from "../composants/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Clock,
  FileDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { StatCard } from "../composants/StatCard";
import { typeBadge, statutBadge, sortHeuresDesc } from "../lib/utils";
import { exportMesHeuresPDF } from "../lib/pdfutils";

function MesHeures() {
  const [heures, setHeures] = useState([]);
  const [stats, setStats] = useState(null);
  const [enseignant, setEnseignant] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.enseignant_id) return;
    async function fetchData() {
      try {
        const [resEns, resHeures, resStats] = await Promise.all([
          api.get(`/enseignants/${user.enseignant_id}`),
          api.get(`/heures/enseignant/${user.enseignant_id}`),
          api.get(`/dashboard/enseignant/${user.enseignant_id}`),
        ]);
        setEnseignant(resEns.data);
        setHeures(sortHeuresDesc(resHeures.data));
        setStats(resStats.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [user]);

  async function handleExportPDF() {
    if (!enseignant) return;
    setExportLoading(true);
    try {
      exportMesHeuresPDF({ enseignant, heures, stats });
    } finally {
      setExportLoading(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Espace enseignant
            </p>
            <h1
              className="text-3xl font-bold text-blue-950"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Mes <span className="text-yellow-500">heures</span>
            </h1>
            <p className="text-[13px] text-slate-400 mt-1">
              Suivi de vos heures déclarées pour l'année en cours.
            </p>
          </div>
          <button
            onClick={handleExportPDF}
            disabled={exportLoading || !enseignant}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-colors"
          >
            <FileDown className="h-4 w-4" />
            {exportLoading ? "Génération…" : "Télécharger PDF"}
          </button>
        </div>

        {/* ── Stats ── */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard
              icon={Timer}
              label="Total heures"
              value={`${stats.totalHeures}h`}
              gradient="from-blue-900/10 to-blue-900/0"
              color="text-blue-900"
            />
            <StatCard
              icon={TrendingUp}
              label="Heures complémentaires"
              value={`${stats.heuresComplementaires}h`}
              gradient="from-amber-500/10 to-amber-500/0"
              color="text-amber-600"
            />
            <StatCard
              icon={Wallet}
              label="Montant à payer"
              value={`${Number(stats.montantTotal || 0)} FCFA`}
              gradient="from-emerald-500/10 to-emerald-500/0"
              color="text-emerald-700"
            />
          </div>
        )}

        {/* ── Table des heures ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-[18px] h-[18px] text-yellow-400" />
            </div>
            <div>
              <h2
                className="m-0 text-base font-bold text-blue-950"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Détail des heures
              </h2>
              <p className="m-0 text-xs text-slate-400">
                {heures.length} heure{heures.length > 1 ? "s" : ""} enregistrée
                {heures.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {[
                    "Matière",
                    "Date",
                    "Type",
                    "Durée",
                    "Salle",
                    "Complémentaire",
                    "Statut",
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heures.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-14 text-center text-slate-300"
                    >
                      <div className="flex flex-col items-center gap-2.5">
                        <Clock className="w-9 h-9" />
                        <span className="text-sm font-medium">
                          Aucune heure trouvée
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  heures.map((h) => (
                    <tr
                      key={h.idheure}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-3.5 font-semibold text-blue-950">
                        {h.matiere || "—"}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {h.date_cours
                          ? new Date(h.date_cours).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${typeBadge(h.type_heure)}`}
                        >
                          {h.type_heure || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 tabular-nums font-semibold">
                        {h.duree || 0}h
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {h.salle || "—"}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            h.est_complementaire
                              ? "bg-orange-50 text-orange-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {h.est_complementaire ? "Oui" : "Non"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statutBadge(h.statut)}`}
                        >
                          {h.statut === "validé" && (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          {h.statut === "refusé" && (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {!h.statut && <AlertCircle className="w-3.5 h-3.5" />}
                          {h.statut || "en attente"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {heures.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
              <p className="m-0 text-xs text-slate-400">
                {heures.length} heure{heures.length > 1 ? "s" : ""} affichée
                {heures.length > 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default MesHeures;
