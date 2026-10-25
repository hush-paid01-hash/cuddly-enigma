import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';

export function Login({ onSwitch }: { onSwitch?: (mode: 'signup' | 'login') => void }) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth) return;
    const { error } = await auth.signIn(email, password);
    if (error) setError(error.message || String(error));
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="button-primary" type="submit">Sign in</button>
          <button type="button" className="button-secondary" onClick={() => onSwitch?.('signup')}>Sign up</button>
        </div>
        {error ? <p className="text-muted" style={{ color: 'var(--danger)' }}>{error}</p> : null}
      </form>
    </div>
  );
}
