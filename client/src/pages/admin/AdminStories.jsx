import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

function statusBadgeClass(status) {
  if (status === 'approved') return 'badge badge-success';
  if (status === 'rejected') return 'badge badge-danger';
  return 'badge badge-warning';
}

export default function AdminStories() {
  const [stories, setStories] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // story being edited, or null

  function load() {
    apiFetch('/success-stories/admin/all')
      .then((data) => setStories(data.stories))
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function review(id, status) {
    await apiFetch(`/success-stories/${id}/review`, { method: 'PUT', body: { status } });
    setStories((prev) => prev.map((s) => (s._id === id ? { ...s, status } : s)));
  }

  async function remove(id) {
    await apiFetch(`/success-stories/${id}`, { method: 'DELETE' });
    setStories((prev) => prev.filter((s) => s._id !== id));
  }

  async function saveEdit(e) {
    e.preventDefault();
    const data = await apiFetch(`/success-stories/${editing._id}`, {
      method: 'PUT',
      body: { title: editing.title, content: editing.content, domain: editing.domain },
    });
    setStories((prev) => prev.map((s) => (s._id === editing._id ? data.story : s)));
    setEditing(null);
  }

  if (error) return <p className="container container-narrow field-error">{error}</p>;
  if (!stories) return <p className="container container-narrow muted">Loading...</p>;

  return (
    <section className="container">
      <div className="page-header">
        <h1>Manage Success Stories</h1>
        <p>Approve, edit, or remove submitted stories.</p>
      </div>

      {editing && (
        <form onSubmit={saveEdit} className="card" style={{ marginBottom: 'var(--space-5)' }}>
          <h3>Editing: {editing.title}</h3>
          <label>
            Title
            <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </label>
          <label>
            Domain
            <input value={editing.domain || ''} onChange={(e) => setEditing({ ...editing, domain: e.target.value })} />
          </label>
          <label>
            Content
            <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={4} />
          </label>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="card-list">
        {stories.map((s) => (
          <li key={s._id} className="card">
            <div className="row-between">
              <strong>{s.title}</strong>
              <span className={statusBadgeClass(s.status)}>{s.status}</span>
            </div>
            <p className="text-sm muted" style={{ margin: '4px 0' }}>
              {s.authorName} {s.domain ? `· ${s.domain}` : ''}
            </p>
            <p>{s.content}</p>
            <div className="row" style={{ gap: 6 }}>
              {s.status !== 'approved' && (
                <button type="button" className="btn-sm btn-primary" onClick={() => review(s._id, 'approved')}>
                  Approve
                </button>
              )}
              {s.status !== 'rejected' && (
                <button type="button" className="btn-sm" onClick={() => review(s._id, 'rejected')}>
                  Reject
                </button>
              )}
              <button type="button" className="btn-sm" onClick={() => setEditing(s)}>
                Edit
              </button>
              <button type="button" className="btn-sm btn-danger" onClick={() => remove(s._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
