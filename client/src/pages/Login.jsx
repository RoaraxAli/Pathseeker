import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
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
        <h1>Welcome back</h1>
        <p>Log in to continue your journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting && <span className="spinner" style={{ marginRight: 8 }} />}
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="text-sm" style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p className="text-sm muted" style={{ textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}
