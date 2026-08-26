import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

function StatBlock({ label, value }) {
  return (
    <div className="card" style={{ textAlign: 'center', minWidth: 110 }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</div>
      <div className="text-sm muted">{label}</div>
    </div>
  );
}

function statusBadgeClass(status) {
  if (status === 'resolved') return 'badge badge-success';
  if (status === 'reviewed') return 'badge badge-accent';
  return 'badge badge-warning';
}

export default function AdminFeedback() {
  const [analytics, setAnalytics] = useState(null);
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  function load() {
    apiFetch('/admin/analytics/feedback').then(setAnalytics).catch((err) => setError(err.message));
    apiFetch('/feedback').then((data) => setItems(data.feedback)).catch(() => {});
  }

  useEffect(load, []);

  async function updateStatus(id, status) {
    await apiFetch(`/feedback/${id}`, { method: 'PATCH', body: { status } });
    setItems((prev) => prev.map((f) => (f._id === id ? { ...f, status } : f)));
  }

  if (error) return <p className="container container-narrow field-error">{error}</p>;
  if (!analytics || !items) return <p className="container container-narrow muted">Loading...</p>;

  return (
    <section className="container">
      <div className="page-header">
        <h1>Feedback</h1>
        <p>Submitted bug reports, suggestions, and questions.</p>
      </div>

      <div className="row" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <StatBlock label="Total" value={analytics.total} />
        {Object.entries(analytics.byType).map(([k, v]) => (
          <StatBlock key={k} label={k} value={v} />
        ))}
        {Object.entries(analytics.byStatus).map(([k, v]) => (
          <StatBlock key={k} label={k} value={v} />
        ))}
      </div>

      <h3>All feedback</h3>
      <ul className="card-list">
        {items.map((f) => (
          <li key={f._id} className="card">
            <div className="row-between">
              <span className="badge">{f.type}</span>
              <span className={statusBadgeClass(f.status)}>{f.status}</span>
            </div>
            <p style={{ margin: 'var(--space-2) 0' }}>{f.message}</p>
            <p className="text-sm muted">{f.user ? `${f.user.name} (${f.user.email})` : f.email}</p>
            <select value={f.status} onChange={(e) => updateStatus(f._id, e.target.value)} style={{ width: 'auto' }}>
              <option value="open">Open</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </li>
        ))}
      </ul>
    </section>
  );
}
