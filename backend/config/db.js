
// Import the mongoose library to interact with MongoDB
const mongoose = require("mongoose");
// Create an asynchronous function to connect to the database
const connectDB = async () => {
  try {
    // Try to connect to MongoDB using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Specify the database name
      dbName: process.env.DB_NAME,
    });
    console.log("MongoDB Connected:");
  } catch (err) {
// If any error occurs during connection, print the error message

    console.error("MongoDB Error:", err.message);
    // Stop the Node.js process because database connection is critical
    process.exit(1);
  }
};
// Export the connectDB function so it can be used in server.js
module.exports = connectDB;
