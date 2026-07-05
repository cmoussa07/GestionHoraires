import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../composants/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Clock,
  Edit,
  Save,
  X,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { typeBadge, statutBadge, sortHeuresDesc } from "../lib/utils";

function Heures() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [heures, setHeures] = useState([]);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [expandedObs, setExpandedObs] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    enseignant_id: "",
    matiere_id: "",
    date_cours: "",
    type_heure: "CM",
    duree: "",
    salle: "",
    observations: "",
  });

  useEffect(() => {
    if (user?.role_id === "3" || user?.role_id === 3) navigate("/mes-heures");
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role_id === "3" || user.role_id === 3) return;
    async function fetchData() {
      try {
        const [resE, resH, resM] = await Promise.all([
          api.get("/enseignants"),
          api.get("/heures"),
          api.get("/matieres"),
        ]);
        setEnseignants(resE.data);
        setHeures(sortHeuresDesc(resH.data));
        setMatieres(resM.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [user]);

  const heuresFiltered = selectedEnseignant
    ? heures.filter((h) => h.enseignant_id === selectedEnseignant)
    : heures;

  function handleEditStart(heure) {
    setEditingId(heure.idheure);
    setEditFormData({ ...heure });
  }

  async function handleEditSave() {
    try {
      await api.put(`/heures/${editingId}`, editFormData);
      const res = await api.get("/heures");
      setHeures(sortHeuresDesc(res.data));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/heures", formData);
      const res = await api.get("/heures");
      setHeures(sortHeuresDesc(res.data));
      setFormData({
        enseignant_id: "",
        matiere_id: "",
        date_cours: "",
        type_heure: "CM",
        duree: "",
        salle: "",
        observations: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  }

  const isRH = user?.role_id === "2" || user?.role_id === 2;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
              {isRH ? "Service RH" : "Administration"}
            </p>
            <h1
              className="text-3xl font-bold text-blue-950 m-0"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Heures <span className="text-yellow-500">Déclarées</span>
            </h1>
            <p className="text-[13px] text-slate-400 mt-1">
              {isRH
                ? "Consultez, corrigez et pré-validez les heures des enseignants."
                : "Vue globale des heures, validation finale et export vers la paie."}
            </p>
          </div>
          {isRH && (
            <button
              onClick={() => setShowForm((p) => !p)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-none cursor-pointer bg-amber-500 text-white text-sm font-semibold hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" /> Nouvelle déclaration
            </button>
          )}
        </div>

        {/* ── Formulaire ── */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h2
              className="text-lg font-bold text-blue-950 mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Nouvelle déclaration d'heures
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Enseignant */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Enseignant
                </label>
                <select
                  value={formData.enseignant_id}
                  onChange={(e) =>
                    setFormData({ ...formData, enseignant_id: e.target.value })
                  }
                  required
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Sélectionner</option>
                  {enseignants.map((e) => (
                    <option key={e.idenseignant} value={e.idenseignant}>
                      {e.prenom} {e.nom}
                    </option>
                  ))}
                </select>
              </div>
              {/* Matière */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Matière
                </label>
                <select
                  value={formData.matiere_id}
                  onChange={(e) =>
                    setFormData({ ...formData, matiere_id: e.target.value })
                  }
                  required
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Sélectionner</option>
                  {matieres.map((m) => (
                    <option key={m.idmatiere} value={m.idmatiere}>
                      {m.intitule}
                    </option>
                  ))}
                </select>
              </div>
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Date du cours
                </label>
                <input
                  type="date"
                  value={formData.date_cours}
                  onChange={(e) =>
                    setFormData({ ...formData, date_cours: e.target.value })
                  }
                  required
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>
              {/* Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Type d'heure
                </label>
                <select
                  value={formData.type_heure}
                  onChange={(e) =>
                    setFormData({ ...formData, type_heure: e.target.value })
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="CM">CM — Cours Magistral</option>
                  <option value="TD">TD — Travaux Dirigés</option>
                  <option value="TP">TP — Travaux Pratiques</option>
                </select>
              </div>
              {/* Durée */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Durée (heures)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={formData.duree}
                  onChange={(e) =>
                    setFormData({ ...formData, duree: e.target.value })
                  }
                  required
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>
              {/* Salle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Salle
                </label>
                <input
                  type="text"
                  value={formData.salle}
                  placeholder="ex: Amphi A"
                  onChange={(e) =>
                    setFormData({ ...formData, salle: e.target.value })
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>
              {/* Observations */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Observations
                </label>
                <textarea
                  value={formData.observations}
                  rows={2}
                  placeholder="Remarques éventuelles..."
                  onChange={(e) =>
                    setFormData({ ...formData, observations: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white resize-none"
                />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:brightness-90 shadow"
                  style={{
                    background: "linear-gradient(135deg, #f5a623, #f0850a)",
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Sélecteur enseignant ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Sélectionner un enseignant
          </label>
          <select
            value={selectedEnseignant || ""}
            onChange={(e) =>
              setSelectedEnseignant(
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">-- Tous les enseignants --</option>
            {enseignants.map((e) => (
              <option key={e.idenseignant} value={e.idenseignant}>
                {e.prenom} {e.nom} ({e.grade} - {e.departement})
              </option>
            ))}
          </select>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-[18px] h-[18px] text-yellow-400" />
            </div>
            <div>
              <h3
                className="m-0 text-base font-bold text-blue-950"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {selectedEnseignant
                  ? "Heures de l'enseignant"
                  : "Détails des heures de tous les enseignants"}
              </h3>
              <p className="m-0 text-xs text-slate-400">
                {heuresFiltered.length} enregistrement
                {heuresFiltered.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {[
                    !selectedEnseignant && "Enseignant",
                    "Matière",
                    "Date",
                    "Type",
                    "Durée",
                    "Complémentaire",
                    "Salle",
                    "Observations",
                    isRH && "Éditer",
                    "État",
                  ]
                    .filter(Boolean)
                    .map((col) => (
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
                {heuresFiltered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
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
                  heuresFiltered.map((h) => (
                    <>
                      <tr
                        key={h.idheure}
                        className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${h.statut === "refusé" ? "bg-red-50" : ""}`}
                      >
                        {/* ✅ Utiliser enseignant_nom et enseignant_prenom directement */}
                        {!selectedEnseignant && (
                          <td className="px-6 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                            {h.enseignant_prenom} {h.enseignant_nom}
                          </td>
                        )}

                        {editingId === h.idheure ? (
                          <>
                            <td className="px-6 py-3.5">
                              <span className="text-slate-500 text-xs">
                                {h.matiere}
                              </span>
                            </td>
                            <td className="px-6 py-3.5">
                              <input
                                type="date"
                                value={
                                  editFormData.date_cours
                                    ? new Date(editFormData.date_cours)
                                        .toISOString()
                                        .split("T")[0]
                                    : ""
                                }
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    date_cours: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                              />
                            </td>
                            <td className="px-6 py-3.5">
                              <select
                                value={editFormData.type_heure || "CM"}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    type_heure: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                              >
                                <option>CM</option>
                                <option>TD</option>
                                <option>TP</option>
                              </select>
                            </td>
                            <td className="px-6 py-3.5">
                              <input
                                type="number"
                                value={editFormData.duree || ""}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    duree: Number(e.target.value),
                                  })
                                }
                                className="w-20 px-2 py-1 border border-slate-200 rounded text-xs"
                              />
                            </td>
                            <td className="px-6 py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${h.est_complementaire ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-500"}`}
                              >
                                {h.est_complementaire ? "Oui" : "Non"}
                              </span>
                            </td>
                            <td className="px-6 py-3.5">
                              <input
                                type="text"
                                value={editFormData.salle || ""}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    salle: e.target.value,
                                  })
                                }
                                className="w-20 px-2 py-1 border border-slate-200 rounded text-xs"
                              />
                            </td>
                            <td className="px-6 py-3.5">
                              <input
                                type="text"
                                value={editFormData.observations || ""}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    observations: e.target.value,
                                  })
                                }
                                placeholder="Observations..."
                                className="w-32 px-2 py-1 border border-slate-200 rounded text-xs"
                              />
                            </td>
                            <td className="px-6 py-3.5">
                              <div className="flex gap-1">
                                <button
                                  onClick={handleEditSave}
                                  className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statutBadge(h.statut)}`}
                              >
                                {h.statut || "en attente"}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-3.5 font-semibold text-blue-950">
                              {h.matiere || "—"}
                            </td>
                            <td className="px-6 py-3.5 text-slate-500">
                              {h.date_cours
                                ? new Date(h.date_cours).toLocaleDateString(
                                    "fr-FR",
                                  )
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
                            <td className="px-6 py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${h.est_complementaire ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-500"}`}
                              >
                                {h.est_complementaire ? "Oui" : "Non"}
                              </span>
                            </td>

                            <td className="px-6 py-3.5 text-slate-500">
                              {h.salle || "—"}
                            </td>
                            <td className="px-6 py-3.5">
                              {h.observations ? (
                                <button
                                  onClick={() =>
                                    setExpandedObs(
                                      expandedObs === h.idheure
                                        ? null
                                        : h.idheure,
                                    )
                                  }
                                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  title={h.observations}
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  Voir
                                </button>
                              ) : (
                                <span className="text-slate-300 text-xs">
                                  —
                                </span>
                              )}
                            </td>

                            {isRH && (
                              <td className="px-6 py-3.5">
                                <button
                                  onClick={() => handleEditStart(h)}
                                  className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </td>
                            )}

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
                                {!h.statut && (
                                  <AlertCircle className="w-3.5 h-3.5" />
                                )}
                                {h.statut || "en attente"}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>

                      {expandedObs === h.idheure && h.observations && (
                        <tr className="border-t-0">
                          <td
                            colSpan={isRH ? 10 : 9}
                            className="px-6 pb-3 pt-0"
                          >
                            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                              <MessageSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-800 m-0">
                                {h.observations}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {heuresFiltered.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
              <p className="m-0 text-xs text-slate-400">
                {heuresFiltered.length} heure
                {heuresFiltered.length > 1 ? "s" : ""} affichée
                {heuresFiltered.length > 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Heures;
