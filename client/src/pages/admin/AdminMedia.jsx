import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

const EMPTY_FORM = {
  title: '',
  type: 'video',
  domain: '',
  tags: '',
  description: '',
  externalUrl: '',
  ratingType: 'stars',
};

export default function AdminMedia() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  function load() {
    apiFetch('/media')
      .then((data) => setItems(data.media))
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      type: item.type,
      domain: item.domain || '',
      tags: (item.tags || []).join(', '),
      description: item.description || '',
      externalUrl: item.sourceType === 'external' ? item.url : '',
      ratingType: item.ratingType,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const body = {
        title: form.title,
        type: form.type,
        domain: form.domain,
        tags: form.tags,
        description: form.description,
        externalUrl: form.externalUrl,
        ratingType: form.ratingType,
      };
      if (editingId) {
        await apiFetch(`/media/${editingId}`, { method: 'PUT', body });
      } else {
        if (!form.externalUrl) {
          setError('externalUrl is required (file upload not supported from this simple form)');
          return;
        }
        await apiFetch('/media', { method: 'POST', body });
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await apiFetch(`/media/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((m) => m._id !== id));
  }

  if (error && !items) return <p className="container container-narrow field-error">{error}</p>;
  if (!items) return <p className="container container-narrow muted">Loading...</p>;

  return (
    <section className="container">
      <div className="page-header">
        <h1>Manage Media</h1>
        <p>This form supports external URLs (e.g. YouTube embeds). File uploads are available via the API directly.</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3>{editingId ? 'Edit media' : 'Add media'}</h3>
        <input placeholder="Title" value={form.title} onChange={update('title')} required />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          <select value={form.type} onChange={update('type')}>
            <option value="video">Video</option>
            <option value="podcast">Podcast</option>
            <option value="explainer">Explainer</option>
          </select>
          <input placeholder="Domain" value={form.domain} onChange={update('domain')} />
          <select value={form.ratingType} onChange={update('ratingType')}>
            <option value="stars">Star rating</option>
            <option value="thumbs">Thumbs up/down</option>
          </select>
        </div>
        <input placeholder="Tags (comma-separated)" value={form.tags} onChange={update('tags')} />
        <textarea placeholder="Description" value={form.description} onChange={update('description')} />
        <input
          placeholder="External URL (e.g. https://www.youtube.com/embed/VIDEO_ID)"
          value={form.externalUrl}
          onChange={update('externalUrl')}
        />
        {error && <p className="field-error">{error}</p>}
        <div className="form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Add media'}</button>
          {editingId && (
            <button type="button" className="btn-ghost" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="card-list">
        {items.map((m) => (
          <li key={m._id} className="card row-between">
            <div>
              <strong>{m.title}</strong>
              <div className="row" style={{ marginTop: 4, gap: 6 }}>
                <span className="badge">{m.type}</span>
                {m.domain && <span className="badge badge-accent">{m.domain}</span>}
              </div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <button type="button" className="btn-sm" onClick={() => startEdit(m)}>
                Edit
              </button>
              <button type="button" className="btn-sm btn-danger" onClick={() => remove(m._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
