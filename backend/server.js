const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Ride = require('./models/Ride');
const Driver = require('./models/Driver');

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://ananya:QQxMLDQ9BAMwdcty@onehub.ja5vv.mongodb.net/?retryWrites=true&w=majority&appName=OneHub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("🚀 Connected to MongoDB")).catch(err => console.log(err));

// 📌 API: Book a Ride
app.post('/book-ride', async (req, res) => {
    const { pickupLocation, dropoffLocation, riderName } = req.body;

    const ride = new Ride({ pickupLocation, dropoffLocation, riderName });
    await ride.save();
    
    res.status(201).json({ message: 'Ride booked successfully!', ride });
});

// 📌 API: Get Available Drivers
app.get('/drivers', async (req, res) => {
    const drivers = await Driver.find({ available: true });
    res.json(drivers);
});

// 📌 API: Assign Driver
app.post('/assign-driver', async (req, res) => {
    const { rideId, driverId } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    ride.driverId = driverId;
    ride.status = 'accepted';
    await ride.save();

    // Mark driver as unavailable
    await Driver.findByIdAndUpdate(driverId, { available: false });

    res.json({ message: "Driver assigned successfully!", ride });
});

// Start Server
app.listen(5000, () => console.log("✅ Server running on port 5000"));
