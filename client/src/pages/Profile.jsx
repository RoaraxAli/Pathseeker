import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch, getToken } from '../api/client';

function TagList({ label, items, onChange }) {
  const [draft, setDraft] = useState('');

  // Not a <form> — this whole component gets rendered inside Profile's
  // outer <form onSubmit={handleSave}>, and nested <form> elements are
  // invalid HTML (the browser silently mis-nests them, so Enter here could
  // end up submitting the wrong form). Enter-to-submit is wired manually.
  function addTag() {
    const value = draft.trim();
    if (!value || items.includes(value)) return;
    onChange([...items, value]);
    setDraft('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }

  function removeTag(tag) {
    onChange(items.filter((t) => t !== tag));
  }

  return (
    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
      <h3>{label}</h3>
      <div className="row" style={{ gap: 6, marginBottom: items.length ? 'var(--space-3)' : 0 }}>
        {items.map((tag) => (
          <span key={tag} className="badge badge-accent">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              style={{ border: 'none', background: 'none', padding: 0, marginLeft: 2, color: 'inherit', fontSize: '0.9em', lineHeight: 1 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="row">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add a ${label.toLowerCase().replace(/s$/, '')}`}
          style={{ width: 220 }}
        />
        <button type="button" className="btn-sm" onClick={addTag}>
          Add
        </button>
      </div>
    </div>
  );
}

function EntryGrid({ children }) {
  return <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: 'var(--space-3)' }}>{children}</div>;
}

function EducationEditor({ items, onChange }) {
  function updateEntry(i, field, value) {
    const next = items.map((entry, idx) => (idx === i ? { ...entry, [field]: value } : entry));
    onChange(next);
  }

  function removeEntry(i) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function addEntry() {
    onChange([...items, { school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }]);
  }

  return (
    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
      <h3>Education</h3>
      {items.map((entry, i) => (
        <div key={entry._id || i} className="card" style={{ marginBottom: 'var(--space-3)', background: 'var(--surface-hover)' }}>
          <EntryGrid>
            <input placeholder="School" value={entry.school || ''} onChange={(e) => updateEntry(i, 'school', e.target.value)} />
            <input placeholder="Degree" value={entry.degree || ''} onChange={(e) => updateEntry(i, 'degree', e.target.value)} />
            <input placeholder="Field of study" value={entry.fieldOfStudy || ''} onChange={(e) => updateEntry(i, 'fieldOfStudy', e.target.value)} />
            <input
              type="number"
              placeholder="Start year"
              value={entry.startYear || ''}
              onChange={(e) => updateEntry(i, 'startYear', Number(e.target.value) || '')}
            />
            <input
              type="number"
              placeholder="End year"
              value={entry.endYear || ''}
              onChange={(e) => updateEntry(i, 'endYear', Number(e.target.value) || '')}
            />
          </EntryGrid>
          <button type="button" className="btn-ghost btn-sm" onClick={() => removeEntry(i)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn-sm" onClick={addEntry}>
        + Add education
      </button>
    </div>
  );
}

function WorkExperienceEditor({ items, onChange }) {
  function updateEntry(i, field, value) {
    const next = items.map((entry, idx) => (idx === i ? { ...entry, [field]: value } : entry));
    onChange(next);
  }

  function removeEntry(i) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function addEntry() {
    onChange([...items, { company: '', title: '', startDate: '', endDate: '', description: '' }]);
  }

  return (
    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
      <h3>Work Experience</h3>
      {items.map((entry, i) => (
        <div key={entry._id || i} className="card" style={{ marginBottom: 'var(--space-3)', background: 'var(--surface-hover)' }}>
          <EntryGrid>
            <input placeholder="Company" value={entry.company || ''} onChange={(e) => updateEntry(i, 'company', e.target.value)} />
            <input placeholder="Title" value={entry.title || ''} onChange={(e) => updateEntry(i, 'title', e.target.value)} />
            <input
              type="date"
              value={entry.startDate ? entry.startDate.slice(0, 10) : ''}
              onChange={(e) => updateEntry(i, 'startDate', e.target.value)}
            />
            <input
              type="date"
              value={entry.endDate ? entry.endDate.slice(0, 10) : ''}
              onChange={(e) => updateEntry(i, 'endDate', e.target.value)}
            />
          </EntryGrid>
          <textarea
            placeholder="Description"
            value={entry.description || ''}
            onChange={(e) => updateEntry(i, 'description', e.target.value)}
            style={{ marginBottom: 'var(--space-3)' }}
          />
          <button type="button" className="btn-ghost btn-sm" onClick={() => removeEntry(i)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn-sm" onClick={addEntry}>
        + Add experience
      </button>
    </div>
  );
}

function ResumeSection({ resume, onUploaded, onDeleted }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const form = new FormData();
      form.append('resume', file);
      const data = await apiFetch('/users/me/resume', { method: 'POST', body: form, isForm: true });
      onUploaded(data.user.resume);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    setError('');
    try {
      await apiFetch('/users/me/resume', { method: 'DELETE' });
      onDeleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Downloads need the auth header, so a plain <a href> won't work —
  // fetch the file as a blob and hand the browser a temporary object URL.
  async function handleDownload() {
    const res = await fetch('/api/users/me/resume', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resume.originalName || 'resume';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
      <h3>Resume</h3>
      {resume ? (
        <div className="row-between" style={{ marginBottom: 'var(--space-3)' }}>
          <span className="text-sm">
            {resume.originalName} <span className="muted">({Math.round(resume.size / 1024)} KB)</span>
          </span>
          <div className="row" style={{ gap: 6 }}>
            <button type="button" className="btn-sm" onClick={handleDownload}>
              Download
            </button>
            <button type="button" className="btn-sm btn-danger" onClick={handleDelete} disabled={busy}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <p className="muted text-sm">No resume uploaded yet.</p>
      )}
      <form onSubmit={handleUpload} className="row">
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0] || null)} style={{ width: 'auto' }} />
        <button type="submit" className="btn-sm" disabled={!file || busy}>
          {busy ? 'Uploading...' : resume ? 'Replace resume' : 'Upload resume'}
        </button>
      </form>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const [form, setForm] = useState({
    education: user.education,
    skills: user.skills,
    interests: user.interests,
    workExperience: user.workExperience,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const data = await apiFetch('/users/me', { method: 'PUT', body: form });
      setUser(data.user);
      setMessage('Profile saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="container">
      <div className="row-between page-header">
        <div className="row" style={{ gap: 'var(--space-4)' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.25rem',
              flexShrink: 0,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ marginBottom: 2 }}>{user.name}</h1>
            <p className="muted text-sm" style={{ marginBottom: 0 }}>
              {user.email} <span className="badge" style={{ marginLeft: 6 }}>{user.role}</span>
            </p>
          </div>
        </div>
        <button type="button" className="btn-ghost btn-sm" onClick={logout}>
          Log out
        </button>
      </div>

      <ResumeSection
        resume={user.resume}
        onUploaded={(resume) => setUser((u) => ({ ...u, resume }))}
        onDeleted={() => setUser((u) => ({ ...u, resume: null }))}
      />

      <form onSubmit={handleSave}>
        <EducationEditor items={form.education} onChange={(education) => setForm((f) => ({ ...f, education }))} />
        <TagList label="Skills" items={form.skills} onChange={(skills) => setForm((f) => ({ ...f, skills }))} />
        <TagList label="Interests" items={form.interests} onChange={(interests) => setForm((f) => ({ ...f, interests }))} />
        <WorkExperienceEditor
          items={form.workExperience}
          onChange={(workExperience) => setForm((f) => ({ ...f, workExperience }))}
        />

        {message && <p className="field-success">{message}</p>}
        {error && <p className="field-error">{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </section>
  );
}
