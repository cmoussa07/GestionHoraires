const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const logger = require("../middlewares/logger");
const {
  getAllHeures,
  getHeuresByEnseignant,
  createHeure,
  updateHeure,
  deleteHeure,
} = require("../controllers/heureController");

router.get("/test", (req, res) => res.json({ ok: true }));
router.get("/", auth, getAllHeures);
router.get("/enseignant/:id", auth, getHeuresByEnseignant);
router.post("/", auth, logger("Ajout heure", "heures_effectuees"), createHeure);
router.put(
  "/:id",
  auth,
  logger("Modification heure", "heures_effectuees"),
  updateHeure,
);
router.delete(
  "/:id",
  auth,
  logger("Suppression heure", "heures_effectuees"),
  deleteHeure,
);

module.exports = router;
