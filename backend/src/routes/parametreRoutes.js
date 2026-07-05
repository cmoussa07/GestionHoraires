const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const {
  getParametres,
  updateParametres,
  getAnnees,
  createAnnee,
  activateAnnee,
} = require("../controllers/parametreController");

router.get("/", auth, getParametres);
router.put("/:id", auth, role("admin"), updateParametres);
router.get("/annees", auth, role("admin"), getAnnees);
router.post("/annees", auth, role("admin"), createAnnee);
router.put("/annees/:id/activate", auth, role("admin"), activateAnnee);

module.exports = router;
