const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

const {
  getStatistiques,
  getStatistiquesParEnseignant,
} = require("../controllers/dashboardController");

router.get("/", auth, role("admin", "rh"), getStatistiques);
router.get("/enseignant/:id", auth, getStatistiquesParEnseignant);

module.exports = router;
