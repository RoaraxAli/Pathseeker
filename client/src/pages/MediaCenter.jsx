import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function MediaCenter() {
  const [meta, setMeta] = useState({ domains: [], types: [] });
  const [filters, setFilters] = useState({ type: '', domain: '', q: '' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/media/meta').then(setMeta).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.domain) params.set('domain', filters.domain);
    if (filters.q) params.set('q', filters.q);
    apiFetch(`/media?${params.toString()}`)
      .then((data) => setItems(data.media))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  function update(field) {
    return (e) => setFilters((f) => ({ ...f, [field]: e.target.value }));
  }

  return (
    <section className="container container-wide">
      <div className="page-header">
        <h1>Multimedia Center</h1>
        <p>Videos, podcasts, and explainers from people working in the field.</p>
      </div>

      <div className="toolbar">
        <input placeholder="Search title..." value={filters.q} onChange={update('q')} style={{ width: 220 }} />
        <select value={filters.type} onChange={update('type')} style={{ width: 'auto' }}>
          <option value="">All types</option>
          {meta.types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={filters.domain} onChange={update('domain')} style={{ width: 'auto' }}>
          <option value="">All domains</option>
          {meta.domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="muted">
          <span className="spinner" style={{ marginRight: 8 }} />
          Loading...
        </p>
      )}
      {error && <p className="field-error">{error}</p>}

      <div className="grid">
        {items.map((item) => (
          <Link key={item._id} to={`/media/${item._id}`} className="card card-link" style={{ padding: 0, overflow: 'hidden' }}>
            {item.thumbnailUrl && (
              <img src={item.thumbnailUrl} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
            )}
            <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
              <div className="row" style={{ gap: 6, marginBottom: 4 }}>
                <span className="badge">{item.type}</span>
                {item.domain && <span className="badge badge-accent">{item.domain}</span>}
              </div>
              <strong>{item.title}</strong>
            </div>
          </Link>
        ))}
      </div>
      {!loading && items.length === 0 && <div className="empty-state">No media found.</div>}
    </section>
  );
}
