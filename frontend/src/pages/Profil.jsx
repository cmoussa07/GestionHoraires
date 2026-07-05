import React, { useEffect, useState } from "react";
import Layout from "../composants/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FileDown,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  User,
  CheckCircle2,
  GraduationCap,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { sortHeuresDesc } from "../lib/utils";
import { exportFicheEnseignantPDF } from "../lib/pdfutils";

/* ─── Skeleton loader ─────────────────────────────── */
function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
  );
}

function ProfilSkeleton() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <Skeleton className="h-36 rounded-none" />
          <div className="px-6 pb-6 pt-4 flex gap-4">
            <Skeleton className="h-28 w-28 rounded-2xl shrink-0" />
            <div className="flex flex-col gap-2 flex-1 pt-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    </Layout>
  );
}

/* ─── Composant info ligne ────────────────────────── */
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
        <Icon className="w-4 h-4 text-blue-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="m-0 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
          {label}
        </p>
        <p className="m-0 font-medium text-blue-950 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

/* ─── Composant info grille ───────────────────────── */
function InfoGrid({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
      <p className="m-0 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
        {label}
      </p>
      <p className="m-0 font-semibold text-blue-950 mt-1">{value || "—"}</p>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────── */
function Profil() {
  const { user } = useAuth();
  const [enseignant, setEnseignant] = useState(null);
  const [stats, setStats] = useState(null);
  const [heures, setHeures] = useState([]);
  const [matieresEnseignees, setMatieresEnseignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const [form, setForm] = useState({
    ancien_mdp: "",
    nouveau_mdp: "",
    confirmer_mdp: "",
  });

  const [showAncien, setShowAncien] = useState(false);
  const [showNouveau, setShowNouveau] = useState(false);
  const [showConfirmer, setShowConfirmer] = useState(false);

  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    if (!user?.enseignant_id) return;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [resEns, resStats, resHeures] = await Promise.all([
          api.get(`/enseignants/${user.enseignant_id}`),
          api.get(`/dashboard/enseignant/${user.enseignant_id}`),
          api.get(`/heures/enseignant/${user.enseignant_id}`),
        ]);
        setEnseignant(resEns.data);
        setStats(resStats.data);
        setHeures(sortHeuresDesc(resHeures.data));
        const matieresEnseignees = [
          ...new Set(resHeures.data.map((h) => h.matiere).filter(Boolean)),
        ];
        setMatieresEnseignees(matieresEnseignees);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données du profil.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  async function handleExportPDF() {
    if (!enseignant || !stats) return;
    setExportLoading(true);
    try {
      exportFicheEnseignantPDF({
        enseignant,
        stats,
        heures,
        matieres: matieresEnseignees,
      });
    } finally {
      setExportLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();

    setPwdError("");
    setPwdSuccess(false);

    if (form.nouveau_mdp !== form.confirmer_mdp) {
      setPwdError("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (form.nouveau_mdp.length < 6) {
      setPwdError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setPwdLoading(true);

    try {
      await api.put("/auth/changer-mdp", {
        ancien_mdp: form.ancien_mdp,
        nouveau_mdp: form.nouveau_mdp,
      });

      setPwdSuccess(true);

      setForm({
        ancien_mdp: "",
        nouveau_mdp: "",
        confirmer_mdp: "",
      });
    } catch (err) {
      setPwdError(
        err.response?.data?.message ||
          "Erreur lors du changement de mot de passe.",
      );
    } finally {
      setPwdLoading(false);
    }
  }

  // ── États de chargement / erreur ──
  if (loading) return <ProfilSkeleton />;

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-sm font-medium text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-950 text-white hover:brightness-110 transition"
          >
            Réessayer
          </button>
        </div>
      </Layout>
    );
  }

  if (!enseignant) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
          Profil introuvable.
        </div>
      </Layout>
    );
  }

  const nomAffiche = enseignant?.nom || user?.nom || "—";
  const prenomAffiche = enseignant?.prenom || "";
  const initials =
    `${prenomAffiche?.[0] ?? ""}${nomAffiche?.[0] ?? ""}`.toUpperCase();

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
          className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Espace enseignant
            </p>
            <h1
              className="text-3xl font-bold text-blue-950 m-0"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Mon <span className="text-yellow-500">profil</span>
            </h1>
            <p className="text-[13px] text-slate-400 mt-1">
              Consultez et exportez votre fiche personnelle.
            </p>
          </div>
          <button
            onClick={handleExportPDF}
            disabled={exportLoading}
            style={{
              background: "linear-gradient(135deg, #f5a623, #f0850a)",
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:brightness-110 transition-all border-none cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FileDown className="w-4 h-4" />
            {exportLoading ? "Génération…" : "Télécharger ma fiche"}
          </button>
        </div>

        {/* ── Banner + Avatar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-36 bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 relative">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 50%, #f5a623 0%, transparent 50%), radial-gradient(circle at 85% 20%, #fbbf24 0%, transparent 40%)",
              }}
            />
            <div className="absolute right-6 top-4 opacity-10">
              <GraduationCap className="w-24 h-24 text-white" />
            </div>
          </div>
          <div className="px-6 pb-6 -mt-14 flex flex-col md:flex-row md:items-end gap-4">
            <div
              className="h-28 w-28 rounded-2xl flex items-center justify-center font-bold text-4xl text-white shadow-xl border-4 border-white shrink-0"
              style={{
                background: "linear-gradient(135deg, #f5a623, #f0850a)",
                fontFamily: "Playfair Display, serif",
              }}
            >
              {initials || <User className="w-10 h-10" />}
            </div>
            <div className="flex-1 md:pb-2">
              <h2
                className="text-2xl font-bold text-blue-950 m-0"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {prenomAffiche} {nomAffiche}
              </h2>
              <p className="text-slate-500 flex items-center gap-2 mt-1 text-sm m-0">
                <Briefcase className="w-3.5 h-3.5" />
                {enseignant.grade || "—"} · {enseignant.departement || "—"}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                  {enseignant.statut}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" /> Actif
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Coordonnées + Affectation ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coordonnées */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center shrink-0">
                <User className="w-[18px] h-[18px] text-yellow-400" />
              </div>
              <div>
                <h3
                  className="m-0 text-base font-bold text-blue-950"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Coordonnées
                </h3>
                <p className="m-0 text-xs text-slate-400">
                  Informations personnelles et de contact.
                </p>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <InfoRow icon={User} label="Nom" value={enseignant.nom} />
              <InfoRow icon={User} label="Prénom" value={enseignant.prenom} />
              <InfoRow
                icon={Mail}
                label="Email"
                value={enseignant.email || user?.email}
              />
              <InfoRow icon={Phone} label="Téléphone" value={enseignant.tel} />
            </div>
          </div>

          {/* Affectation académique */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-[18px] h-[18px] text-yellow-400" />
              </div>
              <div>
                <h3
                  className="m-0 text-base font-bold text-blue-950"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Affectation académique
                </h3>
                <p className="m-0 text-xs text-slate-400">
                  Département, statut et informations de poste.
                </p>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <InfoGrid label="Département" value={enseignant.departement} />
                <InfoGrid label="Grade" value={enseignant.grade} />
                <InfoGrid label="Statut" value={enseignant.statut} />
                <InfoGrid
                  label="H. Contractuelles"
                  value={
                    enseignant.heures_contractuelles
                      ? `${enseignant.heures_contractuelles}h`
                      : null
                  }
                />
              </div>

              {/* Matières enseignées */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="m-0 text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Matières enseignées
                </p>

                {matieresEnseignees.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matieresEnseignees.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        <BookOpen className="w-3 h-3" />
                        {m}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-xs text-slate-400 italic">
                    Aucune matière déclarée
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-blue-600 flex items-center justify-center">
              <Lock className="w-[18px] h-[18px] text-yellow-400" />
            </div>

            <div>
              <h3
                className="m-0 text-base font-bold text-blue-950"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Sécurité du compte
              </h3>

              <p className="m-0 text-xs text-slate-400">
                Modifier votre mot de passe.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="p-6 flex flex-col gap-4"
          >
            {pwdError && (
              <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">
                {pwdError}
              </div>
            )}

            {pwdSuccess && (
              <div className="px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">
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
              "Confirmer le mot de passe",
              "confirmer_mdp",
              showConfirmer,
              setShowConfirmer,
            )}

            <button
              type="submit"
              disabled={pwdLoading}
              className="w-full py-2.5 rounded-xl text-white font-semibold"
              style={{
                background: "linear-gradient(135deg, #f5a623, #f0850a)",
              }}
            >
              {pwdLoading ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Profil;
