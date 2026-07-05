const pool = require("../config/database");

async function getAllMatieres(req, res) {
  try {
    const [matieres] = await pool.execute(
      "SELECT * FROM matieres ORDER BY idmatiere DESC",
    );
    return res.json(matieres);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function getMatiereById(req, res) {
  const { id } = req.params;
  try {
    const [matieres] = await pool.execute(
      "SELECT * FROM matieres WHERE idmatiere = ?",
      [id],
    );
    if (matieres.length === 0) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    return res.json(matieres[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function createMatiere(req, res) {
  const { intitule, filiere, niveau, volume_horaireprevu } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO matieres (intitule, filiere, niveau, volume_horaireprevu)
       VALUES (?, ?, ?, ?)`,
      [intitule, filiere, niveau, volume_horaireprevu],
    );
    return res
      .status(201)
      .json({ message: "Matière créée", id: result.insertId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function updateMatiere(req, res) {
  const { id } = req.params;
  const { intitule, filiere, niveau, volume_horaireprevu } = req.body;
  try {
    await pool.execute(
      `UPDATE matieres SET intitule=?, filiere=?, niveau=?, volume_horaireprevu=?
       WHERE idmatiere=?`,
      [intitule, filiere, niveau, volume_horaireprevu, id],
    );
    return res.json({ message: "Matière mise à jour" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function deleteMatiere(req, res) {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM matieres WHERE idmatiere = ?", [id]);
    return res.json({ message: "Matière supprimée" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

module.exports = {
  getAllMatieres,
  getMatiereById,
  createMatiere,
  updateMatiere,
  deleteMatiere,
};
