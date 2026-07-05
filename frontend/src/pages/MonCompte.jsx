import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Layout from "../composants/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function MonCompte() {
  const { user } = useAuth();
  const role_id = Number(user?.role_id);

  const roleConfig = {
    1: { label: "Administrateur", bg: "bg-blue-100", text: "text-blue-700" },
    2: {
      label: "Ressources Humaines",
      bg: "bg-purple-100",
      text: "text-purple-700",
    },
    3: {
      label: "Enseignant",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
    },
  };
  const role = roleConfig[role_id] || roleConfig[1];

  const [form, setForm] = useState({
    ancien_mdp: "",
    nouveau_mdp: "",
    confirmer_mdp: "",
  });
  const [showAncien, setShowAncien] = useState(false);
  const [showNouveau, setShowNouveau] = useState(false);
  const [showConfirmer, setShowConfirmer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (form.nouveau_mdp !== form.confirmer_mdp) {
      setError("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (form.nouveau_mdp.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/changer-mdp", {
        ancien_mdp: form.ancien_mdp,
        nouveau_mdp: form.nouveau_mdp,
      });
      setSuccess(true);
      setForm({ ancien_mdp: "", nouveau_mdp: "", confirmer_mdp: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors du changement de mot de passe.",
      );
    } finally {
      setLoading(false);
    }
  }

  const initiales = `${user?.nom?.[0] || ""}`.toUpperCase();

  const passwordField = (label, key, show, setShow) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type={show ? "text" : "password"}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          required
          className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white"
          onFocus={(e) => (e.target.style.borderColor = "#1a3a6b")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
          Paramètres
        </p>
        <h1
          className="text-3xl font-bold text-blue-950 m-0"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Mon <span className="text-yellow-500">compte</span>
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Consultez vos informations et modifiez votre mot de passe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        {/* ── Carte identité ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, #f5a623 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Avatar */}
          <div className="px-6 pb-6 -mt-10">
            <div
              className="h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl border-4 border-white mb-4"
              style={{
                background: "linear-gradient(135deg, #f5a623, #f0850a)",
              }}
            >
              {initiales || <User className="w-8 h-8" />}
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-bold text-blue-950"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {user?.nom}
              </h2>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${role.bg} ${role.text}`}
              >
                {role.label}
              </span>
            </div>

            {/* Infos */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                  <User className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Nom
                  </p>
                  <p className="text-sm font-semibold text-blue-950">
                    {user?.nom || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                  <Mail className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-blue-950 truncate">
                    {user?.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Rôle
                  </p>
                  <p className="text-sm font-semibold text-blue-950">
                    {role.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Changer mot de passe ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center shrink-0">
              <Lock className="w-[18px] h-[18px] text-yellow-400" />
            </div>
            <div>
              <h3
                className="m-0 text-base font-bold text-blue-950"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Changer le mot de passe
              </h3>
              <p className="m-0 text-xs text-slate-400">
                Choisissez un mot de passe sécurisé.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Messages */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Mot de passe modifié avec succès !
              </div>
            )}

            {passwordField(
              "Ancien mot de passe",
              "ancien_mdp",
              showAncien,
              setShowAncien,
            )}
            {passwordField(
              "Nouveau mot de passe",
              "nouveau_mdp",
              showNouveau,
              setShowNouveau,
            )}
            {passwordField(
              "Confirmer le nouveau mot de passe",
              "confirmer_mdp",
              showConfirmer,
              setShowConfirmer,
            )}

            {/* Règles */}
            <div className="px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-600 font-medium">
                Le mot de passe doit contenir au moins 6 caractères.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #f5a623, #f0850a)",
              }}
            >
              {loading ? "Modification en cours…" : "Modifier le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default MonCompte;
