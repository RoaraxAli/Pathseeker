import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container container-narrow">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>Create your account</h1>
        <p>It's free — start exploring career paths in minutes.</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <label>
          Name
          <input value={form.name} onChange={update('name')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={update('email')} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            minLength={8}
            required
          />
        </label>
        <label>
          I am a...
          <select value={form.role} onChange={update('role')}>
            <option value="student">Student</option>
            <option value="graduate">Graduate</option>
            <option value="professional">Professional</option>
          </select>
        </label>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting && <span className="spinner" style={{ marginRight: 8 }} />}
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="text-sm muted" style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
}
