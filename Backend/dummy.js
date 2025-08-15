const mongoose = require("mongoose");
const Doctor = require("./models/Doctor"); // adjust path if needed
const User = require("./models/User"); // import User model

// Replace with your MongoDB connection string
const MONGO_URI =
  "mongodb+srv://sujit:coolsuju@sujit.kmv9t.mongodb.net/amrutam";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Dummy doctors
const dummyDoctors = [
  {
    name: "Dr. Asha Sharma",
    specialization: "Cardiologist",
    mode: ["online", "in-person"],
    availability: [
      { day: "Monday", slots: ["10:00", "11:00", "14:00"] },
      { day: "Wednesday", slots: ["09:00", "12:00", "15:00"] },
    ],
  },
  {
    name: "Dr. Rohan Mehta",
    specialization: "Dermatologist",
    mode: ["in-person"],
    availability: [
      { day: "Tuesday", slots: ["11:00", "13:00"] },
      { day: "Thursday", slots: ["10:00", "14:00"] },
    ],
  },
  {
    name: "Dr. Priya Nair",
    specialization: "Neurologist",
    mode: ["online"],
    availability: [
      { day: "Monday", slots: ["09:00", "12:00"] },
      { day: "Friday", slots: ["10:00", "13:00", "15:00"] },
    ],
  },
  {
    name: "Dr. Sameer Joshi",
    specialization: "Pediatrician",
    mode: ["online", "in-person"],
    availability: [
      { day: "Wednesday", slots: ["10:00", "12:00"] },
      { day: "Saturday", slots: ["09:00", "11:00", "14:00"] },
    ],
  },
];

// Dummy users
const dummyUsers = [
  {
    name: "Sujit Pawar",
    email: "sujit@user.com",
    passwordHash: "1234",
    phone: "1234567890",
  },
];

const seedData = async () => {
  try {
    // Clear existing data
    await Doctor.deleteMany();
    await User.deleteMany();

    // Insert dummy data
    await Doctor.insertMany(dummyDoctors);
    await User.insertMany(dummyUsers);

    console.log("Dummy doctors and users added successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

seedData();
