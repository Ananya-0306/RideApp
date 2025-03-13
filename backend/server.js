require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

// Ride Schema
const RideSchema = new mongoose.Schema({
    location: String,
    destination: String,
    status: { type: String, default: "scheduled" },
    price: Number
});
const Ride = mongoose.model("Ride", RideSchema);

// API: Get estimated ride price
app.post("/api/getPrices", (req, res) => {
    const { location, destination } = req.body;
    const estimatedPrice = (Math.random() * (20 - 5) + 5).toFixed(2);
    res.json({ price: estimatedPrice });
});

// API: Schedule a ride
app.post("/api/scheduleRide", async (req, res) => {
    const { location, destination } = req.body;
    const price = (Math.random() * (20 - 5) + 5).toFixed(2);

    const newRide = new Ride({ location, destination, status: "scheduled", price });
    await newRide.save();
    
    io.emit("rideBooked", { id: newRide._id, status: "scheduled" });
    
    res.json({ bookingId: newRide._id, message: "Ride scheduled successfully!" });
});

// WebSocket: Track Ride Status
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("trackRide", async (rideId) => {
        const ride = await Ride.findById(rideId);
        if (ride) {
            socket.emit("rideStatus", ride.status);
        } else {
            socket.emit("rideStatus", "Ride not found");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
