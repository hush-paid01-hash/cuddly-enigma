import React from 'react';

type Account = {
  name: string;
  balance: number;
  available: number;
  number: string;
  currency: string;
};

export function AccountDetailModal({ account, onClose }: { account: Account; onClose: () => void }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{account.name}</p>
            <h2>{account.number}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <p className="text-muted">Balance</p>
          <strong className="account-balance">{account.currency} {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          <p className="text-muted">Available {account.currency} {account.available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

          <div style={{ marginTop: 8 }}>
            <h3 className="eyebrow">Recent activity</h3>
            <p className="text-muted">Showing demo transactions for this account.</p>
            {/* Minimal placeholder list — keep the demo feel */}
            <div className="transactions-list" style={{ marginTop: 8 }}>
              <div className="transaction-row">
                <div>
                  <p className="transaction-date">Jul 24</p>
                  <p>Example charge</p>
                </div>
                <strong className="text-debit">-$12.34</strong>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, textAlign: 'right' }}>
          <button className="button-secondary" onClick={onClose}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
