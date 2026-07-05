import React from "react";

const steps = [
  {
    n: "01",
    title: "Importez vos enseignants",
    desc: "Créez les profils en quelques clics. Grades, statuts et taux horaires configurés.",
  },
  {
    n: "02",
    title: "Saisissez les heures effectuées",
    desc: "CM, TD, TP — date, salle, durée. Le système cumule et applique automatiquement les équivalences.",
  },
  {
    n: "03",
    title: "Calculez automatiquement",
    desc: "Heures contractuelles, complémentaires et montants à payer générés sans intervention manuelle.",
  },
  {
    n: "04",
    title: "Exportez vos états",
    desc: "Fiches individuelles, états comptables, exports PDF et Excel prêts pour la direction financière.",
  },
];

function Process() {
  return (
    <section id="processus" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-xs font-semibold uppercase tracking-widest text-gray-600 mb-5">
            Processus
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-5"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Quatre étapes vers{" "}
            <span style={{ color: "#f5a623" }}>l'efficacité</span>
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 opacity-30 md:-translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, #f5a623, #1a47cc, #f5a623)",
            }}
          />
          <div className="space-y-12">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`relative flex flex-col md:flex-row gap-6 md:gap-12 items-start ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white border-4 border-white shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #f5a623, #f0850a)",
                      fontFamily: "Playfair Display, serif",
                    }}
                  >
                    {s.n}
                  </div>
                </div>
                <div
                  className={`md:w-1/2 ml-24 md:ml-0 ${i % 2 === 0 ? "md:pr-24 md:text-right" : "md:pl-24"}`}
                >
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all cursor-pointer group">
                    <h3
                      className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-all"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Process;
