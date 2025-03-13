const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors());

// 🔹 Corrected MongoDB URI
const mongoURI = "mongodb+srv://ananya:QQxMLDQ9BAMwdcty@onehub.ja5vv.mongodb.net/?retryWrites=true&w=majority&appName=OneHub";

// 🔹 Fixed MongoDB Connection
mongoose.connect(mongoURI, {})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ DB Connection Error:", err));

// 🔹 Ride Schema & Model
const rideSchema = new mongoose.Schema({
    location: String,
    destination: String,
    price: Number,
    status: { type: String, default: "pending" }
});
const Ride = mongoose.model("Ride", rideSchema);

// 🔹 API to Get Ride Prices
app.post("/api/getPrices", async (req, res) => {
    const { location, destination } = req.body;
    
    if (!location || !destination) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const price = Math.floor(Math.random() * 30) + 10; // Generate random price
    res.json({ price });
});

// 🔹 API to Schedule a Ride
app.post("/api/scheduleRide", async (req, res) => {
    const { location, destination } = req.body;
    
    if (!location || !destination) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const price = Math.floor(Math.random() * 50) + 10;
    const newRide = new Ride({ location, destination, price });
    await newRide.save();
    
    res.json({ bookingId: newRide._id, message: "Ride scheduled successfully" });

    // 🔹 Broadcast Ride Status Update
    if (wss.clients.size > 0) {
        broadcast({ type: "rideUpdate", status: "Ride Scheduled", bookingId: newRide._id });
    }
});

// 🔹 WebSocket Connection Handling
wss.on("connection", ws => {
    console.log("🟢 New WebSocket connection");
    ws.on("message", message => {
        console.log("Received message:", message);
    });
});

// 🔹 Fixed WebSocket Broadcast Function
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// 🔹 Start Server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
