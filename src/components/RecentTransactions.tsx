type Transaction = {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
};

export function RecentTransactions({ transactions, onDownload }: { transactions: Transaction[]; onDownload?: () => void }) {
  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>Recent transactions</h2>
        </div>
        <button className="button-secondary" onClick={onDownload}>Download</button>
      </div>
      <div className="transactions-list">
        {transactions.map((transaction, index) => (
          <div key={`${transaction.date}-${index}`} className="transaction-row">
            <div>
              <p className="transaction-date">{transaction.date}</p>
              <p>{transaction.description}</p>
            </div>
            <strong className={transaction.type === 'credit' ? 'text-credit' : 'text-debit'}>
              {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
