const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  slotTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Booked", "Completed", "Cancelled"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  lockToken: { type: String },
});

// Indexes for queries
appointmentSchema.index({ doctorId: 1, slotTime: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
