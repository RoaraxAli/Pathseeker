const Notification = require('../models/Notification');

// Fire-and-forget-friendly: callers can await it, but a notification
// failing to save should never block the action that triggered it (e.g. a
// story approval succeeding even if the notification insert has a hiccup).
async function notify(userId, type, message, link) {
  try {
    return await Notification.create({ user: userId, type, message, link });
  } catch (err) {
    console.error('[notify] failed to create notification:', err.message);
    return null;
  }
}

module.exports = notify;
