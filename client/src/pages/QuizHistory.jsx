import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function QuizHistory() {
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/quiz/history')
      .then((data) => setAttempts(data.attempts))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="container container-narrow">
      <div className="row-between page-header">
        <div>
          <h1 style={{ marginBottom: 0 }}>Quiz History</h1>
        </div>
        <Link to="/quiz">
          <button type="submit" className="btn-sm">
            Retake quiz
          </button>
        </Link>
      </div>

      {error && <p className="field-error">{error}</p>}
      {!attempts && !error && <p className="muted">Loading...</p>}
      {attempts && attempts.length === 0 && (
        <div className="empty-state">
          You haven't taken the quiz yet. <Link to="/quiz">Take it now</Link>.
        </div>
      )}

      <ul className="card-list">
        {attempts?.map((a) => (
          <li key={a._id} className="card">
            <strong>{new Date(a.createdAt).toLocaleString()}</strong>
            <div className="row" style={{ marginTop: 6, gap: 6 }}>
              {a.topCategories.length ? (
                a.topCategories.map((c) => (
                  <span key={c} className="badge badge-accent">
                    {c}
                  </span>
                ))
              ) : (
                <span className="muted text-sm">No strong matches</span>
              )}
            </div>
            {a.suggestedCareers.length > 0 && (
              <p className="text-sm muted" style={{ marginTop: 'var(--space-2)' }}>
                Suggested: {a.suggestedCareers.map((c) => c.title).join(', ')}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
