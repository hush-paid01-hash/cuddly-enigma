import { Icon, PlatformIcon } from './Icons';
import type { Site } from '../lib/sites';

type FavoritesProps = {
  favoriteSites: Site[];
  editingFavorites: boolean;
  onToggleEditing: () => void;
  toggleFavorite: (site: Site) => void;
  reorderFavorite: (site: Site, direction: -1 | 1) => void;
};

export function Favorites({
  favoriteSites,
  editingFavorites,
  onToggleEditing,
  toggleFavorite,
  reorderFavorite,
}: FavoritesProps) {
  return (
    <section className="favorites-section" aria-labelledby="favorites-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow section-eyebrow">THE PLACES YOU COME BACK TO</p>
          <h2 id="favorites-title">
            <Icon name="star" /> Your favorites{' '}
            <span className="site-count">{favoriteSites.length}</span>
          </h2>
        </div>
        {favoriteSites.length > 0 && (
          <button
            className="add-button"
            onClick={onToggleEditing}
            aria-pressed={editingFavorites}
          >
            <Icon name={editingFavorites ? 'check' : 'reorder'} />
            {editingFavorites ? 'Done' : 'Reorder'}
          </button>
        )}
      </div>
      {editingFavorites && favoriteSites.length > 0 && (
        <p className="reorder-hint">
          Use the arrows to move a favorite earlier or later. Your order is
          saved automatically.
        </p>
      )}
      {favoriteSites.length > 0 ? (
        <ol className="favorites-grid">
          {favoriteSites.map((site, index) => (
            <li className="favorite-card" key={site.id}>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open favorite ${site.name} (opens in a new tab)`}
              >
                <span className={`platform-icon platform-${site.icon}`}>
                  <PlatformIcon name={site.icon} />
                </span>
                <span className="favorite-name">
                  {site.name}
                  <small>
                    {new URL(site.url).hostname.replace(/^www\./, '')}
                  </small>
                </span>
                <Icon name="external" />
              </a>
              {editingFavorites && (
                <div className="reorder-controls">
                  <span>
                    {index + 1} of {favoriteSites.length}
                  </span>
                  <button
                    aria-label={`Move ${site.name} earlier`}
                    aria-disabled={index === 0}
                    onClick={() => {
                      if (index > 0) reorderFavorite(site, -1);
                    }}
                  >
                    <Icon name="left" />
                  </button>
                  <button
                    aria-label={`Move ${site.name} later`}
                    aria-disabled={index === favoriteSites.length - 1}
                    onClick={() => {
                      if (index < favoriteSites.length - 1)
                        reorderFavorite(site, 1);
                    }}
                  >
                    <Icon name="right" />
                  </button>
                  <button
                    aria-label={`Unfavorite ${site.name}`}
                    onClick={() => toggleFavorite(site)}
                  >
                    <Icon name="close" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <div className="favorites-empty">
          <Icon name="star" />
          <p>
            Your favorites, your order. Star a website below to keep it close.
          </p>
        </div>
      )}
    </section>
  );
}
