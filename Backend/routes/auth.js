const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  logout,
  isAuthenticated,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", auth, logout);
router.get("/isAuthenticated", auth, isAuthenticated);
module.exports = router;
