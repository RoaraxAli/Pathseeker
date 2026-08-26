const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable DNS servers to resolve MongoDB SRV records reliably
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

let cachedPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    console.error(
      '[db] MONGODB_URI is missing or still has placeholder values. ' +
        'Set MONGODB_URI in your environment variables.'
    );
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw new Error('MONGODB_URI is not configured');
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  try {
    cachedPromise = mongoose.connect(uri, {
      bufferCommands: false,
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
