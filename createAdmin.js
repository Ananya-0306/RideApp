require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const Admin = mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  const username = "admin"; // Change this if you want a different username
  const password = "admin123"; // Change this if you want a different password
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Admin({ username, password: hashedPassword });

  try {
    await admin.save();
    console.log("✅ Admin user created successfully!");
  } catch (error) {
    console.log("❌ Error creating admin:", error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
