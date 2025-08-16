// backend/routes/appointments.js
const express = require("express");
const router = express.Router();
const apptCtrl = require("../controllers/appointments");
const auth = require("../middleware/auth");

router.get("/:doctorId", auth, apptCtrl.getAppointmentsByDoctor);
router.get("/doctor/:id/slots", auth, apptCtrl.getSlots);
router.post("/lock", auth, apptCtrl.lockSlot);
router.post("/confirm", auth, apptCtrl.confirmAppointment);
router.delete("/:id", auth, apptCtrl.cancelAppointment);
router.put("/:id/reschedule", auth, apptCtrl.rescheduleAppointment);

module.exports = router;
