import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

function StatBlock({ label, value }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>{value}</div>
      <div className="text-sm muted">{label}</div>
    </div>
  );
}

function PopularList({ title, items, countLabel }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="muted text-sm">No data yet.</p>
      ) : (
        <ol style={{ margin: 0 }}>
          {items.map((item, i) => (
            <li key={i} className="text-sm" style={{ marginBottom: 4 }}>
              {item.title} — <strong>{Object.values(item).find((v) => typeof v === 'number')}</strong> {countLabel}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function AdminUsageStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/admin/analytics/usage').then(setStats).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="container field-error">{error}</p>;
  if (!stats) return <p className="container muted">Loading...</p>;

  return (
    <section className="container container-wide">
      <div className="page-header">
        <h1>Usage Stats</h1>
        <p>Real, derived numbers from actual account and content activity.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', marginBottom: 'var(--space-6)' }}>
        <StatBlock label="Total users" value={stats.users.total} />
        <StatBlock label="Active (7 days)" value={stats.users.activeLast7Days} />
        <StatBlock label="Active (30 days)" value={stats.users.activeLast30Days} />
        <StatBlock label="Quiz attempts" value={stats.quiz.totalAttempts} />
        <StatBlock label="Attempts (7 days)" value={stats.quiz.attemptsLast7Days} />
        <StatBlock label="Careers" value={stats.content.totalCareers} />
        <StatBlock label="Media items" value={stats.content.totalMedia} />
        <StatBlock label="Resources" value={stats.content.totalResources} />
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3>Users by role</h3>
        <div className="row" style={{ gap: 6 }}>
          {Object.entries(stats.users.byRole).map(([role, count]) => (
            <span key={role} className="badge badge-accent">
              {role}: {count}
            </span>
          ))}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        <PopularList title="Most bookmarked careers" items={stats.popular.careers} countLabel="bookmarks" />
        <PopularList title="Most bookmarked media" items={stats.popular.media} countLabel="bookmarks" />
        <PopularList title="Most downloaded resources" items={stats.popular.resources} countLabel="downloads" />
        <PopularList title="Most rated media" items={stats.popular.mostRatedMedia} countLabel="ratings" />
      </div>
    </section>
  );
}
