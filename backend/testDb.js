const pool = require("./src/config/database");

async function testConnexion() {
  try {
    const [rows] = await pool.execute("SELECT 1 + 1 AS resultat");
    console.log("Connexion réussie ! Résultat :", rows[0].resultat);
    process.exit(0);
  } catch (error) {
    console.error("Erreur de connexion :", error.message);
    process.exit(1);
  }
}

testConnexion();
