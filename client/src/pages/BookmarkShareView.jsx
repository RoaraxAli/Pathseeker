import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

// Public, no-auth page — anyone with the link can view this snapshot.
export default function BookmarkShareView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/bookmarks/share/${token}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);

  if (error) return <p className="container container-narrow field-error">{error}</p>;
  if (!data) return <p className="container container-narrow muted">Loading...</p>;

  return (
    <section className="container container-narrow">
      <div className="page-header">
        <h1>Shared Bookmarks</h1>
        <p>Shared on {new Date(data.createdAt).toLocaleDateString()}</p>
      </div>
      <ul className="card-list">
        {data.items.map((item, i) => (
          <li key={i} className="card">
            <div className="row-between">
              <strong>{item.title}</strong>
              <span className="badge">{item.itemType}</span>
            </div>
            {item.note && <p style={{ marginTop: 'var(--space-2)' }}>{item.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
