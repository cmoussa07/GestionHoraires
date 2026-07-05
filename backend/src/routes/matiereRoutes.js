const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const {
  getAllMatieres,
  getMatiereById,
  createMatiere,
  updateMatiere,
  deleteMatiere,
} = require("../controllers/matiereController");

router.get("/", auth, getAllMatieres);
router.get("/:id", auth, getMatiereById);
router.post("/", auth, role("admin", "rh"), createMatiere);
router.put("/:id", auth, role("admin", "rh"), updateMatiere);
router.delete("/:id", auth, role("admin"), deleteMatiere);

module.exports = router;
