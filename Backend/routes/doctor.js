const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const auth = require("../middleware/auth");

// Get all doctors
router.get("/", doctorController.getAllDoctors);

router.get("/:id", auth, doctorController.getDoctorById);

module.exports = router;
