import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Film, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/feed';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Film size={26} className="text-amber" />
          </div>
          <h2>Welcome Back to FilmFolio</h2>
          <p>Sign in to access your feed posts, gear marketplace listings, and inquiries.</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><Mail size={14} /> Email Address</label>
            <input
              type="email"
              placeholder="nolan@filmfolio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={14} /> Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg full-width">
            {loading ? <div className="spinner" style={{ width: 18, height: 18 }}></div> : <LogIn size={18} />}
            <span>Sign In</span>
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup" className="link-amber">Register here</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          max-width: 440px;
          margin: 3rem auto;
        }

        .auth-card { padding: 2.5rem 2rem; }

        .auth-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .auth-logo {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          background: rgba(245, 158, 11, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .auth-header h2 { color: white; font-size: 1.5rem; }
        .auth-header p { color: var(--text-muted); font-size: 0.88rem; margin-top: 0.25rem; }

        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { color: white; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

        .error-alert {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(244, 63, 94, 0.15); color: var(--rose-danger);
          padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(244, 63, 94, 0.3);
          font-size: 0.85rem; margin-bottom: 1.25rem;
        }

        .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted); }
        .link-amber { color: var(--primary-amber); font-weight: 600; }
        .full-width { width: 100%; }
      `}</style>
    </div>
  );
}
