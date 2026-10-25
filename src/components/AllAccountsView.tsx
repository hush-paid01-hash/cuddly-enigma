import React from 'react';

type Account = {
  name: string;
  balance: number;
  available: number;
  number: string;
  currency: string;
};

export function AllAccountsView({ accounts, onClose, onViewAccount }: { accounts: Account[]; onClose: () => void; onViewAccount: (account: Account) => void }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Accounts</p>
            <h2>All accounts</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {accounts.map((acc) => (
            <div key={acc.number} className="account-card" style={{ alignItems: 'center' }}>
              <div>
                <p className="account-name">{acc.name}</p>
                <p className="account-number">{acc.number}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="account-balance">{acc.currency} {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <button className="button-secondary" onClick={() => onViewAccount(acc)}>View details</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, textAlign: 'right' }}>
          <button className="button-secondary" onClick={onClose}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
