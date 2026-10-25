import { useMemo, useState } from 'react';

type Goal = { title: string; progress: number; target: number; current: number };

interface GoalsModalProps {
  goals: Goal[];
  onClose: () => void;
  onUpdateGoal?: (title: string, nextProgress: number) => void;
}

export function GoalsModal({ goals, onClose, onUpdateGoal }: GoalsModalProps) {
  const [selectedGoalTitle, setSelectedGoalTitle] = useState<string | null>(null);
  const [draftProgress, setDraftProgress] = useState('');

  const selectedGoal = useMemo(() => goals.find((goal) => goal.title === selectedGoalTitle) ?? null, [goals, selectedGoalTitle]);

  const handleEdit = (goal: Goal) => {
    setSelectedGoalTitle(goal.title);
    setDraftProgress(String(goal.progress));
  };

  const handleSave = () => {
    if (!selectedGoal) return;
    const nextProgress = Number(draftProgress);
    if (!Number.isNaN(nextProgress) && onUpdateGoal) {
      onUpdateGoal(selectedGoal.title, Math.min(100, Math.max(0, nextProgress)));
    }
    setSelectedGoalTitle(null);
    setDraftProgress('');
  };

  const handleCancel = () => {
    setSelectedGoalTitle(null);
    setDraftProgress('');
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Goals</p>
            <h2>{selectedGoal ? 'Edit goal' : 'Manage savings goals'}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        {selectedGoal ? (
          <div className="modal-form" style={{ gap: 16 }}>
            <p className="modal-description">Editing {selectedGoal.title}.</p>
            <label>
              Progress
              <input
                type="number"
                min="0"
                max="100"
                value={draftProgress}
                onChange={(event) => setDraftProgress(event.target.value)}
              />
            </label>
            <div className="modal-actions-row">
              <button type="button" className="button-secondary" onClick={handleCancel}>Cancel</button>
              <button type="button" className="button-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: 12 }}>
              {goals.map((goal) => (
                <div key={goal.title} className="goal-card">
                  <div className="goal-head">
                    <p>{goal.title}</p>
                    <strong>{goal.progress}%</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <p className="text-muted">${goal.current.toLocaleString()} of ${goal.target.toLocaleString()} target</p>
                  <div style={{ marginTop: 8, textAlign: 'right' }}>
                    <button type="button" className="button-secondary" onClick={() => handleEdit(goal)}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18, textAlign: 'right' }}>
              <button type="button" className="button-secondary" onClick={onClose}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
