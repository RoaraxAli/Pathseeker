import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

// Small toggle button for bookmarking a career/media/resource/story item.
// Looks up whether it's already bookmarked on mount so the button state is
// correct even after a page refresh.
export default function BookmarkButton({ itemType, itemId }) {
  const { user } = useAuth();
  const [bookmarkId, setBookmarkId] = useState(undefined); // undefined = loading, null = not bookmarked
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setBookmarkId(null);
      return;
    }
    apiFetch(`/bookmarks?itemType=${itemType}`)
      .then((data) => {
        const existing = data.bookmarks.find((b) => String(b.itemId) === String(itemId));
        setBookmarkId(existing ? existing._id : null);
      })
      .catch(() => setBookmarkId(null));
  }, [user, itemType, itemId]);

  async function toggle() {
    if (!user || busy) return;
    setBusy(true);
    try {
      if (bookmarkId) {
        await apiFetch(`/bookmarks/${bookmarkId}`, { method: 'DELETE' });
        setBookmarkId(null);
      } else {
        const data = await apiFetch('/bookmarks', { method: 'POST', body: { itemType, itemId } });
        setBookmarkId(data.bookmark._id);
      }
    } finally {
      setBusy(false);
    }
  }

  if (!user) return null;
  if (bookmarkId === undefined) return null;

  return (
    <button
      type="button"
      className={`btn-sm${bookmarkId ? ' btn-primary' : ' btn-ghost'}`}
      onClick={toggle}
      disabled={busy}
      aria-pressed={!!bookmarkId}
      style={{ marginTop: 'var(--space-3)' }}
    >
      {bookmarkId ? '★ Bookmarked' : '☆ Bookmark'}
    </button>
  );
}
