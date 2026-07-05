const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const enseignantRoutes = require("./routes/enseignantRoutes");
const matiereRoutes = require("./routes/matiereRoutes");
const heureRoutes = require("./routes/heureRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const referentielRoutes = require("./routes/referentielRoutes");
const parametreRoutes = require("./routes/parametreRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/enseignants", enseignantRoutes);
app.use("/api/matieres", matiereRoutes);

app.use((req, res, next) => {
  console.log("📩 REQUÊTE:", req.method, req.url);
  next();
});

app.use("/api/heures", heureRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", referentielRoutes);
app.use("/api/parametres", parametreRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Gestion des heures enseignants" });
});

module.exports = app;
