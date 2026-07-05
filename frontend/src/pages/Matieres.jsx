import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  GraduationCap,
  Layers,
} from "lucide-react";
import Layout from "../composants/Layout";
import api from "../services/api";
import { StatCard } from "../composants/StatCard";
import { niveauBadge } from "../lib/utils";

function Matieres() {
  const [matieres, setMatieres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    intitule: "",
    filiere: "",
    niveau: "L1",
    volume_horaireprevu: "",
  });

  useEffect(() => {
    fetchMatieres();
  }, []);

  async function fetchMatieres() {
    try {
      const response = await api.get("/matieres");
      setMatieres(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/matieres/${editId}`, formData);
      } else {
        await api.post("/matieres", formData);
      }
      setShowForm(false);
      setEditId(null);
      setFormData({
        intitule: "",
        filiere: "",
        niveau: "L1",
        volume_horaireprevu: "",
      });
      fetchMatieres();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Confirmer la suppression ?")) {
      await api.delete(`/matieres/${id}`);
      fetchMatieres();
    }
  }

  function handleEdit(matiere) {
    setEditId(matiere.idmatiere);
    setFormData({
      intitule: matiere.intitule,
      filiere: matiere.filiere,
      niveau: matiere.niveau,
      volume_horaireprevu: matiere.volume_horaireprevu,
    });
    setShowForm(true);
  }

  return (
    <Layout>
      {/* ─── HEADER ─── */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest font-semibold text-[#f5a623]">
          Gestion académique
        </p>

        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1
              className="text-3xl font-bold text-[#1a3a6b]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Gestion des <span className="text-[#f5a623]">Matières</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {matieres.length} matières enregistrées
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
            <Plus className="h-4 w-4" />
            Ajouter matière
          </button>
        </div>
      </div>

      {/* ─── STATS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={BookOpen}
          label="Total matières"
          value={matieres.length}
          gradient="from-blue-900/10 to-blue-900/0"
          color="text-blue-900"
        />
        <StatCard
          icon={GraduationCap}
          label="Licence"
          value={matieres.filter((m) => m.niveau?.startsWith("L")).length}
          gradient="from-emerald-500/10 to-emerald-500/0"
          color="text-emerald-700"
        />
        <StatCard
          icon={Layers}
          label="Master"
          value={matieres.filter((m) => m.niveau?.startsWith("M")).length}
          gradient="from-amber-500/10 to-amber-500/0"
          color="text-amber-600"
        />
      </div>

      {/* ─── FORM ─── */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1a3a6b] mb-4">
            {editId ? "Modifier la matière" : "Ajouter une matière"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {["intitule", "filiere"].map((key) => (
              <div key={key}>
                <label className="text-xs uppercase text-gray-400 font-semibold">
                  {key}
                </label>
                <input
                  type="text"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]"
                />
              </div>
            ))}

            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Niveau
              </label>
              <select
                value={formData.niveau}
                onChange={(e) =>
                  setFormData({ ...formData, niveau: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
              >
                <option>L1</option>
                <option>L2</option>
                <option>L3</option>
                <option>M1</option>
                <option>M2</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase text-gray-400 font-semibold">
                Volume horaire
              </label>
              <input
                type="number"
                value={formData.volume_horaireprevu}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    volume_horaireprevu: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-xl text-sm font-semibold"
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

      {/* ─── TABLE ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 shadow">
            <BookOpen className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2
              className="text-base font-semibold text-blue-950"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Liste des matières
            </h2>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Intitulé</th>
              <th className="px-4 py-3 text-left">Filière</th>
              <th className="px-4 py-3 text-left">Niveau</th>
              <th className="px-4 py-3 text-left">Volume</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {matieres.map((m) => (
              <tr key={m.idmatiere} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#1a3a6b]">
                  {m.intitule}
                </td>
                <td className="px-4 py-3 text-gray-600">{m.filiere}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${niveauBadge(m.niveau)}`}
                  >
                    {m.niveau}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {m.volume_horaireprevu}h
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.idmatiere)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}

            {matieres.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  Aucune matière trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Matieres;
