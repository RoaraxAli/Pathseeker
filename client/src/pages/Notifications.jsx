import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function Notifications() {
  const [notifications, setNotifications] = useState(null);

  function load() {
    apiFetch('/notifications').then((data) => setNotifications(data.notifications));
  }

  useEffect(load, []);

  async function markRead(id) {
    await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  }

  async function markAllRead() {
    await apiFetch('/notifications/read-all', { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  if (!notifications) return <p className="container container-narrow muted">Loading...</p>;

  return (
    <section className="container container-narrow">
      <div className="row-between page-header">
        <h1 style={{ marginBottom: 0 }}>Notifications</h1>
        <button type="button" className="btn-sm" onClick={markAllRead}>
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 && <div className="empty-state">No notifications yet.</div>}

      <ul className="card-list">
        {notifications.map((n) => (
          <li
            key={n._id}
            className="card"
            style={{ background: n.read ? 'var(--surface)' : 'var(--accent-bg)', borderColor: n.read ? 'var(--border)' : 'var(--accent-border)' }}
          >
            <p style={{ margin: 0 }}>{n.message}</p>
            <p className="text-sm muted" style={{ margin: '4px 0' }}>
              {new Date(n.createdAt).toLocaleString()}
            </p>
            <div className="row" style={{ gap: 'var(--space-3)' }}>
              {n.link && <Link to={n.link}>View</Link>}
              {!n.read && (
                <button type="button" className="btn-ghost btn-sm" onClick={() => markRead(n._id)}>
                  Mark as read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
