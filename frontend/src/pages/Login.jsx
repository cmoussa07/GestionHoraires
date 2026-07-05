import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [erreur, setErreur] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMdp, setShowMdp] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("🔥 LOGIN CLICKED"); // AJOUTE ÇA
    setIsLoading(true);
    setErreur("");

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        mdp: mdp,
      });

      login(
        response.data.token,
        response.data.role_id,
        response.data.nom,
        response.data.email,
        response.data.enseignant_id,
      );

      navigate("/dashboard");
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);

      if (error.response?.status === 404) {
        setErreur("Route login introuvable (backend)");
      } else if (error.response?.status === 401) {
        setErreur("Mot de passe incorrect");
      } else if (
        error.response?.status === 404 &&
        error.response?.data?.message
      ) {
        setErreur(error.response.data.message);
      } else {
        setErreur("Erreur serveur. Réessayez plus tard.");
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a3a6b 0%, #1a47cc 50%, #0f2d5e 100%)",
        }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #f5a623 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl shadow-lg"
            style={{ background: "linear-gradient(135deg, #f5a623, #f0850a)" }}
          >
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-2xl">GestHeure</div>
            <div className="text-xs uppercase tracking-widest text-white/50">
              Académie Pro
            </div>
          </div>
        </div>

        {/* Main text */}
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-400/10">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">
              Plateforme officielle
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight">
            La gestion des heures,{" "}
            <span style={{ color: "#f5a623" }}>réinventée.</span>
          </h1>

          <p className="text-lg text-white/70 leading-relaxed">
            Connectez-vous pour suivre, valider et analyser la charge horaire de
            votre université en quelques clics.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: BookOpen, value: "67 filières" },
              { icon: ShieldCheck, value: "100% sécurisé" },
              { icon: Sparkles, value: "Temps réel" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/10 bg-white/5"
              >
                <s.icon className="h-5 w-5 text-yellow-400" />
                <span className="text-xs text-white/70 text-center font-medium">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-white/30">
          © 2026 GestHeure · Tous droits réservés
        </p>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-xs font-semibold uppercase tracking-widest text-yellow-700 mb-6">
            Espace membre
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Bon retour parmi nous
          </h2>
          <p className="text-gray-500 mb-8">
            Connectez-vous à votre espace académique sécurisé.
          </p>

          {erreur && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="prenom.nom@univ.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                  style={{ "--tw-ring-color": "#f5a623" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showMdp ? "text" : "password"}
                  placeholder="••••••••"
                  value={mdp}
                  onChange={(e) => setMdp(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowMdp(!showMdp)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showMdp ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-70 hover:brightness-95"
              style={{
                background: "linear-gradient(135deg, #f5a623, #f0850a)",
              }}
            >
              {isLoading ? (
                "Connexion en cours..."
              ) : (
                <>
                  {/* Se connecter <ArrowRight className="h-4 w-4" />*/}
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
