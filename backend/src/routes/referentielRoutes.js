const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const {
  getGrades,
  getDepartements,
  createDepartement,
  deleteDepartement,
} = require("../controllers/referentielController");

router.get("/grades", auth, getGrades);
router.get("/departements", auth, getDepartements);
router.post("/departements", auth, role("admin"), createDepartement);
router.delete("/departements/:id", auth, role("admin"), deleteDepartement);

module.exports = router;
