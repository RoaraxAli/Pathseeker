const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { EMAIL_USER, EMAIL_PASS, EMAIL_SERVICE } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) return null;

  transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE || 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
  return transporter;
}

// Sends an email if EMAIL_USER/EMAIL_PASS are configured in .env; otherwise
// logs it to the console so OTP flows are still testable before real
// credentials are wired in.
async function sendEmail({ to, subject, html, text }) {
  const t = getTransporter();

  if (!t) {
    console.log('\n[email] EMAIL_USER/EMAIL_PASS not set — printing instead of sending:');
    console.log(`[email] To: ${to}`);
    console.log(`[email] Subject: ${subject}`);
    console.log(`[email] Body: ${text || html}\n`);
    return { simulated: true };
  }

  return t.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
    text,
  });
}

module.exports = sendEmail;
