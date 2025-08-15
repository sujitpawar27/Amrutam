const cron = require("node-cron");
const Appointment = require("../models/Appointment");
const { releaseLockIfMatch } = require("../utils/redis");

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const expired = await Appointment.find({
    status: "Pending",
    otpExpiresAt: { $lt: now },
  });
  for (const appt of expired) {
    // release Redis lock if token exists
    if (appt.lockToken) {
      await releaseLockIfMatch(
        appt.doctorId.toString(),
        appt.slotTime.toISOString(),
        appt.lockToken
      );
    }
    appt.status = "Cancelled";
    await appt.save();
  }
});
