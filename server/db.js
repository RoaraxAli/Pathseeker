const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable DNS servers to resolve MongoDB SRV records reliably
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    console.error(
      '[db] MONGODB_URI is missing or still has placeholder values. ' +
        'Set a real connection string in server/.env before starting the server.'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('[db] Connected to MongoDB');
  } catch (err) {
    console.error('[db] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
