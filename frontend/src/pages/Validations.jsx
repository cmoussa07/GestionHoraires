import React, { useEffect, useState } from "react";
import {
  Check,
  X,
  CheckSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

import Layout from "../composants/Layout";
import api from "../services/api";
import { StatCard } from "../composants/StatCard";
import { typeBadge, statutBadge, sortHeuresDesc } from "../lib/utils";

function Validations() {
  const [heures, setHeures] = useState([]);
  const [enseignants, setEnseignants] = useState([]);

  useEffect(() => {
    fetchHeures();
    fetchEnseignants();
  }, []);

  async function fetchHeures() {
    try {
      const res = await api.get("/heures");
      setHeures(sortHeuresDesc(res.data));
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchEnseignants() {
    try {
      const res = await api.get("/enseignants");
      setEnseignants(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleValider(id) {
    try {
      await api.put(`/heures/${id}`, { statut: "validé" });
      fetchHeures();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRefuser(id) {
    try {
      await api.put(`/heures/${id}`, { statut: "refusé" });
      fetchHeures();
    } catch (error) {
      console.error(error);
    }
  }

  const enAttente = heures.filter((h) => h.statut === "en attente").length;
  const validees = heures.filter((h) => h.statut === "validé").length;
  const refusees = heures.filter((h) => h.statut === "refusé").length;

  return (
    <Layout>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-1">
            RH
          </p>
          <h1
            className="text-3xl font-bold text-blue-950"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Validation des <span style={{ color: "#f5a623" }}>heures</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Saisie et validation des heures effectuées
          </p>
        </div>
      </div>

      {/* ── Stats rapides ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Clock}
          label="En attente"
          value={enAttente}
          gradient="from-gray-500/10 to-gray-500/0"
          color="text-gray-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Validées"
          value={validees}
          gradient="from-emerald-500/10 to-emerald-500/0"
          color="text-emerald-700"
        />
        <StatCard
          icon={XCircle}
          label="Refusées"
          value={refusees}
          gradient="from-rose-500/10 to-rose-500/0"
          color="text-rose-600"
        />
      </div>

      {/* ── Tableau ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 shadow">
            <CheckSquare className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2
              className="text-base font-semibold text-blue-950"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Liste des déclarations
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {heures.length} heure{heures.length > 1 ? "s" : ""} au total
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                {[
                  "Enseignant",
                  "Matière",
                  "Date",
                  "Type",
                  "Durée",
                  "Complémentaire",
                  "Statut",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heures.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Aucune heure enregistrée
                  </td>
                </tr>
              )}
              {heures.map((h) => (
                <tr
                  key={h.idheure}
                  className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                >
                  {/* Enseignant */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #1a3a6b, #0f2d5e)",
                        }}
                      >
                        {h.enseignant_prenom?.[0]}
                        {h.enseignant_nom?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-blue-950 whitespace-nowrap">
                          {h.enseignant_prenom} {h.enseignant_nom}
                        </p>
                        <p className="text-xs text-gray-400">Enseignant</p>
                      </div>
                    </div>
                  </td>

                  {/* Matière */}
                  <td className="px-4 py-4 font-medium text-gray-700">
                    {h.matiere}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(h.date_cours).toLocaleDateString("fr-FR")}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadge(h.type_heure)}`}
                    >
                      {h.type_heure}
                    </span>
                  </td>

                  {/* Durée */}
                  <td className="px-4 py-4 font-semibold text-blue-950">
                    {h.duree}h
                  </td>

                  {/* Complémentaire */}
                  <td className="px-4 py-4">
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

                  {/* Statut */}
                  <td className="px-4 py-4">
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

                  {/* Actions */}
                  <td className="px-4 py-4">
                    {h.statut === "validé" || h.statut === "refusé" ? (
                      <span className="text-xs text-gray-400 italic">
                        Traité
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRefuser(h.idheure)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all whitespace-nowrap"
                        >
                          <X className="h-3 w-3" /> Refuser
                        </button>
                        <button
                          onClick={() => handleValider(h.idheure)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-xs font-semibold hover:brightness-90 transition-all whitespace-nowrap shadow"
                          style={{
                            background:
                              "linear-gradient(135deg, #f5a623, #f0850a)",
                          }}
                        >
                          <Check className="h-3 w-3" /> Valider
                        </button>
                      </div>
                    )}
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

export default Validations;
