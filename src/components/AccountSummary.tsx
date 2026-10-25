type Account = {
  name: string;
  balance: number;
  available: number;
  number: string;
  currency: string;
};

interface AccountSummaryProps {
  accounts: Account[];
  onViewAllAccounts: () => void;
  onViewAccount: (account: Account) => void;
}

export function AccountSummary({ accounts, onViewAllAccounts, onViewAccount }: AccountSummaryProps) {
  return (
    <section className="panel panel-summary">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Accounts</p>
          <h2>Account summary</h2>
        </div>
        <button className="button-secondary" onClick={onViewAllAccounts}>View all</button>
      </div>
      <div className="account-list">
        {accounts.map((account) => (
          <div key={account.number} className="account-card">
            <div>
              <p className="account-name">{account.name}</p>
              <p className="account-number">{account.number}</p>
            </div>
            <div>
              <p className="account-balance">
                {account.currency} {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-muted">Available {account.currency} {account.available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <div style={{ marginTop: 10 }}>
                <button className="button-secondary" onClick={() => onViewAccount(account)}>
                  View details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
