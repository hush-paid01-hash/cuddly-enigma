import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';

export function SignUp({ onSwitch }: { onSwitch?: (mode: 'signup' | 'login') => void }) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth) return;
    const { error } = await auth.signUp(email, password);
    if (error) setError(error.message || String(error));
  };

  return (
    <div className="auth-card">
      <h2>Create account</h2>
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
          <button className="button-primary" type="submit">Create account</button>
          <button type="button" className="button-secondary" onClick={() => onSwitch?.('login')}>Back to login</button>
        </div>
        {error ? <p className="text-muted" style={{ color: 'var(--danger)' }}>{error}</p> : null}
      </form>
    </div>
  );
}
