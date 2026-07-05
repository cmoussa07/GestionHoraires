import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Layout from "../composants/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { StatCard } from "../composants/StatCard";
import { typeBadge, statutBadge, sortHeuresDesc } from "../lib/utils";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [heures, setHeures] = useState([]);
  const [departements, setDepartements] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const roleId = Number(user?.role_id);
  const isAdmin = roleId === 1;
  const isRH = roleId === 2;
  const isEnseignant = roleId === 3;

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resStats, resHeures, resDepts] = await Promise.all([
          api.get("/dashboard"),
          api.get("/heures"),
          api.get("/departements"),
        ]);
        setStats(resStats.data);
        setHeures(sortHeuresDesc(resHeures.data));
        setDepartements(resDepts.data);
      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      }
    }
    fetchStats();
  }, []);

  const heuresComplementaires =
    stats?.etatPaiement?.reduce(
      (sum, e) => sum + Number(e.heures_complementaires || 0),
      0,
    ) || 0;

  const recentHeures = heures.slice(0, 8);

  return (
    <Layout>
      {/* ── Header ── */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-1">
          Tableau de bord
        </p>
        <h1
          className="text-3xl font-bold text-blue-950"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Bienvenue,{" "}
          <span style={{ color: "#f5a623" }}>
            {user?.nom || "Administrateur"}
          </span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Aperçu de l'activité académique de votre établissement.
        </p>
      </div>

      {/* ── StatCards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Users}
          label="Enseignants actifs"
          value={stats?.totalEnseignants ?? "—"}
          gradient="from-blue-900/10 to-blue-900/0"
          color="text-blue-900"
        />
        <StatCard
          icon={Clock}
          label="Heures cumulées"
          value={stats?.totalHeures ? `${stats.totalHeures} h` : "— h"}
          gradient="from-amber-500/10 to-amber-500/0"
          color="text-amber-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="En dépassement"
          value={stats?.enseignantsEnDepassement?.length ?? "—"}
          gradient="from-rose-500/10 to-rose-500/0"
          color="text-rose-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Heures complémentaires"
          value={`${heuresComplementaires} h`}
          gradient="from-emerald-500/10 to-emerald-500/0"
          color="text-emerald-700"
        />
      </div>

      {/* ── Cartes selon rôle ── */}
      <div
        className={`grid grid-cols-1 gap-6 mb-6 ${
          isAdmin
            ? "lg:grid-cols-3"
            : isRH
              ? "lg:grid-cols-2"
              : "lg:grid-cols-1"
        }`}
      >
        {/* ── Heures par type — tous les rôles ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2
            className="text-lg font-bold text-blue-950 mb-1"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Heures par type
          </h2>
          <p className="text-sm text-gray-400 mb-6">Répartition CM / TD / TP</p>
          <div className="space-y-4">
            {stats?.heuresParType?.length ? (
              stats.heuresParType.map((h, i) => {
                const max = Math.max(
                  ...stats.heuresParType.map((x) => Number(x.total)),
                );
                const pct = Math.round((Number(h.total) / max) * 100);
                const colors = { CM: "#f5a623", TD: "#1a47cc", TP: "#10b981" };
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-blue-950">
                        {h.type_heure}
                      </span>
                      <span className="font-bold text-gray-700">
                        {h.total} h
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: colors[h.type_heure] || "#6366f1",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                Aucune donnée
              </p>
            )}
          </div>
        </div>

        {/* ── Départements — Admin uniquement ── */}
        {isAdmin && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2
              className="text-lg font-bold text-blue-950 mb-1"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Départements
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Charge horaire par département
            </p>
            <div className="space-y-4">
              {departements.length ? (
                departements.map((d, i) => {
                  const found = stats?.heuresParDepartement?.find(
                    (h) => h.departement === d.nom,
                  );
                  const total = found ? Number(found.total) : 0;
                  const max = Math.max(
                    ...(stats?.heuresParDepartement?.map((x) =>
                      Number(x.total),
                    ) || [1]),
                  );
                  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
                  const colors = [
                    "#f5a623",
                    "#1a47cc",
                    "#6366f1",
                    "#10b981",
                    "#ef4444",
                  ];
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-blue-950">
                          {d.nom}
                        </span>
                        <span className="font-bold text-gray-700">
                          {total} h
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct || 2}%`,
                            background: colors[i % colors.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  Aucune donnée
                </p>
              )}
            </div>
            <button
              onClick={() => navigate("/parametres")}
              className="mt-6 w-full text-sm font-semibold text-blue-700 hover:text-amber-500 transition flex items-center justify-center gap-1 group cursor-pointer"
            >
              Gérer les départements
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        )}

        {/* ── Dépassements — Admin et RH uniquement ── */}
        {!isEnseignant && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2
              className="text-lg font-bold text-blue-950 mb-1"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Dépassements
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Enseignants au-delà du contractuel
            </p>
            <div className="space-y-3">
              {stats?.enseignantsEnDepassement?.length ? (
                stats.enseignantsEnDepassement.map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100"
                  >
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #1a3a6b, #0f2d5e)",
                      }}
                    >
                      {e.prenom?.[0]}
                      {e.nom?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-blue-950 text-sm truncate">
                        {e.prenom} {e.nom}
                      </p>
                      <p className="text-xs text-gray-400">
                        {e.total_heures}h / {e.heures_contractuelles}h
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600 whitespace-nowrap">
                      ⚠ Dépassement
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-400 text-sm">Aucun dépassement</p>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/etats")}
              className="mt-4 w-full text-sm font-semibold text-blue-700 hover:text-amber-500 transition flex items-center justify-center gap-1 group cursor-pointer"
            >
              Voir les états de paiement
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        )}
      </div>

      {/* ── Déclarations récentes ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-lg font-bold text-blue-950"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Déclarations récentes
            </h2>
            <p className="text-sm text-gray-400">Dernières heures soumises</p>
          </div>
          {!isEnseignant && (
            <button
              onClick={() => navigate("/heures")}
              className="flex items-center gap-2 px-4 py-2 border-2 border-yellow-400 rounded-xl text-sm hover:bg-gray-100 transition-colors"
            >
              Tout voir
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100">
                <th className="pb-3 text-left font-semibold">Enseignant</th>
                <th className="pb-3 text-left font-semibold">Matière</th>
                <th className="pb-3 text-left font-semibold">Type</th>
                <th className="pb-3 text-left font-semibold">Durée</th>
                <th className="pb-3 text-left font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentHeures.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    Aucune déclaration
                  </td>
                </tr>
              )}
              {recentHeures.map((h, i) => (
                <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #1a3a6b, #0f2d5e)",
                        }}
                      >
                        {h.enseignant_prenom?.[0]}
                        {h.enseignant_nom?.[0]}
                      </div>
                      <span className="font-medium text-blue-950">
                        {h.enseignant_prenom} {h.enseignant_nom}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500">{h.matiere}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadge(h.type_heure)}`}
                    >
                      {h.type_heure}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-blue-950">
                    {h.duree}h
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statutBadge(h.statut)}`}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
