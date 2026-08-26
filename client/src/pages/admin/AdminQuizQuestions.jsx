import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

const EMPTY_FORM = {
  text: '',
  type: 'rating',
  scaleMin: 1,
  scaleMax: 5,
  timeLimitSeconds: 15,
  categoryWeights: '', // "Technology:1, Science:0.5"
};

function parseWeights(str) {
  const weights = {};
  str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const [category, weight] = pair.split(':').map((s) => s.trim());
      if (category && weight) weights[category] = Number(weight);
    });
  return weights;
}

function weightsToString(weights) {
  if (!weights) return '';
  return Object.entries(weights)
    .map(([k, v]) => `${k}:${v}`)
    .join(', ');
}

export default function AdminQuizQuestions() {
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  function load() {
    apiFetch('/quiz/admin/questions')
      .then((data) => setQuestions(data.questions))
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function startEdit(q) {
    setEditingId(q._id);
    setForm({
      text: q.text,
      type: q.type,
      scaleMin: q.scaleMin,
      scaleMax: q.scaleMax,
      timeLimitSeconds: q.timeLimitSeconds,
      categoryWeights: weightsToString(q.categoryWeights),
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
        text: form.text,
        type: form.type,
        scaleMin: Number(form.scaleMin),
        scaleMax: Number(form.scaleMax),
        timeLimitSeconds: Number(form.timeLimitSeconds),
        categoryWeights: parseWeights(form.categoryWeights),
      };
      if (editingId) {
        await apiFetch(`/quiz/admin/questions/${editingId}`, { method: 'PUT', body });
      } else {
        await apiFetch('/quiz/admin/questions', { method: 'POST', body });
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await apiFetch(`/quiz/admin/questions/${id}`, { method: 'DELETE' });
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  }

  if (error && !questions) return <p className="container container-narrow field-error">{error}</p>;
  if (!questions) return <p className="container container-narrow muted">Loading...</p>;

  return (
    <section className="container">
      <div className="page-header">
        <h1>Manage Quiz Questions</h1>
        <p>This simple form supports rating/slider questions. Multiple-choice questions with options can be managed via the API directly.</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3>{editingId ? 'Edit question' : 'Add a question'}</h3>
        <input placeholder="Question text" value={form.text} onChange={update('text')} required />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          <select value={form.type} onChange={update('type')}>
            <option value="rating">Rating (Likert)</option>
            <option value="slider">Slider</option>
          </select>
          <input type="number" placeholder="Scale min" value={form.scaleMin} onChange={update('scaleMin')} />
          <input type="number" placeholder="Scale max" value={form.scaleMax} onChange={update('scaleMax')} />
          <input type="number" placeholder="Time limit (s)" value={form.timeLimitSeconds} onChange={update('timeLimitSeconds')} />
        </div>
        <input
          placeholder="Category weights, e.g. Technology:1, Science:0.5"
          value={form.categoryWeights}
          onChange={update('categoryWeights')}
        />
        {error && <p className="field-error">{error}</p>}
        <div className="form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Add question'}</button>
          {editingId && (
            <button type="button" className="btn-ghost" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="card-list">
        {questions.map((q) => (
          <li key={q._id} className="card">
            <div className="row-between">
              <strong>{q.text}</strong>
              <span className="badge">{q.type}</span>
            </div>
            <p className="text-sm muted">{weightsToString(q.categoryWeights) || '(multiple-choice options)'}</p>
            <div className="row" style={{ gap: 6 }}>
              {q.type !== 'multiple-choice' && (
                <button type="button" className="btn-sm" onClick={() => startEdit(q)}>
                  Edit
                </button>
              )}
              <button type="button" className="btn-sm btn-danger" onClick={() => remove(q._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
