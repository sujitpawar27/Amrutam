const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  mode: [{ type: String, enum: ["online", "in-person"] }],
  availability: [
    {
      day: String,
      slots: [String],
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);
