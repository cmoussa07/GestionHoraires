import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Users,
  UserCheck,
  UserMinus,
  TrendingUp,
  X,
  Filter,
  Clock,
} from "lucide-react";
import Layout from "../composants/Layout";
import api from "../services/api";
import { StatCard } from "../composants/StatCard";

/* ─── helpers ─────────────────────────────────────── */
function initiales(prenom = "", nom = "") {
  return `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase();
}

const AVATAR_COLORS = [
  { bg: "#1a3a6b" },
  { bg: "#0f2d5e" },
  { bg: "#1e4d8c" },
  { bg: "#163360" },
  { bg: "#0c2550" },
];

function avatarColor(name = "") {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

const EMPTY_FORM = {
  nom: "",
  prenom: "",
  email: "",
  tel: "",
  grade_id: "",
  departement_id: "",
  statut: "Permanent",
  heures_contractuelles: "",
};

/* ─── Main Page ────────────────────────────────────── */
function Enseignants() {
  const [enseignants, setEnseignants] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [grades, setGrades] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchEnseignants(), fetchGrades(), fetchDepartements()]);
  }, []);

  async function fetchEnseignants() {
    try {
      setLoading(true);
      const res = await api.get("/enseignants");
      setEnseignants(res.data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchGrades() {
    try {
      const res = await api.get("/grades");
      setGrades(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchDepartements() {
    try {
      const res = await api.get("/departements");
      setDepartements(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/enseignants/${editId}`, formData);
      } else {
        const response = await api.post("/enseignants", formData);
        if (response.data.credentials) {
          const { email, mdp_defaut } = response.data.credentials;
          window.alert(
            `✅ Enseignant créé avec succès !\n\n` +
              `📧 Email : ${email}\n` +
              `🔑 Mot de passe : ${mdp_defaut}\n\n` +
              `⚠️ Communiquez ces informations à l'enseignant.`,
          );
        }
      }
      closeForm();
      fetchEnseignants();
    } catch (err) {
      console.error("Erreur:", err);
      alert(err.response?.data?.message || "Une erreur est survenue.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Confirmer la suppression de cet enseignant ?")) return;
    try {
      await api.delete(`/enseignants/${id}`);
      fetchEnseignants();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  }

  function handleEdit(e) {
    setEditId(e.idenseignant);
    setFormData({
      nom: e.nom,
      prenom: e.prenom,
      email: e.email,
      tel: e.tel || "",
      grade_id: e.grade_id,
      departement_id: e.departement_id,
      statut: e.statut,
      heures_contractuelles: e.heures_contractuelles,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setFormData(EMPTY_FORM);
  }

  const filtered = enseignants.filter((e) => {
    const matchSearch =
      `${e.prenom} ${e.nom}`.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.departement?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === "tous" || e.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const permanents = enseignants.filter((e) => e.statut === "Permanent").length;
  const vacataires = enseignants.filter((e) => e.statut === "Vacataire").length;

  return (
    <Layout>
      {/* ── Header ── */}
      <div className="mb-6">
        <p
          className="text-xs uppercase tracking-widest font-semibold mb-1"
          style={{ color: "#f5a623" }}
        >
          Corps Enseignant
        </p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-3xl font-bold text-blue-950"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Gestion des <span style={{ color: "#f5a623" }}>Enseignants</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {enseignants.length} enseignant{enseignants.length > 1 ? "s" : ""}{" "}
              répartis dans vos départements
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold shadow-md hover:brightness-90 transition-all"
            style={{ background: "linear-gradient(135deg, #f5a623, #f0850a)" }}
          >
            <Plus className="h-4 w-4" /> Nouvel enseignant
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          value={enseignants.length}
          label="Total"
          gradient="from-blue-900/10 to-blue-900/0"
          color="text-blue-900"
        />
        <StatCard
          icon={UserCheck}
          value={permanents}
          label="Permanents"
          gradient="from-emerald-500/10 to-emerald-500/0"
          color="text-emerald-700"
        />
        <StatCard
          icon={UserMinus}
          value={vacataires}
          label="Vacataires"
          gradient="from-amber-500/10 to-amber-500/0"
          color="text-amber-600"
        />
        <StatCard
          icon={TrendingUp}
          value={filtered.length}
          label="Résultats"
          gradient="from-orange-500/10 to-orange-500/0"
          color="text-orange-500"
        />
      </div>

      {/* ── Search + Filtres ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 mb-6 flex items-center gap-4 flex-wrap">
        <div className="flex-1 flex items-center gap-3 min-w-[200px]">
          <Search className="h-4 w-4 text-gray-300 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher un enseignant, département, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none border border-gray-300 rounded-lg py-2 px-3 bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X className="h-4 w-4 text-gray-300 hover:text-gray-500" />
            </button>
          )}
        </div>
        <div className="h-6 w-px bg-gray-100" />
        {/* ✅ Filtre par statut fonctionnel */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {["tous", "Permanent", "Vacataire"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatut(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatut === s
                  ? "bg-blue-950 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {s === "tous" ? "Tous" : s}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1a3a6b] mb-4">
            {editId ? "Modifier enseignant" : "Ajouter un enseignant"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Nom
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Prénom
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Téléphone
              </label>
              <input
                type="text"
                value={formData.tel}
                onChange={(e) =>
                  setFormData({ ...formData, tel: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Grade
              </label>
              <select
                value={formData.grade_id}
                onChange={(e) =>
                  setFormData({ ...formData, grade_id: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl"
              >
                <option value="">Sélectionner</option>
                {grades.map((g) => (
                  <option key={g.idgrade} value={g.idgrade}>
                    {g.libelle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Département
              </label>
              <select
                value={formData.departement_id}
                onChange={(e) =>
                  setFormData({ ...formData, departement_id: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl"
              >
                <option value="">Sélectionner</option>
                {departements.map((d) => (
                  <option key={d.iddepartement} value={d.iddepartement}>
                    {d.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Statut
              </label>
              <select
                value={formData.statut}
                onChange={(e) =>
                  setFormData({ ...formData, statut: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl"
              >
                <option>Permanent</option>
                <option>Vacataire</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Heures contractuelles
              </label>
              <input
                type="number"
                value={formData.heures_contractuelles}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heures_contractuelles: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl"
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 border border-gray-200 rounded-xl"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-4 py-2 text-white rounded-xl font-semibold"
                style={{
                  background: "linear-gradient(135deg, #f5a623, #f0850a)",
                }}
              >
                {editId ? "Modifier" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 shadow">
            <Users className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h2
              className="text-base font-semibold text-blue-950"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Liste des enseignants
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Profils, charges horaires et coordonnées.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {[
                  "Nom",
                  "Email",
                  "Grade",
                  "Département",
                  "H. Contractuelles",
                  "Statut",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400 first:px-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-gray-300 text-sm"
                  >
                    Chargement…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <Users className="h-10 w-10" />
                      <p className="text-sm font-medium">
                        Aucun enseignant trouvé
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((e) => {
                  const colors = avatarColor(e.nom);
                  return (
                    <tr
                      key={e.idenseignant}
                      className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-xs text-white font-bold shrink-0"
                            style={{ background: colors.bg }}
                          >
                            {initiales(e.prenom, e.nom)}
                          </div>
                          <div className="text-sm font-semibold text-gray-800">
                            {e.prenom} {e.nom}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {e.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                        {e.grade || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {e.departement || "—"}
                      </td>
                      {/* ✅ Colonne heures contractuelles ajoutée */}
                      <td className="px-4 py-4 text-sm text-gray-600 font-semibold tabular-nums">
                        {e.heures_contractuelles
                          ? `${e.heures_contractuelles}h`
                          : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            e.statut === "Permanent"
                              ? "bg-green-50 text-green-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              background:
                                e.statut === "Permanent"
                                  ? "#22c55e"
                                  : "#f59e0b",
                            }}
                          />
                          {e.statut}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(e)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(e.idenseignant)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {filtered.length} enseignant{filtered.length > 1 ? "s" : ""}{" "}
              affiché{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Enseignants;
