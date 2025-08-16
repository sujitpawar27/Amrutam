const Doctor = require("../models/Doctor");

// Get all doctors with optional filters
exports.getAllDoctors = async (req, res) => {
  console.log("Fetching all doctors with filters:", req.query);
  try {
    const { specialization, mode } = req.query;
    const query = {};

    if (specialization && specialization !== "all") {
      query.specialization = specialization;
    }

    if (mode && mode !== "all") {
      query.mode = mode;
    }

    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoctorById = async (req, res) => {
  console.log("Fetching doctor with id:", req.params.id);

  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    console.log("Doctor found:", doctor);

    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
