const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

server.on("error", (err) => {
  console.error("❌ ERREUR SERVEUR:", err);
});

process.on("uncaughtException", (err) => {
  console.error("💥 UNCATCHED ERROR:", err);
});
