import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Clock, TrendingUp } from "lucide-react";

const bars = [40, 65, 45, 80, 60, 90, 70, 95, 75, 88, 60, 78];
const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="pt-32 pb-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #fef9f0 100%)",
      }}
    >
      <div
        className="absolute top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: "#1a47cc" }}
      />
      <div
        className="absolute bottom-10 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: "#f5a623" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{ borderColor: "#f5a62340", background: "#f5a62315" }}
            >
              <Sparkles className="h-4 w-4" style={{ color: "#f5a623" }} />
              <span className="text-sm font-medium text-gray-700">
                Nouvelle génération universitaire 2026
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold leading-tight text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              La gestion des heures
              <span className="block" style={{ color: "#f5a623" }}>
                enseignantes,
              </span>
              <span className="block">réinventée.</span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
              Une plateforme académique élégante pour piloter les volumes
              horaires (CM, TD, TP), automatiser le calcul des heures
              complémentaires et générer les états de paiement en un clic.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:brightness-90"
                style={{
                  background: "linear-gradient(135deg, #f5a623, #f0850a)",
                }}
              >
                Commencer gratuitement <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              {[
                { value: "120+", label: "Universités" },
                { value: "8 500", label: "Enseignants" },
                { value: "99.9%", label: "Précision" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-3xl font-bold text-gray-900"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl blur-3xl opacity-20"
              style={{ background: "#f5a623" }}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400">
                    Année 2025-2026
                  </div>
                  <div
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Heures par mois
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: "#f5a623" }}
                  />
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                </div>
              </div>
              <div className="h-48 flex items-end gap-2 px-1">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t-md hover:opacity-80 transition-all"
                      style={{
                        height: `${h}%`,
                        background: "linear-gradient(to top, #f5a623, #f0850a)",
                      }}
                    />
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {months[i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Répartition par département
                </div>
                {[
                  { name: "Informatique", pct: 85 },
                  { name: "Mathématiques", pct: 65 },
                  { name: "Physique", pct: 48 },
                ].map((d, i) => (
                  <div key={d.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-gray-700">
                        {d.name}
                      </span>
                      <span className="font-bold text-gray-900">{d.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${d.pct}%`,
                          background:
                            i === 0
                              ? "#f5a623"
                              : i === 1
                                ? "#1a47cc"
                                : "#94a3b8",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #f5a623, #f0850a)",
                  }}
                >
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Dépassements</div>
                  <div className="text-xl font-bold text-gray-900">+18%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
