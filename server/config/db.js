import mongoose from 'mongoose';
import dns from 'dns';

// Ensure standard reliable DNS resolution for MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techwiz';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected to Atlas / Database: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};
