import React from "react";
import { Settings2, Briefcase, GraduationCap, Check } from "lucide-react";

const roles = [
  {
    icon: Settings2,
    title: "Administrateur",
    tag: "Pilotage global",
    items: [
      "Gestion des utilisateurs et rôles",
      "Paramétrage de l'année académique",
      "Définition des taux horaires",
      "Configuration des équivalences",
    ],
    featured: false,
    cardStyle: { background: "white", border: "2px solid #e5e7eb" },
    textColor: "#1a3a6b",
    iconBg: "linear-gradient(135deg, #1a3a6b, #1a47cc)",
    iconColor: "white",
    checkBg: "#e8eeff",
    checkColor: "#1a47cc",
  },
  {
    icon: Briefcase,
    title: "Service RH",
    tag: "Opérationnel",
    items: [
      "Saisie et validation des heures",
      "Consultation des statistiques",
      "Génération des états de paiement",
      "Suivi des dépassements",
    ],
    featured: true,
    cardStyle: { background: "linear-gradient(135deg, #f5a623, #f0850a)" },
    textColor: "white",
    iconBg: "rgba(255,255,255,0.2)",
    iconColor: "white",
    checkBg: "rgba(255,255,255,0.25)",
    checkColor: "white",
  },
  {
    icon: GraduationCap,
    title: "Enseignant",
    tag: "Consultation",
    items: [
      "Consultation de ses heures",
      "Téléchargement du récapitulatif",
      "Vue par type (CM / TD / TP)",
      "Historique pluriannuel",
    ],
    featured: false,
    cardStyle: { background: "white", border: "2px solid #e5e7eb" },
    textColor: "#1a3a6b",
    iconBg: "rgba(26,71,204,0.1)",
    iconColor: "#1a47cc",
    checkBg: "#e8eeff",
    checkColor: "#1a47cc",
  },
];

function UserRoles() {
  return (
    <section
      id="utilisateurs"
      className="py-24 relative overflow-hidden"
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

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-5">
            Trois profils, une plateforme
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-5"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Pensée pour{" "}
            <span className="italic" style={{ color: "#f5a623" }}>
              chaque acteur
            </span>{" "}
            de l'université
          </h2>
          <p className="text-lg text-white/70">
            Une expérience adaptée selon votre rôle, avec les bons outils au bon
            moment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-center">
          {roles.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={i}
                className={`relative rounded-3xl p-8 ${r.featured ? "scale-105 shadow-2xl" : "shadow-lg"}`}
                style={r.cardStyle}
              >
                {r.featured && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ background: "#1a3a6b", color: "#f5a623" }}
                  >
                    Le plus utilisé
                  </div>
                )}
                <div
                  className="inline-flex p-4 rounded-2xl mb-5"
                  style={{ background: r.iconBg }}
                >
                  <Icon className="h-7 w-7" style={{ color: r.iconColor }} />
                </div>
                <div
                  className="text-xs uppercase tracking-widest mb-1 opacity-60"
                  style={{ color: r.textColor }}
                >
                  {r.tag}
                </div>
                <h3
                  className="text-2xl font-bold mb-6"
                  style={{
                    color: r.textColor,
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {r.title}
                </h3>
                <ul className="space-y-3">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div
                        className="mt-0.5 p-1 rounded-full flex-shrink-0"
                        style={{ background: r.checkBg }}
                      >
                        <Check
                          className="h-3 w-3"
                          style={{ color: r.checkColor }}
                          strokeWidth={3}
                        />
                      </div>
                      <span
                        className="text-sm"
                        style={{ color: r.textColor, opacity: 0.85 }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default UserRoles;
