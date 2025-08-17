const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const appointmentsRouter = require("./routes/appointments");
const doctorRoutes = require("./routes/doctor");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors({ origin: "*", credentials: true }));

app.use(cookieParser());

app.use(express.json());
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRouter);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start server

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
