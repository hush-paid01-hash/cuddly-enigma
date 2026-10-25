import { FormEvent, useState } from 'react';

type QuickAction = 'Send money' | 'Pay bill' | 'Deposit check' | 'Freeze card';

interface ActionModalProps {
  action: QuickAction;
  onClose: () => void;
  onSubmit: (payload: {
    recipient?: string;
    amount?: number;
    biller?: string;
    checkAmount?: number;
  }) => void;
  isCardFrozen: boolean;
  onToggleFreeze: () => void;
}

export function ActionModal({ action, onClose, onSubmit, isCardFrozen, onToggleFreeze }: ActionModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [biller, setBiller] = useState('');
  const [checkAmount, setCheckAmount] = useState('');
  const [confirmDeposit, setConfirmDeposit] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('modal submit', action);

    if (action === 'Send money') {
      const value = Number(amount);
      if (!recipient || !amount || Number.isNaN(value)) return;
      console.log('send submit payload', { recipient, amount: value });
      onSubmit({ recipient, amount: value });
      return;
    }

    if (action === 'Pay bill') {
      const value = Number(amount);
      if (!biller || !amount || Number.isNaN(value)) return;
      console.log('bill submit payload', { biller, amount: value });
      onSubmit({ biller, amount: value });
      return;
    }

    if (action === 'Deposit check') {
      const value = Number(checkAmount);
      if (!checkAmount || Number.isNaN(value) || !confirmDeposit) return;
      console.log('deposit submit payload', { checkAmount: value });
      onSubmit({ checkAmount: value });
      return;
    }

    if (action === 'Freeze card') {
      onToggleFreeze();
    }
  };

  const renderForm = () => {
    if (action === 'Freeze card') {
      return (
        <div className="modal-action-content">
          <p className="modal-description">
            {isCardFrozen
              ? 'Your card is currently frozen. Toggle the switch below to unfreeze it and resume transactions.'
              : 'Freeze your card to prevent unauthorized charges instantly. You can unfreeze at any time.'}
          </p>
          <div className="freeze-toggle-row">
            <span>{isCardFrozen ? 'Card is frozen' : 'Card is active'}</span>
            <button type="button" className="button-primary" onClick={onToggleFreeze}>
              {isCardFrozen ? 'Unfreeze card' : 'Freeze card'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <form className="modal-form" onSubmit={handleSubmit}>
        {action === 'Send money' && (
          <>
            <label>
              Recipient
              <input
                type="text"
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                placeholder="Enter recipient"
                required
              />
            </label>
            <label>
              Amount
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                required
              />
            </label>
          </>
        )}

        {action === 'Pay bill' && (
          <>
            <label>
              Biller
              <input
                type="text"
                value={biller}
                onChange={(event) => setBiller(event.target.value)}
                placeholder="Enter biller"
                required
              />
            </label>
            <label>
              Amount
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                required
              />
            </label>
          </>
        )}

        {action === 'Deposit check' && (
          <>
            <label>
              Check amount
              <input
                type="number"
                min="0"
                step="0.01"
                value={checkAmount}
                onChange={(event) => setCheckAmount(event.target.value)}
                placeholder="0.00"
                required
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={confirmDeposit}
                onChange={(event) => setConfirmDeposit(event.target.checked)}
              />
              I confirm this check deposit.
            </label>
          </>
        )}

        <div className="modal-actions-row">
          <button type="button" className="button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button-primary">
            {action === 'Send money' && 'Send'}
            {action === 'Pay bill' && 'Pay'}
            {action === 'Deposit check' && 'Deposit'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{action}</p>
            <h2 id="modal-title">{action}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        {renderForm()}
      </div>
    </div>
  );
}
