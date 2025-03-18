const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: String,
    phone: String,
    vehicleNumber: String,
    currentLocation: {
        latitude: Number,
        longitude: Number
    },
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Driver', driverSchema);
