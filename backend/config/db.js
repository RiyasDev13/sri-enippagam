import mongoose from "mongoose";

/**
 * Connects to MongoDB using Mongoose.
 * Only called when USE_DB=true in .env - see server.js.
 * Once connected, swap the controllers' data-access calls (currently pointing
 * at data/store.js) over to the Mongoose models in models/ one at a time.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set in your .env file");
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.error("Falling back to the in-memory data store.");
  }
};

export default connectDB;
