const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const appointmentsRouter = require("./routes/appointments");
const doctorRoutes = require("./routes/doctor");
const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api/appointments", appointmentsRouter);
app.use("/api/doctors", doctorRoutes);

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
