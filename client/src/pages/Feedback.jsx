import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

export default function Feedback() {
  const { user } = useAuth();
  const [form, setForm] = useState({ type: 'suggestion', message: '', email: '' });
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
      await apiFetch('/feedback', { method: 'POST', body: form });
      setMessage('Thanks — your feedback was submitted.');
      setForm({ type: 'suggestion', message: '', email: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container container-narrow">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>Feedback</h1>
        <p>Found a bug, have a suggestion, or a question? Let us know.</p>
      </div>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Type
          <select value={form.type} onChange={update('type')}>
            <option value="bug">Bug</option>
            <option value="suggestion">Suggestion</option>
            <option value="query">Question</option>
          </select>
        </label>
        <label>
          Message
          <textarea value={form.message} onChange={update('message')} required rows={5} />
        </label>
        {!user && (
          <label>
            Your email (so we can follow up)
            <input type="email" value={form.email} onChange={update('email')} required />
          </label>
        )}
        {message && <p className="field-success">{message}</p>}
        {error && <p className="field-error">{error}</p>}
        <button type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Submitting...' : 'Submit feedback'}
        </button>
      </form>
    </section>
  );
}
