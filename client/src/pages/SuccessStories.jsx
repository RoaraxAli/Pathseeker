import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

function StoryCard({ story }) {
  return (
    <li className="card">
      <div className="row-between">
        <strong>{story.title}</strong>
        {story.domain && <span className="badge badge-accent">{story.domain}</span>}
      </div>
      <p className="text-sm muted" style={{ margin: '4px 0' }}>
        {story.authorName} · {new Date(story.storyDate).toLocaleDateString()}
      </p>
      <p>{story.content}</p>
    </li>
  );
}

function Timeline({ stories }) {
  return (
    <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 'var(--space-6)', marginLeft: 'var(--space-2)' }}>
      {stories.map((s) => (
        <div key={s._id} style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
          <div
            style={{
              position: 'absolute',
              left: 'calc(-1 * var(--space-6) - 5px)',
              top: 4,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 0 3px var(--accent-bg)',
            }}
          />
          <p className="text-sm muted" style={{ margin: 0 }}>
            {new Date(s.storyDate).toLocaleDateString()}
          </p>
          <strong>{s.title}</strong>
          <p className="text-sm muted" style={{ margin: '2px 0 4px' }}>
            {s.authorName} {s.domain ? `· ${s.domain}` : ''}
          </p>
          <p>{s.content}</p>
        </div>
      ))}
    </div>
  );
}

function SubmitStoryForm({ onSubmitted }) {
  const [form, setForm] = useState({ title: '', content: '', domain: '', storyDate: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');
    try {
      await apiFetch('/success-stories', { method: 'POST', body: form });
      setMessage('Submitted! An admin will review it before it appears publicly.');
      setForm({ title: '', content: '', domain: '', storyDate: '' });
      onSubmitted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 'var(--space-5)' }}>
      <h3>Share your story</h3>
      <label>
        Title
        <input value={form.title} onChange={update('title')} required />
      </label>
      <label>
        Domain (optional)
        <input value={form.domain} onChange={update('domain')} placeholder="e.g. Technology" />
      </label>
      <label>
        Your story
        <textarea value={form.content} onChange={update('content')} required rows={4} />
      </label>
      {message && <p className="field-success">{message}</p>}
      {error && <p className="field-error">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit for review'}
      </button>
    </form>
  );
}

export default function SuccessStories() {
  const { user } = useAuth();
  const [meta, setMeta] = useState({ domains: [] });
  const [filters, setFilters] = useState({ domain: '', q: '' });
  const [view, setView] = useState('cards'); // 'cards' | 'timeline'
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    apiFetch('/success-stories/meta').then(setMeta).catch(() => {});
  }, []);

  function fetchStories() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.domain) params.set('domain', filters.domain);
    if (filters.q) params.set('q', filters.q);
    params.set('sort', view === 'timeline' ? 'timeline' : 'recent');
    apiFetch(`/success-stories?${params.toString()}`)
      .then((data) => setStories(data.stories))
      .finally(() => setLoading(false));
  }

  useEffect(fetchStories, [filters, view]);

  return (
    <section className="container">
      <div className="row-between page-header">
        <div>
          <h1 style={{ marginBottom: 0 }}>Success Stories</h1>
          <p>Real (and illustrative) paths people took to get where they are.</p>
        </div>
        {user && (
          <button type={showForm ? 'button' : 'submit'} className="btn-sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Cancel' : 'Share your story'}
          </button>
        )}
      </div>

      {showForm && <SubmitStoryForm onSubmitted={() => setShowForm(false)} />}

      <div className="toolbar">
        <input
          placeholder="Search title..."
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          style={{ width: 200 }}
        />
        <select
          value={filters.domain}
          onChange={(e) => setFilters((f) => ({ ...f, domain: e.target.value }))}
          style={{ width: 'auto' }}
        >
          <option value="">All domains</option>
          {meta.domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <div className="row" style={{ marginLeft: 'auto', gap: 4 }}>
          <button
            type="button"
            className={`btn-sm${view === 'cards' ? ' btn-primary' : ' btn-ghost'}`}
            onClick={() => setView('cards')}
          >
            Cards
          </button>
          <button
            type="button"
            className={`btn-sm${view === 'timeline' ? ' btn-primary' : ' btn-ghost'}`}
            onClick={() => setView('timeline')}
          >
            Timeline
          </button>
        </div>
      </div>

      {loading && (
        <p className="muted">
          <span className="spinner" style={{ marginRight: 8 }} />
          Loading...
        </p>
      )}
      {!loading && stories.length === 0 && <div className="empty-state">No stories found.</div>}

      {!loading && view === 'cards' && (
        <ul className="card-list">
          {stories.map((s) => (
            <StoryCard key={s._id} story={s} />
          ))}
        </ul>
      )}
      {!loading && view === 'timeline' && <Timeline stories={stories} />}
    </section>
  );
}
