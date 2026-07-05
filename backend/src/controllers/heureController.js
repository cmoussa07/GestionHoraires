const pool = require("../config/database");

async function getAllHeures(req, res) {
  try {
    // Récupérer l'année active
    const [anneeRows] = await pool.execute(
      "SELECT idannee FROM annees_academiques WHERE active = 1 LIMIT 1",
    );
    const annee_id = anneeRows[0]?.idannee || null;

    const [heures] = await pool.execute(
      `SELECT 
        h.idheure,
        h.enseignant_id,
        h.date_cours,
        h.type_heure,
        h.duree,
        h.salle,
        h.statut,
        h.est_complementaire,
        h.observations,
        h.annee_id,
        e.nom AS enseignant_nom,
        e.prenom AS enseignant_prenom,
        m.intitule AS matiere
       FROM heures_effectuees h
       LEFT JOIN enseignants e ON h.enseignant_id = e.idenseignant
       LEFT JOIN matieres m ON h.matiere_id = m.idmatiere
       WHERE h.annee_id = ? OR h.annee_id IS NULL
       ORDER BY h.date_cours DESC, h.idheure DESC`,
      [annee_id],
    );
    return res.json(heures);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function getHeuresByEnseignant(req, res) {
  const { id } = req.params;
  try {
    const [heures] = await pool.execute(
      `SELECT h.*, m.intitule AS matiere
       FROM heures_effectuees h
       LEFT JOIN matieres m ON h.matiere_id = m.idmatiere
       LEFT JOIN annees_academiques a ON h.annee_id = a.idannee
       WHERE h.enseignant_id = ?
         AND (a.active = 1 OR h.annee_id IS NULL)
       ORDER BY h.date_cours DESC, h.idheure DESC`,
      [id],
    );
    return res.json(heures);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function createHeure(req, res) {
  const {
    enseignant_id,
    matiere_id,
    date_cours,
    type_heure,
    duree,
    salle,
    observations,
  } = req.body;

  try {
    // Récupérer l'enseignant
    const [enseignants] = await pool.execute(
      "SELECT heures_contractuelles FROM enseignants WHERE idenseignant = ?",
      [enseignant_id],
    );
    if (enseignants.length === 0)
      return res.status(404).json({ message: "Enseignant non trouvé" });

    // Récupérer l'année active
    const [anneeRows] = await pool.execute(
      "SELECT idannee FROM annees_academiques WHERE active = 1 LIMIT 1",
    );
    if (!anneeRows[0])
      return res.status(400).json({
        message:
          "Aucune année académique active. Veuillez en activer une dans les paramètres.",
      });
    const annee_id = anneeRows[0].idannee;

    // 3. Récupérer les équivalences de l'année active
    const [params] = await pool.execute(
      `SELECT p.equivalent_cm, p.equivalent_td, p.equivalent_tp
       FROM parametres p
       WHERE p.annee_id = ?
       LIMIT 1`,
      [annee_id],
    );
    const equiv = params[0] || {
      equivalent_cm: 1,
      equivalent_td: 1.5,
      equivalent_tp: 2,
    };
    const equivMap = {
      CM: Number(equiv.equivalent_cm),
      TD: Number(equiv.equivalent_td),
      TP: Number(equiv.equivalent_tp),
    };

    // Calculer le total équivalent déjà effectué (heures validées de l'année active)
    const [totalRows] = await pool.execute(
      `SELECT
         COALESCE(SUM(CASE WHEN type_heure='CM' THEN duree ELSE 0 END), 0) AS total_cm,
         COALESCE(SUM(CASE WHEN type_heure='TD' THEN duree ELSE 0 END), 0) AS total_td,
         COALESCE(SUM(CASE WHEN type_heure='TP' THEN duree ELSE 0 END), 0) AS total_tp
       FROM heures_effectuees
       WHERE enseignant_id = ? AND annee_id = ?`,
      [enseignant_id, annee_id],
    );

    const totalEquivalentActuel =
      Number(totalRows[0].total_cm) * equivMap.CM +
      Number(totalRows[0].total_td) * equivMap.TD +
      Number(totalRows[0].total_tp) * equivMap.TP;

    // Équivalent de la nouvelle heure
    const dureeEquivalente = Number(duree) * (equivMap[type_heure] || 1);

    // Déterminer si complémentaire
    const heuresContractuelles =
      Number(enseignants[0].heures_contractuelles) || 0;
    const est_complementaire =
      totalEquivalentActuel + dureeEquivalente > heuresContractuelles ? 1 : 0;

    // Insérer avec annee_id
    const [result] = await pool.execute(
      `INSERT INTO heures_effectuees 
         (enseignant_id, matiere_id, date_cours, type_heure, duree, salle, observations, est_complementaire, annee_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        enseignant_id,
        matiere_id,
        date_cours,
        type_heure,
        duree,
        salle || null,
        observations || null,
        est_complementaire,
        annee_id,
      ],
    );

    return res.status(201).json({
      message: "Heure ajoutée",
      id: result.insertId,
      est_complementaire: !!est_complementaire,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function updateHeure(req, res) {
  const { id } = req.params;
  const {
    matiere_id,
    date_cours,
    type_heure,
    duree,
    salle,
    observations,
    statut,
  } = req.body;

  try {
    if (statut !== undefined) {
      await pool.execute(
        `UPDATE heures_effectuees SET statut=? WHERE idheure=?`,
        [statut, id],
      );
    } else {
      await pool.execute(
        `UPDATE heures_effectuees 
         SET matiere_id=?, date_cours=?, type_heure=?, duree=?, salle=?, observations=?
         WHERE idheure=?`,
        [
          matiere_id,
          date_cours,
          type_heure,
          duree,
          salle ?? null,
          observations ?? null,
          id,
        ],
      );
    }
    return res.json({ message: "Heure mise à jour" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function deleteHeure(req, res) {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM heures_effectuees WHERE idheure = ?", [id]);
    return res.json({ message: "Heure supprimée" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

module.exports = {
  getAllHeures,
  getHeuresByEnseignant,
  createHeure,
  updateHeure,
  deleteHeure,
};
