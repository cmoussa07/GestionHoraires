const pool = require("../config/database");

async function getGrades(req, res) {
  try {
    const [grades] = await pool.execute("SELECT * FROM grades");
    return res.json(grades);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function getDepartements(req, res) {
  try {
    const [departements] = await pool.execute(
      "SELECT * FROM departements ORDER BY iddepartement DESC",
    );
    return res.json(departements);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function createDepartement(req, res) {
  const { nom } = req.body;
  try {
    const [result] = await pool.execute(
      "INSERT INTO departements (nom) VALUES (?)",
      [nom],
    );
    return res
      .status(201)
      .json({ message: "Département créé", id: result.insertId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function deleteDepartement(req, res) {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM departements WHERE iddepartement = ?", [
      id,
    ]);
    return res.json({ message: "Département supprimé" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

module.exports = {
  getGrades,
  getDepartements,
  createDepartement,
  deleteDepartement,
};
