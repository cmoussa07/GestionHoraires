import React from "react";
import {
  Calculator,
  ClipboardList,
  BarChart3,
  FileSpreadsheet,
  ShieldCheck,
  Users2,
  Calendar,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: Users2,
    title: "Gestion des enseignants",
    desc: "Profils complets avec grade, statut, département et taux horaire personnalisé.",
  },
  {
    icon: Calendar,
    title: "Planification intelligente",
    desc: "Suivi en temps réel des CM, TD et TP avec dates, salles et observations.",
  },
  {
    icon: Calculator,
    title: "Calcul automatique",
    desc: "Cumuls, équivalences (1h CM = 1.5h TD) et heures complémentaires sans erreur.",
  },
  {
    icon: BarChart3,
    title: "Tableaux de bord",
    desc: "Vue par département, filière, dépassements et statistiques mensuelles.",
  },
  {
    icon: Wallet,
    title: "États de paiement",
    desc: "Génération comptable précise du montant total à verser à chaque enseignant.",
  },
  {
    icon: FileSpreadsheet,
    title: "Exports PDF & Excel",
    desc: "Fiches individuelles, états globaux et rapports prêts pour la comptabilité.",
  },
  {
    icon: ClipboardList,
    title: "Gestion des matières",
    desc: "Intitulé, filière, niveau (L1 → M2) et volume horaire prévu, organisés.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité & traçabilité",
    desc: "Authentification robuste, gestion fine des rôles et journal des actions.",
  },
];

function Features() {
  return (
    <section id="fonctionnalites" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold uppercase tracking-widest text-blue-700 mb-5">
            Fonctionnalités
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-5"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Tout ce qu'il faut pour piloter{" "}
            <span style={{ color: "#f5a623" }}>la charge enseignante</span>
          </h2>
          <p className="text-lg text-gray-500">
            Conçu avec les directions des ressources humaines des grandes
            universités.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                style={{ "--hover-bg": "#eef2ff" }}
              >
                <div
                  className="inline-flex p-3 rounded-xl mb-4 group-hover:scale-110 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #1a3a6b, #1a47cc)",
                  }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-all">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
                <div
                  className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                  style={{
                    background: "linear-gradient(to right, #f5a623, #1a47cc)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
