const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema({
    riderName: { type: String, required: true },
    driverName: { type: String, required: false },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" },
    fare: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now }
});

const Ride = mongoose.model("Ride", RideSchema);
module.exports = Ride;
