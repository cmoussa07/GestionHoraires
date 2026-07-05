import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ─── Couleurs GestHeure ──────────────────────────── */
const C = {
  bleu: [26, 58, 107],
  or: [245, 166, 35],
  blanc: [255, 255, 255],
  gris: [248, 250, 252],
  texte: [60, 60, 60],
};

/* ─── Formatage montant ───────────────────────────── */
function formatMontant(val) {
  return `${Number(val || 0)} FCFA`;
}

function formatTaux(val) {
  return `${Number(val || 0)} FCFA/h`;
}

/* ─── En-tête commune ─────────────────────────────── */
function drawHeader(doc, titre, sousTitre = "") {
  // Bande bleue
  doc.setFillColor(...C.bleu);
  doc.rect(0, 0, 210, 42, "F");

  // Bande or fine
  doc.setFillColor(...C.or);
  doc.rect(0, 42, 210, 2, "F");

  // Titre
  doc.setTextColor(...C.or);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(titre, 14, 20);

  // Sous-titre / date
  doc.setTextColor(...C.blanc);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  if (sousTitre) doc.text(sousTitre, 14, 30);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 14, 37);

  // Logo texte GestHeure à droite
  doc.setTextColor(...C.or);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("GestHeure", 196, 20, { align: "right" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.blanc);
  doc.text("Académie Pro", 196, 27, { align: "right" });
}

/* ─── Titre de section ────────────────────────────── */
function drawSection(doc, titre, y) {
  doc.setTextColor(...C.bleu);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(titre, 14, y);
  doc.setDrawColor(...C.or);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 196, y + 2);
  return y + 8;
}

/* ─── Pied de page ────────────────────────────────── */
function drawFooter(doc) {
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(...C.bleu);
    doc.rect(0, 285, 210, 12, "F");
    doc.setTextColor(...C.blanc);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "GestHeure — Plateforme de gestion des heures enseignants",
      14,
      292,
    );
    doc.text(`Page ${i} / ${pages}`, 196, 292, { align: "right" });
  }
}

/* ─── Style tableau commun ────────────────────────── */
const tableStyles = {
  headStyles: { fillColor: C.bleu, textColor: C.or, fontStyle: "bold" },
  alternateRowStyles: { fillColor: C.gris },
  bodyStyles: { textColor: C.texte },
  margin: { left: 14, right: 14 },
};

/* ════════════════════════════════════════════════════
   1. FICHE INDIVIDUELLE ENSEIGNANT
   ════════════════════════════════════════════════════ */
export function exportFicheEnseignantPDF({
  enseignant,
  stats,
  heures = [],
  matieres = [],
}) {
  const doc = new jsPDF();

  drawHeader(
    doc,
    "Fiche de profil enseignant",
    `${enseignant.prenom} ${enseignant.nom} — ${enseignant.departement || ""}`,
  );

  let y = 52;

  // Infos personnelles
  y = drawSection(doc, "Informations personnelles", y);
  doc.setFontSize(10);
  const infos = [
    ["Nom complet", `${enseignant.prenom} ${enseignant.nom}`],
    ["Grade", enseignant.grade || "—"],
    ["Département", enseignant.departement || "—"],
    ["Email", enseignant.email || "—"],
    ["Téléphone", enseignant.tel || "—"],
    ["Statut", enseignant.statut || "—"],
    ["Heures contractuelles", `${enseignant.heures_contractuelles || 0}h`],
    ["Matières enseignées", matieres.length > 0 ? matieres.join(", ") : "—"],
  ];
  infos.forEach(([label, val], i) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.bleu);
    doc.text(`${label} :`, 14, y + i * 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.texte);
    const lines = doc.splitTextToSize(val, 110);
    doc.text(lines, 75, y + i * 7);
  });

  y += infos.length * 7 + 8;

  // Récapitulatif
  y = drawSection(doc, "Récapitulatif des heures", y);
  autoTable(doc, {
    startY: y,
    head: [["Indicateur", "Valeur"]],
    body: [
      ["Total heures effectuées", `${stats.totalHeures || 0}h`],
      ["Heures complémentaires", `${stats.heuresComplementaires || 0}h`],
      ["Montant à payer", formatMontant(stats.montantTotal)],
    ],
    ...tableStyles,
  });

  // Tableau des heures
  if (heures.length > 0) {
    y = doc.lastAutoTable.finalY + 10;
    y = drawSection(doc, "Détail des heures déclarées", y);
    autoTable(doc, {
      startY: y,
      head: [["Matière", "Date", "Type", "Durée", "Salle", "Complémentaire"]],
      body: heures.map((h) => [
        h.matiere || "—",
        h.date_cours ? new Date(h.date_cours).toLocaleDateString("fr-FR") : "—",
        h.type_heure || "—",
        `${h.duree}h`,
        h.salle || "—",
        h.est_complementaire ? "Oui" : "Non",
      ]),
      ...tableStyles,
    });
  }

  drawFooter(doc);
  doc.save(`fiche_${enseignant.nom}_${enseignant.prenom}.pdf`);
}

/* ════════════════════════════════════════════════════
   2. ÉTAT GLOBAL DES PAIEMENTS
   ════════════════════════════════════════════════════ */
export function exportEtatGlobalPDF({
  etatPaiement = [],
  heuresParDepartement = [],
}) {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFillColor(...C.bleu);
  doc.rect(0, 0, 297, 42, "F");
  doc.setFillColor(...C.or);
  doc.rect(0, 42, 297, 2, "F");
  doc.setTextColor(...C.or);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("État global des paiements", 14, 20);
  doc.setTextColor(...C.blanc);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Récapitulatif de tous les enseignants", 14, 30);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 14, 37);
  doc.setTextColor(...C.or);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("GestHeure", 283, 20, { align: "right" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.blanc);
  doc.text("Académie Pro", 283, 27, { align: "right" });

  let y = 52;

  // Heures par département
  y = drawSection(doc, "Heures par département", y);
  autoTable(doc, {
    startY: y,
    head: [["Département", "Total heures"]],
    body: heuresParDepartement.map((d) => [
      d.departement || "—",
      `${d.total}h`,
    ]),
    ...tableStyles,
  });

  y = doc.lastAutoTable.finalY + 10;

  // État paiement
  y = drawSection(doc, "État de paiement par enseignant", y);
  autoTable(doc, {
    startY: y,
    head: [
      [
        "Enseignant",
        "Statut",
        "H. Contract.",
        "Total H.",
        "H. Compl.",
        "Taux",
        "Montant (FCFA)",
        "Situation",
      ],
    ],
    body: etatPaiement.map((e) => [
      `${e.prenom} ${e.nom}`,
      e.statut,
      `${e.heures_contractuelles}h`,
      `${e.total_heures}h`,
      `${e.heures_complementaires}h`,
      formatTaux(e.taux_utilise || 6000),
      formatMontant(e.montant_a_payer),
      Number(e.total_equivalent) > Number(e.heures_contractuelles)
        ? "Dépassement"
        : "Normal",
    ]),
    ...tableStyles,
    didParseCell: (data) => {
      if (data.column.index === 7 && data.section === "body") {
        const val = data.cell.raw;
        if (val === "Dépassement") {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        } else {
          data.cell.styles.textColor = [5, 150, 105];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  drawFooter(doc);
  doc.save("etat_global_paiements.pdf");
}

export function printEtatGlobalPDF({
  etatPaiement = [],
  heuresParDepartement = [],
}) {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFillColor(...C.bleu);
  doc.rect(0, 0, 297, 42, "F");

  doc.setFillColor(...C.or);
  doc.rect(0, 42, 297, 2, "F");

  doc.setTextColor(...C.or);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("État global des paiements", 14, 20);

  doc.setTextColor(...C.blanc);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Récapitulatif de tous les enseignants", 14, 30);

  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 14, 37);

  let y = 52;

  y = drawSection(doc, "Heures par département", y);

  autoTable(doc, {
    startY: y,
    head: [["Département", "Total heures"]],
    body: heuresParDepartement.map((d) => [
      d.departement || "—",
      `${d.total}h`,
    ]),
    ...tableStyles,
  });

  y = doc.lastAutoTable.finalY + 10;

  y = drawSection(doc, "État de paiement", y);

  autoTable(doc, {
    startY: y,
    head: [
      [
        "Enseignant",
        "Statut",
        "H. Contract.",
        "Total H.",
        "H. Compl.",
        "Taux",
        "Montant",
      ],
    ],
    body: etatPaiement.map((e) => [
      `${e.prenom} ${e.nom}`,
      e.statut,
      `${e.heures_contractuelles}h`,
      `${e.total_heures}h`,
      `${e.heures_complementaires}h`,
      `${e.taux_utilise || 0} FCFA/h`,
      `${e.montant_a_payer} FCFA`,
    ]),
    ...tableStyles,
  });

  drawFooter(doc);

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  const win = window.open(url, "_blank");

  if (win) {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 500);
  }
}

export function printFicheEnseignantPDF({ enseignant, stats, heures = [] }) {
  const doc = new jsPDF();

  drawHeader(
    doc,
    "Fiche de profil enseignant",
    `${enseignant.prenom} ${enseignant.nom} — ${enseignant.departement || ""}`,
  );

  let y = 52;

  y = drawSection(doc, "Informations personnelles", y);

  doc.setFontSize(10);

  const infos = [
    ["Nom complet", `${enseignant.prenom} ${enseignant.nom}`],
    ["Grade", enseignant.grade || "—"],
    ["Département", enseignant.departement || "—"],
    ["Email", enseignant.email || "—"],
    ["Téléphone", enseignant.tel || "—"],
    ["Statut", enseignant.statut || "—"],
    ["Heures contractuelles", `${enseignant.heures_contractuelles || 0}h`],
  ];

  infos.forEach(([label, val], i) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.bleu);
    doc.text(`${label} :`, 14, y + i * 7);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.texte);
    doc.text(val, 75, y + i * 7);
  });

  y += infos.length * 7 + 8;

  y = drawSection(doc, "Récapitulatif des heures", y);

  autoTable(doc, {
    startY: y,
    head: [["Indicateur", "Valeur"]],
    body: [
      ["Total heures effectuées", `${stats.totalHeures || 0}h`],
      ["Heures complémentaires", `${stats.heuresComplementaires || 0}h`],
      ["Montant à payer", formatMontant(stats.montantTotal)],
    ],
    ...tableStyles,
  });

  drawFooter(doc);

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  const win = window.open(url, "_blank");

  if (win) {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 500);
  }
}

export function exportMesHeuresPDF({ enseignant, heures = [], stats }) {
  const doc = new jsPDF();

  // ── En-tête ──
  drawHeader(
    doc,
    "Mes heures déclarées",
    `${enseignant.prenom} ${enseignant.nom} — ${enseignant.departement || ""}`,
  );

  let y = 52;

  // ── Récapitulatif stats ──
  if (stats) {
    y = drawSection(doc, "Récapitulatif", y);
    autoTable(doc, {
      startY: y,
      head: [["Indicateur", "Valeur"]],
      body: [
        ["Total heures effectuées", `${stats.totalHeures || 0}h`],
        ["Heures complémentaires", `${stats.heuresComplementaires || 0}h`],
        ["Montant à payer", formatMontant(stats.montantTotal)],
      ],
      ...tableStyles,
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // ── Tableau des heures ──
  if (heures.length > 0) {
    y = drawSection(doc, "Détail des heures déclarées", y);
    autoTable(doc, {
      startY: y,
      head: [
        [
          "Matière",
          "Date",
          "Type",
          "Durée",
          "Salle",
          "Complémentaire",
          "Statut",
        ],
      ],
      body: heures.map((h) => [
        h.matiere || "—",
        h.date_cours ? new Date(h.date_cours).toLocaleDateString("fr-FR") : "—",
        h.type_heure || "—",
        `${h.duree}h`,
        h.salle || "—",
        h.est_complementaire ? "Oui" : "Non",
        h.statut || "en attente",
      ]),
      ...tableStyles,
      didParseCell: (data) => {
        if (data.column.index === 6 && data.section === "body") {
          const val = data.cell.raw;
          if (val === "validé") {
            data.cell.styles.textColor = [5, 150, 105];
            data.cell.styles.fontStyle = "bold";
          } else if (val === "refusé") {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = "bold";
          } else {
            data.cell.styles.textColor = [100, 100, 100];
          }
        }
      },
    });
  } else {
    y = drawSection(doc, "Détail des heures déclarées", y);
    doc.setFontSize(10);
    doc.setTextColor(...C.texte);
    doc.setFont("helvetica", "italic");
    doc.text("Aucune heure déclarée.", 14, y + 6);
  }

  drawFooter(doc);
  doc.save(`mes_heures_${enseignant.nom}_${enseignant.prenom}.pdf`);
}
