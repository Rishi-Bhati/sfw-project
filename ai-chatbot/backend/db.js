const mongoose = require('mongoose');

// This is the default connection string for a local MongoDB instance.
// "ai-chatbot" will be the name of the database created automatically.
const mongoURI = "mongodb://127.0.0.1:27017/ai-chatbot";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectToMongo;