import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

const EMPTY_FORM = {
  title: '',
  domain: '',
  description: '',
  requiredSkills: '',
  salaryMin: '',
  salaryMax: '',
  jobDemand: 'medium',
};

function toForm(career) {
  return {
    title: career.title,
    domain: career.domain,
    description: career.description || '',
    requiredSkills: (career.requiredSkills || []).join(', '),
    salaryMin: career.salaryRange.min,
    salaryMax: career.salaryRange.max,
    jobDemand: career.jobDemand,
  };
}

function toBody(form) {
  return {
    title: form.title,
    domain: form.domain,
    description: form.description,
    requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
    salaryRange: { min: Number(form.salaryMin), max: Number(form.salaryMax) },
    jobDemand: form.jobDemand,
  };
}

export default function AdminCareers() {
  const [careers, setCareers] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  function load() {
    apiFetch('/careers?limit=200')
      .then((data) => setCareers(data.careers))
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function startEdit(career) {
    setEditingId(career._id);
    setForm(toForm(career));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const data = await apiFetch(`/careers/${editingId}`, { method: 'PUT', body: toBody(form) });
        setCareers((prev) => prev.map((c) => (c._id === editingId ? data.career : c)));
      } else {
        const data = await apiFetch('/careers', { method: 'POST', body: toBody(form) });
        setCareers((prev) => [data.career, ...prev]);
      }
      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await apiFetch(`/careers/${id}`, { method: 'DELETE' });
    setCareers((prev) => prev.filter((c) => c._id !== id));
  }

  if (error && !careers) return <p className="container container-narrow field-error">{error}</p>;
  if (!careers) return <p className="container container-narrow muted">Loading...</p>;

  return (
    <section className="container">
      <div className="page-header">
        <h1>Manage Careers</h1>
        <p>Add, edit, and remove career entries in the Career Bank.</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <h3>{editingId ? 'Edit career' : 'Add a career'}</h3>
        <input placeholder="Title" value={form.title} onChange={update('title')} required />
        <input placeholder="Domain" value={form.domain} onChange={update('domain')} required />
        <textarea placeholder="Description" value={form.description} onChange={update('description')} />
        <input placeholder="Skills (comma-separated)" value={form.requiredSkills} onChange={update('requiredSkills')} />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          <input type="number" placeholder="Min salary" value={form.salaryMin} onChange={update('salaryMin')} required />
          <input type="number" placeholder="Max salary" value={form.salaryMax} onChange={update('salaryMax')} required />
          <select value={form.jobDemand} onChange={update('jobDemand')}>
            <option value="low">Low demand</option>
            <option value="medium">Medium demand</option>
            <option value="high">High demand</option>
          </select>
        </div>
        {error && <p className="field-error">{error}</p>}
        <div className="form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Add career'}</button>
          {editingId && (
            <button type="button" className="btn-ghost" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="card-list">
        {careers.map((c) => (
          <li key={c._id} className="card row-between">
            <div>
              <strong>{c.title}</strong>
              <div className="row" style={{ marginTop: 4 }}>
                <span className="badge">{c.domain}</span>
              </div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <button type="button" className="btn-sm" onClick={() => startEdit(c)}>
                Edit
              </button>
              <button type="button" className="btn-sm btn-danger" onClick={() => remove(c._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
