const pool = require("../config/database");
const bcrypt = require("bcryptjs");

async function getAllEnseignants(req, res) {
  try {
    const [enseignants] = await pool.execute(
      `SELECT e.*, g.libelle AS grade, d.nom AS departement 
       FROM enseignants e
       LEFT JOIN grades g ON e.grade_id = g.idgrade
       LEFT JOIN departements d ON e.departement_id = d.iddepartement
       WHERE e.actif = 1
       ORDER BY e.idenseignant DESC`,
    );
    return res.json(enseignants);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function getEnseignantById(req, res) {
  const { id } = req.params;
  try {
    const [enseignants] = await pool.execute(
      `SELECT e.*, g.libelle AS grade, d.nom AS departement 
       FROM enseignants e
       LEFT JOIN grades g ON e.grade_id = g.idgrade
       LEFT JOIN departements d ON e.departement_id = d.iddepartement
       WHERE e.idenseignant = ? AND e.actif = 1`,
      [id],
    );
    if (enseignants.length === 0) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }
    return res.json(enseignants[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function createEnseignant(req, res) {
  const {
    nom,
    prenom,
    email,
    tel,
    grade_id,
    departement_id,
    statut,
    taux_horaire,
    heures_contractuelles,
  } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Créer l'enseignant
    const [result] = await connection.execute(
      `INSERT INTO enseignants (nom, prenom, email, tel, grade_id, departement_id, statut, taux_horaire, heures_contractuelles, actif)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        nom,
        prenom,
        email,
        tel || null,
        grade_id,
        departement_id,
        statut || "Permanent",
        taux_horaire || 0,
        heures_contractuelles || 0,
      ],
    );

    const enseignantId = result.insertId;

    // 2. Créer le compte utilisateur avec mot de passe par défaut
    const mdpDefaut = "Enseignant@2025";
    const hashedMdp = await bcrypt.hash(mdpDefaut, 12);

    await connection.execute(
      `INSERT INTO utilisateurs (nom, prenom, email, mdp, role_id, enseignant_id, actif)
       VALUES (?, ?, ?, ?, 3, ?, 1)`,
      [nom, prenom, email, hashedMdp, enseignantId],
    );

    await connection.commit();

    return res.status(201).json({
      message: "Enseignant créé",
      id: enseignantId,
      credentials: {
        email: email,
        mdp_defaut: mdpDefaut,
      },
    });
  } catch (error) {
    await connection.rollback();
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  } finally {
    connection.release();
  }
}

async function updateEnseignant(req, res) {
  const { id } = req.params;
  const {
    nom,
    prenom,
    email,
    tel,
    grade_id,
    departement_id,
    statut,
    taux_horaire,
    heures_contractuelles,
  } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE enseignants SET nom=?, prenom=?, email=?, tel=?, grade_id=?,
       departement_id=?, statut=?, taux_horaire=?, heures_contractuelles=?
       WHERE idenseignant=?`,
      [
        nom,
        prenom,
        email,
        tel || null,
        grade_id,
        departement_id,
        statut,
        taux_horaire,
        heures_contractuelles,
        id,
      ],
    );

    // Sync dans utilisateurs aussi
    await connection.execute(
      `UPDATE utilisateurs SET nom=?, prenom=?, email=?
       WHERE enseignant_id=?`,
      [nom, prenom, email, id],
    );

    await connection.commit();
    return res.json({ message: "Enseignant mis à jour" });
  } catch (error) {
    await connection.rollback();
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  } finally {
    connection.release();
  }
}

async function deleteEnseignant(req, res) {
  const { id } = req.params;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Désactiver l'enseignant
    await connection.execute(
      "UPDATE enseignants SET actif = 0 WHERE idenseignant = ?",
      [id],
    );

    // Désactiver aussi son compte utilisateur
    await connection.execute(
      "UPDATE utilisateurs SET actif = 0 WHERE enseignant_id = ?",
      [id],
    );

    await connection.commit();
    return res.json({ message: "Enseignant supprimé" });
  } catch (error) {
    await connection.rollback();
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  } finally {
    connection.release();
  }
}

module.exports = {
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
};
