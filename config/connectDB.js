
const mongoose = require('mongoose');
require('dotenv').config(); // Loads the .env file

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas connected:", conn.connection.host);
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;






