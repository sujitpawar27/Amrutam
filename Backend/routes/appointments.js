// backend/routes/appointments.js
const express = require("express");
const router = express.Router();
const apptCtrl = require("../controllers/appointments");
const auth = require("../middleware/auth");

router.get("/:doctorId", apptCtrl.getAppointmentsByDoctor);
router.get("/doctor/:id/slots", apptCtrl.getSlots); // public or protected
router.post("/lock", apptCtrl.lockSlot); // protect with auth
router.post("/confirm", apptCtrl.confirmAppointment); // protect with auth
router.delete("/:id", apptCtrl.cancelAppointment); // protect
router.put("/:id/reschedule", apptCtrl.rescheduleAppointment); // protect

module.exports = router;
