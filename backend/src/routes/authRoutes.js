const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  login,
  inscription,
  changerMdp,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/inscription", inscription);
router.put("/changer-mdp", auth, changerMdp);

module.exports = router;
