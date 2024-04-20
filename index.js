const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

mongoose
  .connect(
    "mongodb+srv://ks468:8Jlf3GHpzqWRNJe3@cluster0.trapc2f.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middlewares
app.use(cors());
app.use(bodyParser.json());

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: String,
  consultationLimit: Number, // Maximum patients per evening
  availability: [
    // Array of objects representing available evenings (day, startTime, endTime)
    { day: String, startTime: String, endTime: String },
  ],
});

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientName: String,
  date: Date,
  time: String,
});

module.exports = mongoose.model("Doctor", doctorSchema);
module.exports = mongoose.model("Appointment", appointmentSchema);

// Routes
app.use("/api", routes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
