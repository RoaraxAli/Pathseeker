// Creates (or updates) the admin account from env vars. Admins are never
// created through the public /register endpoint — only through this script.
//
// Usage: npm run seed:admin
// Reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from server/.env

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db');
const User = require('../models/User');

async function seedAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      '[seed:admin] Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before running this.'
    );
    process.exit(1);
  }

  await connectDB();

  const email = ADMIN_EMAIL.toLowerCase();
  let admin = await User.findOne({ email }).select('+password');

  if (admin) {
    admin.name = ADMIN_NAME || admin.name;
    admin.password = ADMIN_PASSWORD; // pre-save hook re-hashes it
    admin.role = 'admin';
    await admin.save();
    console.log(`[seed:admin] Updated existing admin: ${email}`);
  } else {
    admin = await User.create({
      name: ADMIN_NAME || 'Admin',
      email,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`[seed:admin] Created admin: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('[seed:admin] Failed:', err.message);
  process.exit(1);
});
