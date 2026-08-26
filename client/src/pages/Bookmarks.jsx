import { useEffect, useState } from 'react';
import { apiFetch, getToken } from '../api/client';

function ShareBox() {
  const [shareUrl, setShareUrl] = useState('');
  const [error, setError] = useState('');

  async function createShare() {
    setError('');
    try {
      const data = await apiFetch('/bookmarks/share', { method: 'POST' });
      setShareUrl(`${window.location.origin}/share/bookmarks/${data.token}`);
    } catch (err) {
      setError(err.message);
    }
  }

  const shareText = encodeURIComponent('Check out my career bookmarks on PathSeeker!');
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
      <h3>Share</h3>
      {!shareUrl ? (
        <button type="button" className="btn-sm" onClick={createShare}>
          Create a shareable link
        </button>
      ) : (
        <>
          <input readOnly value={shareUrl} onFocus={(e) => e.target.select()} style={{ marginBottom: 'var(--space-3)' }} />
          <div className="row" style={{ gap: 'var(--space-4)' }}>
            <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`} target="_blank" rel="noreferrer">
              Share on X
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer">
              Share on LinkedIn
            </a>
          </div>
        </>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState(null);
  const [error, setError] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [editingNote, setEditingNote] = useState({}); // id -> draft text

  function load() {
    apiFetch('/bookmarks')
      .then((data) => setBookmarks(data.bookmarks))
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function saveNote(id) {
    const note = editingNote[id] ?? '';
    await apiFetch(`/bookmarks/${id}`, { method: 'PUT', body: { note } });
    setBookmarks((prev) => prev.map((b) => (b._id === id ? { ...b, note } : b)));
    setEditingNote((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function remove(id) {
    await apiFetch(`/bookmarks/${id}`, { method: 'DELETE' });
    setBookmarks((prev) => prev.filter((b) => b._id !== id));
  }

  function downloadPdf() {
    // A tracked-style forced download, same pattern as the Resource Library —
    // needs the auth header, so fetch as a blob rather than a plain <a href>.
    fetch('/api/bookmarks/export/pdf', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookmarks.pdf';
        a.click();
        URL.revokeObjectURL(url);
      });
  }

  async function emailBookmarks() {
    setEmailMessage('');
    try {
      const data = await apiFetch('/bookmarks/export/email', { method: 'POST', body: {} });
      setEmailMessage(data.message);
    } catch (err) {
      setEmailMessage(err.message);
    }
  }

  if (error) return <p className="container container-narrow field-error">{error}</p>;
  if (!bookmarks) return <p className="container container-narrow muted">Loading...</p>;

  return (
    <section className="container container-narrow">
      <div className="page-header">
        <h1>My Bookmarks</h1>
        <p>Careers, videos, and resources you've saved.</p>
      </div>

      <div className="row" style={{ marginBottom: 'var(--space-3)' }}>
        <button type="button" className="btn-sm" onClick={downloadPdf}>
          Export as PDF
        </button>
        <button type="button" className="btn-sm" onClick={emailBookmarks}>
          Email to me
        </button>
      </div>
      {emailMessage && <p className="text-sm muted">{emailMessage}</p>}

      <ShareBox />

      {bookmarks.length === 0 && (
        <div className="empty-state">No bookmarks yet — bookmark a career, video, or resource to see it here.</div>
      )}

      <ul className="card-list">
        {bookmarks.map((b) => (
          <li key={b._id} className="card">
            <div className="row-between">
              <strong>{b.title}</strong>
              <span className="badge">{b.itemType}</span>
            </div>
            {editingNote[b._id] !== undefined ? (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <textarea
                  value={editingNote[b._id]}
                  onChange={(e) => setEditingNote((prev) => ({ ...prev, [b._id]: e.target.value }))}
                  rows={2}
                />
                <button type="submit" className="btn-sm" onClick={() => saveNote(b._id)}>
                  Save note
                </button>
              </div>
            ) : (
              <p
                onClick={() => setEditingNote((prev) => ({ ...prev, [b._id]: b.note || '' }))}
                className={b.note ? 'text-sm' : 'text-sm muted'}
                style={{ cursor: 'pointer', marginTop: 'var(--space-2)' }}
              >
                {b.note || 'Click to add a note...'}
              </p>
            )}
            <button type="button" className="btn-ghost btn-sm" onClick={() => remove(b._id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
