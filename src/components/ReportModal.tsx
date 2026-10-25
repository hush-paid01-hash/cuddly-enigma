import React from 'react';

export function ReportModal({ trends, transactions, onClose }: { trends: { category: string; amount: number; color: string }[]; transactions: any[]; onClose: () => void }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Report</p>
            <h2>Spending report</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <p className="text-muted">Summary of spending categories (demo)</p>
          <div className="trend-list">
            {trends.map((t) => (
              <div key={t.category} className="trend-item">
                <div className="trend-meta">
                  <p>{t.category}</p>
                  <strong>${t.amount}</strong>
                </div>
                <div className="trend-bar-wrapper">
                  <div className="trend-bar" style={{ width: `${t.amount}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 8 }}>
            <h3 className="eyebrow">Recent transactions</h3>
            <div className="transactions-list">
              {transactions.map((tr, i) => (
                <div key={`${tr.date}-${i}`} className="transaction-row">
                  <div>
                    <p className="transaction-date">{tr.date}</p>
                    <p>{tr.description}</p>
                  </div>
                  <strong className={tr.type === 'credit' ? 'text-credit' : 'text-debit'}>{tr.type === 'credit' ? '+' : '-'}${Math.abs(tr.amount).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, textAlign: 'right' }}>
          <button className="button-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
