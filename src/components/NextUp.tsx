import { useRef } from 'react';
import { Icon } from './Icons';
import { noteLimit, type resolveQueue } from '../lib/discovery';
import type { Site } from '../lib/sites';

type Props = {
  entries: ReturnType<typeof resolveQueue>;
  onOpen: (site: Site) => void;
  onNote: (id: string, note: string) => void;
  onFinish: (site: Site) => void;
  onExplore: () => void;
};

export function NextUp({
  entries,
  onOpen,
  onNote,
  onFinish,
  onExplore,
}: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <section className="next-up" aria-labelledby="next-up-title">
      <p className="eyebrow section-eyebrow">TURN CURIOSITY INTO A NEXT STEP</p>
      <h1 id="next-up-title" tabIndex={-1} ref={heading}>
        Next up <span className="site-count">{entries.length}</span>
      </h1>
      <p className="discovery-description">
        A small queue for things you want to try. Add a note, open a
        destination, then mark it done.
      </p>
      <p className="discovery-description">
        Saved only in this browser. Notes save as you type. Opening a link keeps
        it in your queue.
      </p>
      {entries.length ? (
        <ol className="queue-list">
          {entries.map(({ site, note }, index) => (
            <li className="queue-card" key={site.id}>
              <div className="queue-heading">
                <span className="queue-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${site.name} (opens in a new tab)`}
                  onClick={() => onOpen(site)}
                  onAuxClick={(event) => {
                    if (event.button === 1) onOpen(site);
                  }}
                >
                  <strong>{site.name}</strong>
                  <small>{new URL(site.url).hostname}</small>
                  <Icon name="external" />
                </a>
                <button
                  className="add-button"
                  aria-label={`Mark ${site.name} done`}
                  onClick={() => {
                    onFinish(site);
                    heading.current?.focus();
                  }}
                >
                  <Icon name="check" /> Done
                </button>
              </div>
              <label className="queue-note">
                Your next step for {site.name}
                <textarea
                  value={note}
                  maxLength={noteLimit}
                  rows={2}
                  placeholder="What would you like to do here?"
                  onChange={(event) => onNote(site.id, event.target.value)}
                />
              </label>
            </li>
          ))}
        </ol>
      ) : (
        <div className="empty-state">
          <Icon name="check" />
          <h2>Room for your next idea</h2>
          <p>Use “Next up” on any website card to save something to try.</p>
          <button className="add-button" onClick={onExplore}>
            Explore websites <Icon name="arrow" />
          </button>
        </div>
      )}
    </section>
  );
}
