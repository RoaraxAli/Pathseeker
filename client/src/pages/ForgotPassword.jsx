import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

// Two-step flow: request an OTP, then submit it with a new password.
// Both steps happen on this one page.
export default function ForgotPassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // 'request' | 'reset'

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleRequest(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });
      setMessage(data.message);
      setStep('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiFetch('/auth/reset-password', { method: 'POST', body: { email, otp, newPassword } });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container container-narrow">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>Reset your password</h1>
        <p>{step === 'request' ? "We'll email you a reset code." : 'Enter the code we sent you.'}</p>
      </div>

      {step === 'request' && (
        <form onSubmit={handleRequest} className="card">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Sending...' : 'Send reset code'}
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} className="card">
          {message && <p className="field-success">{message}</p>}
          <label>
            Reset code
            <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
          </label>
          <label>
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      )}

      <p className="text-sm muted" style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
        <Link to="/login">Back to login</Link>
      </p>
    </section>
  );
}
