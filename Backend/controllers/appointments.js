const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const {
  acquireLock,
  getLock,
  releaseLockIfMatch,
  redis,
} = require("../utils/redis");
require("dotenv").config();

const LOCK_TTL = parseInt(process.env.LOCK_TTL_SECONDS || "300"); // 5 min
const OTP_TTL = parseInt(process.env.OTP_TTL_SECONDS || "300");

function toISO(slotTime) {
  return new Date(slotTime).toISOString();
}

async function getUnavailableSlots(doctorId, startISO, endISO) {
  const booked = await Appointment.find({
    doctorId,
    slotTime: { $gte: new Date(startISO), $lt: new Date(endISO) },
    status: { $in: ["Booked", "Pending"] }, // pending also blocks
  }).select("slotTime");

  return booked.map((a) => new Date(a.slotTime).toISOString());
}

// GET /doctors/:id/slots?date=2025-08-14
// Generate available slots by comparing doctor's availability -> remove unavailable
exports.getSlots = async (req, res) => {
  try {
    const { id } = req.params; 
    const { date } = req.query; 
    if (!date)
      return res
        .status(400)
        .json({ message: "date query required (YYYY-MM-DD)" });

    const doctor = await Doctor.findById({ _id: id });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const dayAvailability = doctor.availability.find(
      (a) => a.day.toLowerCase() === dayName.toLowerCase()
    );
    if (!dayAvailability || !dayAvailability.slots?.length)
      return res.json({ slots: [] });

    const slotsISO = dayAvailability.slots.map((t) => {
      const [hours, minutes] = t.split(":").map(Number);
      const localDate = new Date(date); 
      localDate.setHours(hours, minutes, 0, 0);
      return localDate.toISOString();
    });

    // get unavailable (booked/pending) slots
    const startISO = new Date(`${date}T00:00:00.000Z`).toISOString();
    const endISO = new Date(`${date}T23:59:59.999Z`).toISOString();
    const unavailable = await getUnavailableSlots(id, startISO, endISO);

    // also check redis locks for extra safety (optionally)
    const available = slotsISO.filter((s) => !unavailable.includes(s));
    console.log("Available slots:", available);

    res.json({ slots: available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /appointments/lock
// body: { userId, doctorId, slotTime }  // slotTime ISO string
exports.lockSlot = async (req, res) => {
  try {
    console.log("Locking slot:", req.body);
    const { userId, doctorId, slotTime } = req.body;
    if (!userId || !doctorId || !slotTime)
      return res.status(400).json({ message: "Missing fields" });

    const slotISO = toISO(slotTime);
    const existing = await Appointment.findOne({
      doctorId,
      slotTime: new Date(slotISO),
      status: { $in: ["Booked", "Pending"] },
    });
    if (existing)
      return res
        .status(409)
        .json({ message: "Slot already booked or pending" });

    // Try acquire Redis lock
    const lockToken = uuidv4();
    const set = await acquireLock(doctorId, slotISO, lockToken, LOCK_TTL);
    if (!set) {
      return res.status(409).json({ message: "Slot locked by someone else" });
    }

    // create pending appointment with OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit mock
    const otpExpiresAt = new Date(Date.now() + OTP_TTL * 1000);
    await redis.set(
      `lock:${userId}:${doctorId}`,
      JSON.stringify({
        slotISO,
        otp,
        otpExpiresAt,
        lockToken,
      }),
      "EX",
      LOCK_TTL
    );

    // mock: "send" OTP to user (in dev just return it)
    return res.status(201).json({
      message: "Slot locked. Confirm using OTP within 5 minutes.",
      otp,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /appointments/confirm
exports.confirmAppointment = async (req, res) => {
  try {
    console.log("Confirming appointment:", req.body);

    const { doctorId, userId } = req.body;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Get lock data from Redis
    const lockDataStr = await redis.get(`lock:${userId}:${doctorId}`);
    if (!lockDataStr) {
      return res.status(400).json({ message: "No pending lock" });
    }

    const lockData = JSON.parse(lockDataStr);
    if (lockData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Create new appointment
    const appointment = await Appointment.create({
      userId,
      doctorId,
      slotTime: new Date(lockData.slotISO),
      status: "Booked",
      createdAt: new Date(),
    });

    return res.json({ message: "Appointment confirmed", appointment });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// DELETE /appointments/:id  (cancel)
exports.cancelAppointment = async (req, res) => {
  console.log("Cancelling appointment:", req.params);

  try {
    const { id } = req.params;
    const appt = await Appointment.findById(id);
    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });
    if (appt.status === "Cancelled")
      return res.json({ message: "Already cancelled" });

    const diffMs = new Date(appt.slotTime).getTime() - Date.now();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours <= 24) {
      return res
        .status(403)
        .json({ message: "Cannot cancel within 24 hours of appointment" });
    }

    appt.status = "Cancelled";
    await appt.save();

    // release Redis lock if any
    if (appt.lockToken) {
      await releaseLockIfMatch(
        appt.doctorId.toString(),
        appt.slotTime.toISOString(),
        appt.lockToken
      );
    }

    res.json({ message: "Appointment cancelled", appointment: appt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /appointments/:id/reschedule
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newSlotTime } = req.body;

    if (!newSlotTime) {
      return res.status(400).json({ message: "New slot time is required" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "Completed") {
      return res
        .status(400)
        .json({ message: "Cannot reschedule a completed appointment" });
    }

    const now = new Date();
    const hoursBeforeSlot =
      (new Date(appointment.slotTime) - now) / (1000 * 60 * 60);

    if (hoursBeforeSlot < 24) {
      return res.status(400).json({
        message: "Rescheduling only allowed more than 24 hours before the slot",
      });
    }

    // Update to new slot time
    appointment.slotTime = new Date(newSlotTime);
    appointment.status = "Booked";
    await appointment.save();

    return res.json({
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAppointmentsByDoctor = async (req, res) => {
  console.log("Fetching appointments for doctor:", req.query);

  try {
    const { doctorId } = req.params;
    const { userId } = req.query;
    if (!doctorId)
      return res.status(400).json({ message: "doctorId required" });

    const appointments = await Appointment.find({
      doctorId,
      userId,
    }).populate("userId", "name email");
    console.log("Found appointments:", appointments);

    res.json({ appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
