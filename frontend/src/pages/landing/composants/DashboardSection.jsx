import React from "react";
import { Users, Clock, BookOpen, TrendingUp } from "lucide-react";

function DashboardSection() {
  const bars = [40, 65, 45, 80, 60, 90, 70, 95, 75, 88, 60, 78];

  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  const depts = [
    { name: "Informatique", total: 85 },
    { name: "Mathématiques", total: 65 },
    { name: "Physique", total: 48 },
  ];

  const maxDept = 85;

  const statCards = [
    { icon: Users, value: "120+", label: "Enseignants suivis" },
    { icon: Clock, value: "8 500h", label: "Heures cumulées" },
    { icon: BookOpen, value: "12", label: "Filières actives" },
    { icon: TrendingUp, value: "8", label: "En dépassement" },
  ];

  const colors = ["#f5a623", "#1a47cc", "#94a3b8"];

  return (
    <section id="dashboard" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-xs font-semibold uppercase tracking-widest text-yellow-700">
              Tableau de bord
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Visualisez la{" "}
              <span style={{ color: "#f5a623" }}>charge horaire</span> en temps
              réel
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Suivez les volumes par département, identifiez les enseignants en
              dépassement, et anticipez les heures complémentaires.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {statCards.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-all">
                        <Icon className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-all" />
                      </div>
                    </div>
                    <div
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl blur-3xl opacity-20"
              style={{ background: "#f5a623" }}
            />
            <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-5">
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

              {/* Graphique barres réel */}
              <div className="h-48 flex items-end gap-2">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      className="w-full rounded-t-md group-hover:opacity-75 transition-all"
                      style={{
                        height: `${h || 2}%`,
                        background: "linear-gradient(to top, #f5a623, #f0850a)",
                      }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {months[i]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Répartition par département réelle */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Répartition par département
                </div>
                {depts.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Aucune donnée</p>
                ) : (
                  depts.map((d, i) => {
                    const val = Number(d.total || d.pct || 0);
                    const pct = Math.round((val / maxDept) * 100);
                    return (
                      <div key={d.departement || d.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-gray-700">
                            {d.departement || d.name}
                          </span>
                          <span className="font-bold text-gray-900">
                            {val}h
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: colors[i] }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardSection;
