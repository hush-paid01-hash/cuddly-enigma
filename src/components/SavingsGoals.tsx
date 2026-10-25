type Goal = {
  title: string;
  progress: number;
  target: number;
  current: number;
};

interface SavingsGoalsProps {
  goals: Goal[];
  onManageGoals?: () => void;
}

export function SavingsGoals({ goals, onManageGoals }: SavingsGoalsProps) {
  return (
    <section className="panel panel-goals">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Goals</p>
          <h2>Savings goals</h2>
        </div>
        <button className="button-secondary" onClick={onManageGoals}>Manage goals</button>
      </div>
      <div className="goal-cards">
        {goals.map((goal) => (
          <div key={goal.title} className="goal-card">
            <div className="goal-head">
              <p>{goal.title}</p>
              <strong>{goal.progress}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${goal.progress}%` }} />
            </div>
            <p className="text-muted">
              ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()} target
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
