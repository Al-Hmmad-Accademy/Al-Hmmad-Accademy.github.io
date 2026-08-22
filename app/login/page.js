'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';

const ROLES = [
  { key: 'student', label: 'Student' },
  { key: 'teacher', label: 'Teacher' },
  { key: 'admin', label: 'Admin' },
];

export default function Login() {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [otp, setOtp] = useState('');
  const [needOtp, setNeedOtp] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { login, verify } = useAuth();
  const router = useRouter();

  function resetMessages() {
    setMessage('');
    setError('');
  }

  /*
   * IMPORTANT:
   * Jab role change hoga:
   * Student -> Teacher
   * Teacher -> Admin
   * Admin -> Student
   *
   * username/password/OTP sab clear honge.
   */
  function changeRole(nextRole) {
    setRole(nextRole);

    setUsername('');
    setPassword('');
    setOtp('');

    setNeedOtp(false);
    setLoading(false);
    setResending(false);

    resetMessages();
  }

  async function submit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    resetMessages();

    try {
      const result = await login({
        role,
        username: username.trim(),
        password,
      });

      if (result?.requiresOtp) {
        setNeedOtp(true);
        setMessage(
          'A verification code has been sent to the administrator email.'
        );
        return;
      }

      router.push(`/dashboard?role=${role}`);
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    resetMessages();

    try {
      await verify({
        username: username.trim(),
        otp: otp.trim(),
      });

      router.push('/dashboard?role=admin');
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  }

  /*
   * Existing backend login endpoint already generates a new OTP.
   * Therefore resend simply logs in again with the same admin
   * username/password and asks backend for a fresh code.
   */
  async function resendOtp() {
    if (resending || role !== 'admin') return;

    setResending(true);
    resetMessages();

    try {
      const result = await login({
        role: 'admin',
        username: username.trim(),
        password,
      });

      if (result?.requiresOtp) {
        setMessage('A new verification code has been sent.');
      } else {
        setNeedOtp(false);
        router.push('/dashboard?role=admin');
        router.refresh();
      }
    } catch (err) {
      setError(err?.message || 'Unable to resend verification code.');
    } finally {
      setResending(false);
    }
  }

  function backToLogin() {
    setNeedOtp(false);
    setOtp('');
    setLoading(false);
    setResending(false);

    resetMessages();
  }

  return (
    <section className="auth-shell">
      <div className="container">
        <div className="card auth-card">
          <div className="eyebrow">Secure Academy Portal</div>

          <h1
            style={{
              fontSize: 'clamp(38px, 6vw, 56px)',
              marginTop: 15,
            }}
          >
            Welcome back.
          </h1>

          <p className="lead">
            Choose your portal and securely sign in to AALIYAAN Sciences
            Academy.
          </p>

          {!needOtp && (
            <div className="role-tabs" aria-label="Choose account type">
              {ROLES.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  className={role === item.key ? 'active' : ''}
                  onClick={() => changeRole(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {needOtp ? (
            <form className="grid" onSubmit={verifyOtp}>
              <div
                style={{
                  padding: '16px',
                  border: '1px solid var(--line)',
                  background: 'var(--panel2)',
                  marginBottom: 5,
                }}
              >
                <strong>Admin verification</strong>

                <p
                  style={{
                    margin: '7px 0 0',
                    color: 'var(--muted)',
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  Enter the 6-digit verification code sent to the registered
                  admin email address.
                </p>
              </div>

              <div className="field">
                <label htmlFor="otp">Email verification code</label>

                <input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                className="btn primary"
                type="submit"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying…' : 'Verify Device ↗'}
              </button>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  className="btn ghost"
                  onClick={backToLogin}
                  disabled={loading || resending}
                >
                  ← Back
                </button>

                <button
                  type="button"
                  className="btn ghost"
                  onClick={resendOtp}
                  disabled={loading || resending}
                >
                  {resending ? 'Sending…' : 'Resend Code'}
                </button>
              </div>
            </form>
          ) : (
            <form className="grid" onSubmit={submit}>
              <div className="field">
                <label htmlFor="username">Username</label>

                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder={`Enter ${role} username`}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                className="btn primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Login ↗'}
              </button>

              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setError(
                    'Forgot password will be connected to email verification in the next authentication update.'
                  );
                  setMessage('');
                }}
              >
                Forgot Password?
              </button>
            </form>
          )}

          {message && (
            <div
              className="toast"
              style={{
                position: 'static',
                marginTop: 18,
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <p
              style={{
                color: '#ff8f8f',
                fontWeight: 800,
                marginTop: 18,
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}