const pool = require("../config/database");

/* ─── helper : récupère les équivalences de l'année active ── */
async function getEquiv() {
  const [params] = await pool.execute(
    `SELECT p.equivalent_cm, p.equivalent_td, p.equivalent_tp,
            p.taux_permanent, p.taux_vacataire
     FROM parametres p
     JOIN annees_academiques a ON p.annee_id = a.idannee
     WHERE a.active = 1
     LIMIT 1`,
  );
  return (
    params[0] || {
      equivalent_cm: 1,
      equivalent_td: 1.5,
      equivalent_tp: 2,
      taux_permanent: 6000,
      taux_vacataire: 3000,
    }
  );
}

/* ─── Stats globales (admin / rh) ────────────────────────── */
async function getStatistiques(req, res) {
  try {
    const equiv = await getEquiv();

    const [totalEnseignants] = await pool.execute(
      "SELECT COUNT(*) AS total FROM enseignants WHERE actif = 1",
    );

    const [totalHeures] = await pool.execute(
      `SELECT COALESCE(SUM(h.duree), 0) AS total
       FROM heures_effectuees h
       JOIN annees_academiques a ON h.annee_id = a.idannee
       WHERE h.statut = 'validé' AND a.active = 1`,
    );

    const [heuresParType] = await pool.execute(
      `SELECT h.type_heure, SUM(h.duree) AS total
       FROM heures_effectuees h
       JOIN annees_academiques a ON h.annee_id = a.idannee
       WHERE h.statut = 'validé' AND a.active = 1
       GROUP BY h.type_heure`,
    );

    const [heuresParDepartement] = await pool.execute(
      `SELECT d.nom AS departement, SUM(h.duree) AS total
       FROM heures_effectuees h
       JOIN annees_academiques a ON h.annee_id = a.idannee
       LEFT JOIN enseignants e ON h.enseignant_id = e.idenseignant
       LEFT JOIN departements d ON e.departement_id = d.iddepartement
       WHERE h.statut = 'validé' AND a.active = 1
       GROUP BY d.nom`,
    );

    const [heuresParEnseignant] = await pool.execute(
      `SELECT e.idenseignant, e.nom, e.prenom, e.statut,
              e.heures_contractuelles,
              COALESCE(SUM(CASE WHEN h.type_heure='CM' THEN h.duree ELSE 0 END), 0) AS total_cm,
              COALESCE(SUM(CASE WHEN h.type_heure='TD' THEN h.duree ELSE 0 END), 0) AS total_td,
              COALESCE(SUM(CASE WHEN h.type_heure='TP' THEN h.duree ELSE 0 END), 0) AS total_tp,
              COALESCE(SUM(h.duree), 0) AS total_heures
       FROM enseignants e
       LEFT JOIN heures_effectuees h ON h.enseignant_id = e.idenseignant
         AND h.statut = 'validé'
         AND EXISTS (
           SELECT 1 FROM annees_academiques a
           WHERE a.idannee = h.annee_id AND a.active = 1
         )
       WHERE e.actif = 1
       GROUP BY e.idenseignant`,
    );

    const etatPaiement = heuresParEnseignant.map((e) => {
      const totalEquivalent =
        Number(e.total_cm) * Number(equiv.equivalent_cm) +
        Number(e.total_td) * Number(equiv.equivalent_td) +
        Number(e.total_tp) * Number(equiv.equivalent_tp);

      const heuresComplementaires = Math.max(
        0,
        totalEquivalent - Number(e.heures_contractuelles),
      );

      const taux =
        e.statut === "Permanent"
          ? Number(equiv.taux_permanent)
          : Number(equiv.taux_vacataire);

      const montant_a_payer = Math.round(heuresComplementaires * taux);

      return {
        ...e,
        total_equivalent: Math.round(totalEquivalent * 100) / 100,
        heures_complementaires: Math.round(heuresComplementaires * 100) / 100,
        montant_a_payer,
        taux_utilise: taux,
      };
    });

    const enseignantsEnDepassement = etatPaiement.filter(
      (e) => e.total_equivalent > e.heures_contractuelles,
    );

    return res.json({
      totalEnseignants: totalEnseignants[0].total,
      totalHeures: totalHeures[0].total || 0,
      heuresParType,
      heuresParDepartement,
      enseignantsEnDepassement,
      etatPaiement,
      equivalences: equiv,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

/* ─── Stats par enseignant ───────────────────────────────── */
async function getStatistiquesParEnseignant(req, res) {
  const { id } = req.params;
  try {
    const [enseignants] = await pool.execute(
      `SELECT e.*, g.libelle AS grade, d.nom AS departement
       FROM enseignants e
       LEFT JOIN grades g ON e.grade_id = g.idgrade
       LEFT JOIN departements d ON e.departement_id = d.iddepartement
       WHERE e.idenseignant = ?`,
      [id],
    );

    if (enseignants.length === 0)
      return res.status(404).json({ message: "Enseignant non trouvé" });

    const enseignant = enseignants[0];
    const equiv = await getEquiv();

    const [heuresParType] = await pool.execute(
      `SELECT h.type_heure, SUM(h.duree) AS total
       FROM heures_effectuees h
       JOIN annees_academiques a ON h.annee_id = a.idannee
       WHERE h.enseignant_id = ? AND h.statut = 'validé' AND a.active = 1
       GROUP BY h.type_heure`,
      [id],
    );

    const cm = Number(
      heuresParType.find((h) => h.type_heure === "CM")?.total || 0,
    );
    const td = Number(
      heuresParType.find((h) => h.type_heure === "TD")?.total || 0,
    );
    const tp = Number(
      heuresParType.find((h) => h.type_heure === "TP")?.total || 0,
    );

    const totalHeuresBrutes = cm + td + tp;

    const totalEquivalent =
      cm * Number(equiv.equivalent_cm) +
      td * Number(equiv.equivalent_td) +
      tp * Number(equiv.equivalent_tp);

    const heuresContractuelles = Number(enseignant.heures_contractuelles) || 0;
    const heuresComplementaires = Math.max(
      0,
      totalEquivalent - heuresContractuelles,
    );

    const taux =
      enseignant.statut === "Permanent"
        ? Number(equiv.taux_permanent)
        : Number(equiv.taux_vacataire);

    const montantTotal = Math.round(heuresComplementaires * taux);

    return res.json({
      enseignant,
      heuresParType,
      totalHeures: totalHeuresBrutes,
      totalEquivalent: Math.round(totalEquivalent * 100) / 100,
      heuresContractuelles,
      heuresComplementaires: Math.round(heuresComplementaires * 100) / 100,
      montantTotal,
      cm,
      td,
      tp,
      depassement: totalEquivalent > heuresContractuelles,
      equivalences: equiv,
      taux_utilise: taux,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function getCounts(req, res) {
  try {
    const [[enseignants]] = await pool.execute(
      "SELECT COUNT(*) AS total FROM enseignants WHERE actif = 1",
    );

    const [[matieres]] = await pool.execute(
      "SELECT COUNT(*) AS total FROM matieres",
    );

    const [[heures]] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM heures_effectuees h
       JOIN annees_academiques a ON h.annee_id = a.idannee
       WHERE a.active = 1`,
    );

    return res.json({
      enseignants: enseignants.total,
      matieres: matieres.total,
      heures: heures.total,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
}

module.exports = { getStatistiques, getStatistiquesParEnseignant };
