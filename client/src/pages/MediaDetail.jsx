import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';
import BookmarkButton from '../components/BookmarkButton';

function isYouTubeEmbed(url) {
  return typeof url === 'string' && url.includes('youtube.com/embed/');
}

function StarRating({ myStars, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onRate(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: '1.6rem',
            lineHeight: 1,
            border: 'none',
            background: 'none',
            padding: 2,
            cursor: 'pointer',
            color: n <= (hover || myStars || 0) ? '#f5a623' : 'var(--border-strong)',
          }}
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ThumbsRating({ myThumbs, onRate }) {
  return (
    <div className="row" style={{ gap: 'var(--space-3)' }}>
      <button
        type="button"
        onClick={() => onRate('up')}
        style={{ fontSize: '1.6rem', border: 'none', background: 'none', padding: 2, cursor: 'pointer', opacity: myThumbs === 'up' ? 1 : 0.35 }}
        aria-label="Thumbs up"
      >
        👍
      </button>
      <button
        type="button"
        onClick={() => onRate('down')}
        style={{ fontSize: '1.6rem', border: 'none', background: 'none', padding: 2, cursor: 'pointer', opacity: myThumbs === 'down' ? 1 : 0.35 }}
        aria-label="Thumbs down"
      >
        👎
      </button>
    </div>
  );
}

export default function MediaDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [error, setError] = useState('');
  const [rateError, setRateError] = useState('');

  useEffect(() => {
    setData(null);
    setShowTranscript(false);
    apiFetch(`/media/${id}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [id]);

  async function submitRating(value) {
    setRateError('');
    try {
      const body = data.media.ratingType === 'stars' ? { stars: value } : { thumbs: value };
      const res = await apiFetch(`/media/${id}/rating`, { method: 'POST', body });
      setData((d) => ({ ...d, myRating: res.myRating, rating: res.rating }));
    } catch (err) {
      setRateError(err.message);
    }
  }

  if (error) return <p className="container container-narrow field-error">{error}</p>;
  if (!data) return <p className="container container-narrow muted">Loading...</p>;

  const { media, rating, myRating, related } = data;

  return (
    <section className="container container-narrow">
      <p>
        <Link to="/media">← Back to Multimedia Center</Link>
      </p>
      <h1 style={{ marginBottom: 4 }}>{media.title}</h1>
      <div className="row" style={{ gap: 6, marginBottom: 'var(--space-3)' }}>
        <span className="badge">{media.type}</span>
        {media.domain && <span className="badge badge-accent">{media.domain}</span>}
      </div>
      <BookmarkButton itemType="media" itemId={media._id} />

      <div
        style={{
          position: 'relative',
          paddingTop: '56.25%',
          margin: 'var(--space-5) 0',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {isYouTubeEmbed(media.url) ? (
          <iframe
            title={media.title}
            src={media.url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <video
            src={media.url}
            controls
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        )}
      </div>

      <p>{media.description}</p>

      {media.transcript && (
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <button type="button" className="btn-sm" onClick={() => setShowTranscript((s) => !s)}>
            {showTranscript ? 'Hide transcript' : 'Show transcript'}
          </button>
          {showTranscript && (
            <p className="card" style={{ marginTop: 'var(--space-3)' }}>
              {media.transcript}
            </p>
          )}
        </div>
      )}

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3>Rating</h3>
        {rating.type === 'stars' ? (
          <p className="muted">
            {rating.average ?? 'No ratings yet'} {rating.average && '★'} ({rating.count} rating
            {rating.count === 1 ? '' : 's'})
          </p>
        ) : (
          <p className="muted">
            {rating.percentUp !== null ? `${rating.percentUp}% liked this` : 'No ratings yet'} (
            {rating.count} vote{rating.count === 1 ? '' : 's'})
          </p>
        )}

        {user ? (
          <>
            {media.ratingType === 'stars' ? (
              <StarRating myStars={myRating?.stars} onRate={submitRating} />
            ) : (
              <ThumbsRating myThumbs={myRating?.thumbs} onRate={submitRating} />
            )}
            {rateError && <p className="field-error">{rateError}</p>}
          </>
        ) : (
          <p className="text-sm">
            <Link to="/login">Log in</Link> to rate this.
          </p>
        )}
      </div>

      {related.length > 0 && (
        <div>
          <h3>Related content</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {related.map((r) => (
              <Link key={r._id} to={`/media/${r._id}`} className="card card-link" style={{ padding: 0, overflow: 'hidden' }}>
                {r.thumbnailUrl && (
                  <img src={r.thumbnailUrl} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                )}
                <div style={{ padding: 'var(--space-2) var(--space-3)' }}>
                  <small>{r.title}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
