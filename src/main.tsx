import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';

function Root() {
  const auth = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (!auth?.user) {
    return mode === 'login' ? <Login onSwitch={(m) => setMode(m)} /> : <SignUp onSwitch={(m) => setMode(m)} />;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>,
);
