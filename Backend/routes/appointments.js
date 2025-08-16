// backend/routes/appointments.js
const express = require("express");
const router = express.Router();
const apptCtrl = require("../controllers/appointments");
const auth = require("../middleware/auth");

router.get("/:doctorId", auth, apptCtrl.getAppointmentsByDoctor);
router.get("/doctor/:id/slots", apptCtrl.getSlots); // public or protected
router.post("/lock", auth, apptCtrl.lockSlot); // protect with auth
router.post("/confirm", auth, apptCtrl.confirmAppointment); // protect with auth
router.delete("/:id", auth, apptCtrl.cancelAppointment); // protect
router.patch("/:id/reschedule", auth, apptCtrl.rescheduleAppointment); // protect

module.exports = router;
