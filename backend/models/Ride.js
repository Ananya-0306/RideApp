const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    pickupLocation: String,
    dropoffLocation: String,
    riderName: String,
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, // Reference to Driver
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', rideSchema);
