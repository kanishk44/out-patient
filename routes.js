const express = require("express");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");

const router = express.Router();

// Get all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctor details by ID
router.get("/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctor availability
router.get("/doctors/:id/availability", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor.availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book appointment (implement logic to check availability and create appointment)
router.post("/appointments", async (req, res) => {
  // ... (implementation to check availability and create appointment)
  const { doctorId, patientName, date, time } = req.body;

  // Check if required fields are provided
  if (!doctorId || !patientName || !date || !time) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    (async () => {
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });

      // Check availability for the specific date and time
      const isAvailable = doctor.availability.some(async (slot) => {
        return (
          slot.day === date.toLocaleDateString("en-US", { weekday: "long" }) &&
          slot.startTime === time &&
          !(await Appointment.exists({ doctor: doctorId, date, time }))
        );
      });

      if (!isAvailable) {
        return res
          .status(409)
          .json({ message: "Appointment slot unavailable" });
      }
    })();

    // Create a new appointment
    const newAppointment = new Appointment({
      doctor: doctorId,
      patientName,
      date,
      time,
    });

    await newAppointment.save();

    res.json({ message: "Appointment booked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
