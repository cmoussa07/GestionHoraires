const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const logger = require("../middlewares/logger");
const {
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
} = require("../controllers/enseignantController");

router.get("/", auth, getAllEnseignants);
router.get("/:id", auth, getEnseignantById);
router.post(
  "/",
  auth,
  role("admin", "rh"),
  logger("Ajout enseignant", "enseignants"),
  createEnseignant,
);
router.put(
  "/:id",
  auth,
  role("admin", "rh"),
  logger("Modification enseignant", "enseignants"),
  updateEnseignant,
);
router.delete(
  "/:id",
  auth,
  role("admin"),
  logger("Suppression enseignant", "enseignants"),
  deleteEnseignant,
);

module.exports = router;
