import { useAuth } from '../auth/AuthProvider';

interface DashboardHeaderProps {
  cardFrozen: boolean;
}

export function DashboardHeader({ cardFrozen }: DashboardHeaderProps) {
  const auth = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="brand">Hush Bank</p>
        <p className="subtitle">Secure digital banking for modern goals</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="account-pill">
          <div>
            <span>Platinum</span>
            <strong>Member since 2024</strong>
          </div>
          <div className={`status-pill ${cardFrozen ? 'status-frozen' : 'status-active'}`}>
            {cardFrozen ? 'Card frozen' : 'Card active'}
          </div>
        </div>
        {auth?.user ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="text-muted">{auth.user.email}</span>
            <button className="button-secondary" onClick={() => auth.signOut()}>Log out</button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
