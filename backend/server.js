const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://ananyachatterjee495:2xmfM5DUALa3qTpF@cluster.mongodb.net/rideBooking", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));
