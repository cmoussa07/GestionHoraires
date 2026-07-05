import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function Footer() {
  const navigate = useNavigate();

  return (
    <>
      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative rounded-3xl overflow-hidden p-16 text-center"
            style={{
              background: "linear-gradient(135deg, #1a3a6b 0%, #1a47cc 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, #f5a623 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 mb-8">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-400">
                  Essai gratuit · sans engagement
                </span>
              </div>
              <h2
                className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Donnez à votre université l'
                <span className="italic" style={{ color: "#f5a623" }}>
                  excellence
                </span>{" "}
                qu'elle mérite.
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
                Rejoignez les établissements qui ont modernisé leur gestion
                académique avec GestHeure.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold transition-all hover:brightness-90"
                  style={{
                    background: "linear-gradient(135deg, #f5a623, #f0850a)",
                  }}
                >
                  Démarrer maintenant <ArrowRight className="h-5 w-5" />
                </button>
                <button className="px-8 py-4 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all">
                  Planifier une démo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="pt-16 pb-8"
        style={{
          background: "linear-gradient(135deg, #1a3a6b 0%, #0f2d5e 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2.5 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #f5a623, #f0850a)",
                  }}
                >
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div
                    className="font-bold text-lg text-white"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    GestHeure
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">
                    Académie Pro
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-md mb-6">
                La plateforme de référence pour la gestion intelligente des
                heures d'enseignement dans les établissements supérieurs.
              </p>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-yellow-400" />{" "}
                  moussa@gestheure.ci
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-yellow-400" /> +225 0759496679
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-yellow-400" /> Abidjan, Côte
                  d'Ivoire
                </div>
              </div>
            </div>
            <div>
              <h4
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Produit
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                {["Fonctionnalités", "Tarifs", "Démo", "Sécurité"].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-white transition-all">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Ressources
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                {[
                  "Documentation",
                  "Guide utilisateur",
                  "Support",
                  "Mentions légales",
                ].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-white transition-all">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/30">
            <span>© 2026 GestHeure · Tous droits réservés</span>
            <span>Conçu pour les universités d'excellence ✦</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
