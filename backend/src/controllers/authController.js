const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
require("dotenv").config();

async function login(req, res) {
  console.log("LOGIN REÇU :", req.body);
  const { email, mdp } = req.body;

  try {
    const [users] = await pool.execute(
      "SELECT * FROM utilisateurs WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(mdp, user.mdp);

    if (!isValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.iduti, role_id: user.role_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    return res.json({
      token,
      role_id: user.role_id,
      nom: user.nom,
      email: user.email,
      enseignant_id: user.enseignant_id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function inscription(req, res) {
  const { nom, prenom, email, mdp, role_id, enseignant_id } = req.body;

  try {
    const [existing] = await pool.execute(
      "SELECT iduti FROM utilisateurs WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedMdp = await bcrypt.hash(mdp, 12);

    const [result] = await pool.execute(
      `INSERT INTO utilisateurs (nom, prenom, email, mdp, role_id, enseignant_id, actif)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, email, hashedMdp, role_id, enseignant_id || null, 1],
    );

    return res
      .status(201)
      .json({ message: "Utilisateur créé", id: result.insertId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

async function changerMdp(req, res) {
  const { ancien_mdp, nouveau_mdp } = req.body;
  const userId = req.user.id;
  try {
    const [users] = await pool.execute(
      "SELECT * FROM utilisateurs WHERE iduti = ?",
      [userId],
    );
    if (users.length === 0)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isValid = await bcrypt.compare(ancien_mdp, users[0].mdp);
    if (!isValid)
      return res.status(401).json({ message: "Ancien mot de passe incorrect" });

    const hashedMdp = await bcrypt.hash(nouveau_mdp, 12);
    await pool.execute("UPDATE utilisateurs SET mdp = ? WHERE iduti = ?", [
      hashedMdp,
      userId,
    ]);
    return res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

module.exports = { login, inscription, changerMdp };
