import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function Panel({ title, subtitle, children }) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: subtitle ? 0 : 'var(--space-3)' }}>{title}</h2>
      {subtitle && (
        <p className="text-sm muted" style={{ marginBottom: 'var(--space-3)' }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}

function CareerChip({ career }) {
  return (
    <li className="card" style={{ background: 'var(--surface-hover)', marginBottom: 'var(--space-2)' }}>
      <strong>{career.title}</strong>
      <div className="row" style={{ marginTop: 4, gap: 6 }}>
        <span className="badge">{career.domain}</span>
        <span className="badge badge-success">{career.jobDemand} demand</span>
      </div>
    </li>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/dashboard/summary')
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="container field-error">{error}</p>;
  if (!data)
    return (
      <p className="container muted">
        <span className="spinner" style={{ marginRight: 8 }} />
        Loading your dashboard...
      </p>
    );

  const { recentActivity, latestQuizResult, savedItems, recommendations, trendingCareers } = data;

  return (
    <section className="container container-wide">
      <div className="page-header">
        <h1>
          {greeting()}, {user.name.split(' ')[0]}
        </h1>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Panel title="Recent Activity">
          {recentActivity.length === 0 ? (
            <p className="muted text-sm">Nothing yet — bookmark a career or take the quiz to get started.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentActivity.map((a, i) => (
                <li key={i} style={{ marginBottom: 'var(--space-2)' }}>
                  <Link to={a.link}>{a.message}</Link>
                  <div className="text-sm muted">{new Date(a.date).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Quiz Results">
          {latestQuizResult ? (
            <div>
              <p>
                Top match:{' '}
                <span className="badge badge-accent" style={{ marginLeft: 2 }}>
                  {latestQuizResult.topCategories[0] || 'N/A'}
                </span>
              </p>
              <p className="text-sm muted">Taken {new Date(latestQuizResult.createdAt).toLocaleDateString()}</p>
              <p className="text-sm">
                <Link to="/quiz/history">View full history</Link> · <Link to="/quiz">Retake the quiz</Link>
              </p>
            </div>
          ) : (
            <p className="muted text-sm">
              You haven't taken the <Link to="/quiz">Interest Quiz</Link> yet.
            </p>
          )}
        </Panel>

        <Panel title="Saved Items">
          {savedItems.length === 0 ? (
            <p className="muted text-sm">No bookmarks yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {savedItems.map((b) => (
                <li key={b._id} style={{ marginBottom: 4 }} className="text-sm">
                  <span className="badge" style={{ marginRight: 6 }}>
                    {b.itemType}
                  </span>
                  {b.title}
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm" style={{ marginTop: 'var(--space-3)' }}>
            <Link to="/bookmarks">View all bookmarks</Link>
          </p>
        </Panel>

        <Panel
          title="Top Picks for You"
          subtitle={
            (recommendations.source === 'quiz' && 'Based on your quiz results') ||
            (recommendations.source === 'profile' && 'Based on your profile skills & interests') ||
            'Popular high-demand careers'
          }
        >
          {recommendations.careers.length === 0 ? (
            <p className="muted text-sm">No recommendations yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recommendations.careers.map((c) => (
                <CareerChip key={c._id} career={c} />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <h2>Trending Careers</h2>
        {trendingCareers.length === 0 ? (
          <p className="muted text-sm">Not enough activity yet to show trends.</p>
        ) : (
          <div className="row" style={{ gap: 'var(--space-3)' }}>
            {trendingCareers.map((c) => (
              <div key={c._id} className="card" style={{ minWidth: 180 }}>
                <strong>{c.title}</strong>
                <p className="text-sm muted" style={{ margin: '4px 0 0' }}>
                  {c.domain} · bookmarked {c.bookmarkCount}x recently
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ marginTop: 'var(--space-6)' }}>
        <Link to="/careers">Browse the full Career Bank</Link>
      </p>
    </section>
  );
}
