const dns = require('dns');
const mongoose = require('mongoose');

// Only configure custom DNS servers locally on Windows if needed, never in Vercel/production
if (process.platform === 'win32' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {}
}

let cachedPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    const msg = 'MONGODB_URI is not set or still has placeholder values. Please configure MONGODB_URI in your environment variables.';
    console.error(`[db] ${msg}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw new Error(msg);
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  try {
    cachedPromise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
    await cachedPromise;
    console.log('[db] Connected to MongoDB');
  } catch (err) {
    cachedPromise = null;
    console.error('[db] Failed to connect to MongoDB:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw err;
  }
}

module.exports = connectDB;
