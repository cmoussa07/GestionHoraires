import React, { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  Building2,
  GraduationCap,
  Save,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import Layout from "../composants/Layout";
import api from "../services/api";
import { useParametres } from "../context/ParametresContext";

function Parametres() {
  const [departements, setDepartements] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [nomDept, setNomDept] = useState("");
  const [saved, setSaved] = useState(false);
  const [parametres, setParametres] = useState(null);
  const [newAnnee, setNewAnnee] = useState({
    libelle: "",
    date_debut: "",
    date_fin: "",
  });

  useEffect(() => {
    fetchDepartements();
    fetchAnnees();
    fetchParametres();
  }, []);

  async function fetchDepartements() {
    try {
      const res = await api.get("/departements");
      setDepartements(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchAnnees() {
    try {
      const res = await api.get("/parametres/annees");
      setAnnees(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchParametres() {
    try {
      const res = await api.get("/parametres");
      const actif = res.data.find((p) => p.active === 1);
      setParametres(actif || res.data[0]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddDept(e) {
    e.preventDefault();
    try {
      await api.post("/departements", { nom: nomDept });
      setNomDept("");
      fetchDepartements();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddAnnee(e) {
    e.preventDefault();
    try {
      await api.post("/parametres/annees", newAnnee);
      setNewAnnee({ libelle: "", date_debut: "", date_fin: "" });
      fetchAnnees();
      await fetchParametres();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateParametres(e) {
    e.preventDefault();
    try {
      await api.put(`/parametres/${parametres.idparametre}`, {
        equivalent_cm: parametres.equivalent_cm,
        equivalent_td: parametres.equivalent_td,
        equivalent_tp: parametres.equivalent_tp,
        taux_permanent: parametres.taux_permanent,
        taux_vacataire: parametres.taux_vacataire,
      });
      await fetchParametres();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleActivateAnnee(id) {
    try {
      await api.put(`/parametres/annees/${id}/activate`);
      fetchAnnees();
      await fetchParametres();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteDept(id) {
    try {
      await api.delete(`/departements/${id}`);
      fetchDepartements();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  }

  function formatDate(d) {
    return d ? new Date(d).toLocaleDateString("fr-FR") : "—";
  }

  const inputClass =
    "w-full px-3 py-2 rounded-xl bg-slate-50 border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* ── Header ── */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
            Configuration
          </p>
          <h1
            className="text-3xl font-bold text-blue-950 m-0"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Paramètres <span className="text-yellow-500">de la plateforme</span>
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Gérez les années académiques, les équivalences horaires et les
            départements.
          </p>
        </div>

        {/* ── Années académiques ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-[18px] h-[18px] text-yellow-400" />
            </div>
            <div>
              <h3
                className="m-0 text-base font-bold text-blue-950"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Années académiques
              </h3>
              <p className="m-0 text-xs text-slate-400">
                Définir les périodes d'activité de l'université.
              </p>
            </div>
          </div>

          <div className="p-6">
            <form
              onSubmit={handleAddAnnee}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Libellé
                </label>
                <input
                  type="text"
                  placeholder="ex: 2026-2027"
                  value={newAnnee.libelle}
                  onChange={(e) =>
                    setNewAnnee({ ...newAnnee, libelle: e.target.value })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Date début
                </label>
                <input
                  type="date"
                  value={newAnnee.date_debut}
                  onChange={(e) =>
                    setNewAnnee({ ...newAnnee, date_debut: e.target.value })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Date fin
                </label>
                <input
                  type="date"
                  value={newAnnee.date_fin}
                  onChange={(e) =>
                    setNewAnnee({ ...newAnnee, date_fin: e.target.value })
                  }
                  required
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:brightness-110 transition-all border-none cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #f5a623, #f0850a)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une année
                </button>
              </div>
            </form>

            <div className="rounded-xl overflow-hidden border border-slate-100">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    {["Libellé", "Date début", "Date fin", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {annees.map((a) => (
                    <tr
                      key={a.idannee}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-3.5 font-semibold text-blue-950">
                        {a.libelle}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {formatDate(a.date_debut)}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {formatDate(a.date_fin)}
                      </td>
                      <td className="px-6 py-3.5">
                        {a.active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <button
                            onClick={() => handleActivateAnnee(a.idannee)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border-none cursor-pointer"
                          >
                            Activer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Équivalences horaires ── */}
        {parametres && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-[18px] h-[18px] text-yellow-400" />
              </div>
              <div>
                <h3
                  className="m-0 text-base font-bold text-blue-950"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Équivalences horaires — {parametres.annee}
                </h3>
                <p className="m-0 text-xs text-slate-400">
                  Définissez la pondération entre CM, TD et TP pour le calcul
                  des heures.
                </p>
              </div>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleUpdateParametres}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {[
                  {
                    key: "equivalent_cm",
                    label: "1h CM =",
                    badge: "CM",
                    color: "bg-yellow-50",
                    badgeColor: "bg-yellow-100 text-yellow-700",
                    bar: "bg-yellow-400",
                  },
                  {
                    key: "equivalent_td",
                    label: "1h TD =",
                    badge: "TD",
                    color: "bg-blue-50",
                    badgeColor: "bg-blue-100 text-blue-700",
                    bar: "bg-blue-500",
                  },
                  {
                    key: "equivalent_tp",
                    label: "1h TP =",
                    badge: "TP",
                    color: "bg-green-50",
                    badgeColor: "bg-green-100 text-green-700",
                    bar: "bg-green-500",
                  },
                ].map((f) => (
                  <div
                    key={f.key}
                    className={`relative rounded-2xl border border-slate-100 ${f.color} p-4 overflow-hidden`}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 ${f.bar} rounded-t-2xl`}
                    />
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {f.label}
                      </label>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${f.badgeColor}`}
                      >
                        {f.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={parametres[f.key]}
                        onChange={(e) =>
                          setParametres({
                            ...parametres,
                            [f.key]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-100 text-lg font-bold text-blue-950 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <span className="text-sm text-slate-400 font-medium whitespace-nowrap">
                        h équiv.
                      </span>
                    </div>
                  </div>
                ))}
                {/* Taux par statut */}
                {[
                  {
                    key: "taux_permanent",
                    label: "Taux Permanent",
                    badge: "FCFA/h",
                    color: "bg-blue-50",
                    badgeColor: "bg-blue-100 text-blue-700",
                    bar: "bg-blue-600",
                  },
                  {
                    key: "taux_vacataire",
                    label: "Taux Vacataire",
                    badge: "FCFA/h",
                    color: "bg-amber-50",
                    badgeColor: "bg-amber-100 text-amber-700",
                    bar: "bg-amber-400",
                  },
                ].map((f) => (
                  <div
                    key={f.key}
                    className={`relative rounded-2xl border border-slate-100 ${f.color} p-4 overflow-hidden`}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 ${f.bar} rounded-t-2xl`}
                    />
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {f.label}
                      </label>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${f.badgeColor}`}
                      >
                        {f.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="500"
                        value={parametres[f.key] || ""}
                        onChange={(e) =>
                          setParametres({
                            ...parametres,
                            [f.key]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-100 text-lg font-bold text-blue-950 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <span className="text-sm text-slate-400 font-medium whitespace-nowrap">
                        FCFA
                      </span>
                    </div>
                  </div>
                ))}
                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:brightness-110 transition-all border-none cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #f5a623, #f0850a)",
                    }}
                  >
                    <Save className="w-4 h-4" />{" "}
                    {saved ? "✓ Enregistré !" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Départements ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="w-[18px] h-[18px] text-yellow-400" />
            </div>
            <div>
              <h3
                className="m-0 text-base font-bold text-blue-950"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Gestion des départements
              </h3>
              <p className="m-0 text-xs text-slate-400">
                {departements.length} département
                {departements.length > 1 ? "s" : ""} actif
                {departements.length > 1 ? "s" : ""}.
              </p>
            </div>
          </div>

          <div className="p-6">
            <form
              onSubmit={handleAddDept}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <input
                type="text"
                value={nomDept}
                onChange={(e) => setNomDept(e.target.value)}
                placeholder="Nom du département"
                required
                className={`flex-1 ${inputClass}`}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:brightness-110 transition-all border-none cursor-pointer shrink-0"
                style={{
                  background: "linear-gradient(135deg, #f5a623, #f0850a)",
                }}
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </form>

            {departements.length === 0 ? (
              <div className="py-12 text-center text-slate-300">
                <GraduationCap className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm font-medium">Aucun département</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {departements.map((d) => (
                  <div
                    key={d.iddepartement}
                    className="group flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-[18px] h-[18px] text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="m-0 font-semibold text-blue-950 truncate">
                        {d.nom}
                      </p>
                      <p className="m-0 text-[11px] text-slate-400 uppercase tracking-wider">
                        Département
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDept(d.iddepartement)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-all border-none cursor-pointer bg-transparent"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Parametres;
