const bcrypt = require("bcryptjs");

async function run() {
  try {
    const saltRounds = 12;

    const adminPassword = await bcrypt.hash("Admin@2025", saltRounds);
    const rhPassword = await bcrypt.hash("rh@2025", saltRounds);

    console.log("\n🔐 HASH ADMIN :");
    console.log(adminPassword);

    console.log("\n🔐 HASH RH :");
    console.log(rhPassword);

    console.log("\n✅ Copie ces valeurs dans MySQL !");
  } catch (error) {
    console.error("Erreur génération hash :", error);
  }
}

run();
