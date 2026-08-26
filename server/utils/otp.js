const crypto = require('crypto');

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateOTP() {
  // 6-digit numeric code, zero-padded.
  const code = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
  return code;
}

function hashOTP(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

module.exports = { generateOTP, hashOTP, OTP_TTL_MS };
