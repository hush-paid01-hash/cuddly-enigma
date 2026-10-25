type QuickAction = 'Send money' | 'Pay bill' | 'Deposit check' | 'Freeze card';

interface QuickActionsProps {
  actions: ReadonlyArray<QuickAction>;
  onAction: (action: QuickAction) => void;
}

export function QuickActions({ actions, onAction }: QuickActionsProps) {
  return (
    <section className="panel panel-actions">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Actions</p>
          <h2>Quick banking</h2>
        </div>
      </div>
      <div className="action-grid">
        {actions.map((action) => (
          <button key={action} className="quick-action" onClick={() => onAction(action)}>
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}
