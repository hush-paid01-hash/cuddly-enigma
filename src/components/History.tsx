import { useState } from 'react';
import { Icon } from './Icons';
import type { HistoryEntry } from '../lib/history';

type HistoryProps = {
  entries: HistoryEntry[];
  recording: boolean;
  onOpen: (entry: HistoryEntry) => void;
  onClear: () => void;
  onSettings: () => void;
};

export function History({
  entries,
  recording,
  onOpen,
  onClear,
  onSettings,
}: HistoryProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  return (
    <section className="history-section" aria-labelledby="history-title">
      <p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p>
      <div className="section-heading">
        <h1 id="history-title">
          History <span className="site-count">{entries.length}</span>
        </h1>
        {entries.length > 0 && !confirmClear && (
          <button className="add-button" onClick={() => setConfirmClear(true)}>
            Clear history
          </button>
        )}
      </div>
      <p className="history-description">
        Your last 50 destinations opened from hush, most recent first.
        Saved only in this browser.
      </p>
      {!recording && (
        <p className="history-paused">
          History recording is paused.{' '}
          <button onClick={onSettings}>Manage in Settings</button>
        </p>
      )}
      {confirmClear && (
        <div
          className="history-confirm"
          role="group"
          aria-label="Confirm clear history"
        >
          <p>Clear all recently opened websites? This cannot be undone.</p>
          <button
            className="add-button"
            onClick={() => {
              onClear();
              setConfirmClear(false);
            }}
          >
            Yes, clear history
          </button>
          <button className="add-button" onClick={() => setConfirmClear(false)}>
            Cancel
          </button>
        </div>
      )}
      {entries.length > 0 ? (
        <ol className="history-list">
          {entries.map((entry) => (
            <li key={entry.url}>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Reopen ${entry.name} (opens in a new tab)`}
                onClick={() => onOpen(entry)}
                onAuxClick={(event) => {
                  if (event.button === 1) onOpen(entry);
                }}
              >
                <span className="history-icon">
                  <Icon name="globe" />
                </span>
                <span className="history-name">
                  <strong>{entry.name}</strong>
                  <small>
                    {new URL(entry.url).hostname.replace(/^www\./, '')}
                  </small>
                </span>
                <time dateTime={new Date(entry.openedAt).toISOString()}>
                  {new Date(entry.openedAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </time>
                <Icon name="external" />
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <div className="empty-state">
          <Icon name="history" />
          <h3>No recently opened websites</h3>
          <p>
            {recording
              ? 'Open a website from your favorites or website collection to find it here next time.'
              : 'Turn on history recording in Settings to remember websites you open.'}
          </p>
        </div>
      )}
    </section>
  );
}
