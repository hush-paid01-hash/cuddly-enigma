type Trend = {
  category: string;
  amount: number;
  color: string;
};

interface SpendingTrendsProps {
  trends: Trend[];
  onViewReport?: () => void;
}

export function SpendingTrends({ trends, onViewReport }: SpendingTrendsProps) {
  const max = Math.max(...trends.map((trend) => trend.amount));

  return (
    <section className="panel panel-trends">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Spending trends</h2>
        </div>
        <button className="button-secondary" onClick={onViewReport}>View report</button>
      </div>
      <div className="trend-list">
        {trends.map((trend) => (
          <div key={trend.category} className="trend-item">
            <div className="trend-meta">
              <p>{trend.category}</p>
              <strong>${trend.amount}</strong>
            </div>
            <div className="trend-bar-wrapper">
              <div
                className="trend-bar"
                style={{ width: `${(trend.amount / max) * 100}%`, background: trend.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
