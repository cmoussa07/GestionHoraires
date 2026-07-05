const pool = require("../config/database");

async function getParametres(req, res) {
  try {
    const [parametres] = await pool.execute(
      `SELECT p.*, a.libelle AS annee, a.date_debut, a.date_fin, a.active
       FROM parametres p
       LEFT JOIN annees_academiques a ON p.annee_id = a.idannee`,
    );
    return res.json(parametres);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function updateParametres(req, res) {
  const { id } = req.params;
  const {
    equivalent_cm,
    equivalent_td,
    equivalent_tp,
    taux_permanent,
    taux_vacataire,
  } = req.body;
  try {
    await pool.execute(
      `UPDATE parametres SET equivalent_cm=?, equivalent_td=?, equivalent_tp=?, taux_permanent=?, taux_vacataire=?
       WHERE idparametre=?`,
      [
        equivalent_cm,
        equivalent_td,
        equivalent_tp,
        taux_permanent,
        taux_vacataire,
        id,
      ],
    );
    return res.json({ message: "Paramètres mis à jour" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function getAnnees(req, res) {
  try {
    const [annees] = await pool.execute("SELECT * FROM annees_academiques");
    return res.json(annees);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function createAnnee(req, res) {
  const { libelle, date_debut, date_fin } = req.body;
  try {
    await pool.execute("UPDATE annees_academiques SET active = 0");
    const [result] = await pool.execute(
      `INSERT INTO annees_academiques (libelle, date_debut, date_fin, active)
       VALUES (?, ?, ?, 1)`,
      [libelle, date_debut, date_fin],
    );
    await pool.execute(
      `INSERT INTO parametres (annee_id, equivalent_cm, equivalent_td, equivalent_tp, taux_permanent, taux_vacataire)
   VALUES (?, 1, 1.5, 2, 0, 0)`,
      [result.insertId],
    );
    return res
      .status(201)
      .json({ message: "Année académique créée", id: result.insertId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function activateAnnee(req, res) {
  const { id } = req.params;
  try {
    await pool.execute("UPDATE annees_academiques SET active = 0");
    await pool.execute(
      "UPDATE annees_academiques SET active = 1 WHERE idannee = ?",
      [id],
    );
    return res.json({ message: "Année académique activée" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

module.exports = {
  getParametres,
  updateParametres,
  getAnnees,
  createAnnee,
  activateAnnee,
};
