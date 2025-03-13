require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Ride Schema
const RideSchema = new mongoose.Schema({
  location: String,
  destination: String,
  bookingId: String,
});

const Ride = mongoose.model("Ride", RideSchema);

// **Schedule Ride API**
app.post("/api/scheduleRide", async (req, res) => {
  const { location, destination } = req.body;

  if (!location || !destination) {
    return res.status(400).json({ success: false, message: "Location and destination are required." });
  }

  try {
    const bookingId = Math.random().toString(36).substr(2, 9);
    const newRide = new Ride({ location, destination, bookingId });
    await newRide.save();

    res.json({ success: true, message: "Ride scheduled successfully!", bookingId });
  } catch (error) {
    console.error("Error scheduling ride:", error);
    res.status(500).json({ success: false, message: "Failed to schedule ride." });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
