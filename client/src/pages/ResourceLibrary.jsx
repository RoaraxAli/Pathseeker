import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

function PreviewModal({ resource, onClose }) {
  const isPdf = resource.previewUrl?.endsWith('.pdf') || resource.sourceType === 'upload';
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 'var(--space-4)',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: 700, height: '85%', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row-between" style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border)' }}>
          <strong>{resource.title}</strong>
          <button type="button" className="btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
        {isPdf ? (
          <iframe title={`Preview of ${resource.title}`} src={resource.previewUrl} style={{ flex: 1, border: 0 }} />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a href={resource.previewUrl} target="_blank" rel="noreferrer">
              Open external resource in a new tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResourceLibrary() {
  const [meta, setMeta] = useState({ domains: [], types: [] });
  const [filters, setFilters] = useState({ type: '', domain: '', q: '' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState(null);

  useEffect(() => {
    apiFetch('/resources/meta').then(setMeta).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.domain) params.set('domain', filters.domain);
    if (filters.q) params.set('q', filters.q);
    apiFetch(`/resources?${params.toString()}`)
      .then((data) => setItems(data.resources))
      .finally(() => setLoading(false));
  }, [filters]);

  function update(field) {
    return (e) => setFilters((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleDownload(resource) {
    // Hitting this path (not the static preview URL) is what increments
    // the server's download counter.
    window.location.href = `/api/resources/${resource._id}/download`;
    // Optimistically bump the local count so the UI reflects it immediately.
    setItems((prev) => prev.map((r) => (r._id === resource._id ? { ...r, downloadCount: r.downloadCount + 1 } : r)));
  }

  return (
    <section className="container">
      <div className="page-header">
        <h1>Resource Library</h1>
        <p>Downloadable checklists, guides, and templates.</p>
      </div>

      <div className="toolbar">
        <input placeholder="Search title..." value={filters.q} onChange={update('q')} style={{ width: 200 }} />
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

      <ul className="card-list">
        {items.map((r) => (
          <li key={r._id} className="card">
            <div className="row-between" style={{ alignItems: 'baseline' }}>
              <strong>{r.title}</strong>
              <div className="row" style={{ gap: 6 }}>
                <span className="badge">{r.type}</span>
                {r.domain && <span className="badge badge-accent">{r.domain}</span>}
              </div>
            </div>
            <p>{r.description}</p>
            <p className="text-sm muted">
              {r.downloadCount} download{r.downloadCount === 1 ? '' : 's'}
            </p>
            <div className="row" style={{ gap: 8 }}>
              <button type="button" className="btn-sm" onClick={() => setPreviewing(r)}>
                Preview
              </button>
              <button type="button" className="btn-sm btn-primary" onClick={() => handleDownload(r)}>
                Download
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!loading && items.length === 0 && <div className="empty-state">No resources found.</div>}

      {previewing && <PreviewModal resource={previewing} onClose={() => setPreviewing(null)} />}
    </section>
  );
}
