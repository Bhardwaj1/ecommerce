const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("DB connected");
  } catch (e) {
    console.error(`DB connection failed: ${e.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
