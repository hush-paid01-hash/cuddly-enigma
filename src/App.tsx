import { useEffect, useState, type FormEvent } from 'react';
import { Icon, PlatformIcon } from './components/Icons';
import { AppearancePanel } from './components/AppearancePanel';
import { Favorites } from './components/Favorites';
import {
  defaultSites,
  readSavedSites,
  normalizeUrl,
  type Site,
} from './lib/sites';

import {
  moveFavorite,
  readPreferences,
  savePreferences,
  type Preferences,
} from './lib/preferences';

const categories = [
  'All websites',
  'Social',
  'Entertainment',
  'Work',
  'My links',
] as const;
type Category = (typeof categories)[number];

function App() {
  const [preferences, setPreferences] = useState(readPreferences);
  const [showAppearance, setShowAppearance] = useState(false);
  const [editingFavorites, setEditingFavorites] = useState(false);
  const [savedSites, setSavedSites] = useState<Site[]>(readSavedSites);
  const [category, setCategory] = useState<Category>('All websites');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const sites = [...defaultSites, ...savedSites];
  const favoriteSites = preferences.favorites.flatMap((id) => {
    const site = sites.find((item) => item.id === id);
    return site ? [site] : [];
  });
  const favoriteIds = favoriteSites.map((site) => site.id);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      document.documentElement.dataset.theme =
        preferences.mode === 'system'
          ? media.matches
            ? 'dark'
            : 'light'
          : preferences.mode;
    };
    applyTheme();
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [preferences.mode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', preferences.accent);
  }, [preferences.accent]);

  function updatePreferences(next: Preferences, message: string) {
    setPreferences(next);
    const persisted = savePreferences(next);
    setNotice(
      persisted
        ? message
        : `${message} For this visit only; your browser could not save the change.`,
    );
  }

  function toggleFavorite(site: Site) {
    const isFavorite = preferences.favorites.includes(site.id);
    updatePreferences(
      {
        ...preferences,
        favorites: isFavorite
          ? favoriteIds.filter((id) => id !== site.id)
          : [...favoriteIds, site.id],
      },
      `${site.name} ${isFavorite ? 'removed from' : 'added to'} favorites.`,
    );
  }

  function reorderFavorite(site: Site, direction: -1 | 1) {
    const favorites = moveFavorite(favoriteIds, site.id, direction);
    updatePreferences(
      { ...preferences, favorites },
      `${site.name} moved to position ${favorites.indexOf(site.id) + 1} of ${favorites.length}.`,
    );
  }

  const visibleSites = sites.filter(
    (site) =>
      (category === 'All websites' || site.category === category) &&
      `${site.name} ${site.url}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );

  function updateSavedSites(next: Site[]) {
    setSavedSites(next);
    try {
      localStorage.setItem('launchpad-links', JSON.stringify(next));
      return true;
    } catch {
      return false;
    }
  }

  function addSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const destination = normalizeUrl(url);
    if (!destination) {
      setError(
        'Enter a valid website address, such as https://example.com. Only HTTP and HTTPS links are supported.',
      );
      return;
    }
    if (!name.trim()) {
      setError('Give your website a name.');
      return;
    }
    const persisted = updateSavedSites([
      ...savedSites,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        url: destination,
        description: 'Your own little corner of the internet.',
        category: 'My links',
        icon: 'globe',
      },
    ]);
    setName('');
    setUrl('');
    setShowForm(false);
    setCategory('My links');
    setSearch('');
    setNotice(
      persisted
        ? 'Website added. Saved in this browser for next time.'
        : 'Website added for this visit. Your browser could not save it for next time.',
    );
  }

  function removeSite(site: Site) {
    const persisted = updateSavedSites(
      savedSites.filter((saved) => saved.id !== site.id),
    );
    const nextPreferences = {
      ...preferences,
      favorites: preferences.favorites.filter((id) => id !== site.id),
    };
    const favoritesPersisted = savePreferences(nextPreferences);
    setPreferences(nextPreferences);
    setNotice(
      persisted && favoritesPersisted
        ? `${site.name} removed.`
        : `${site.name} removed for this visit. Your browser could not save the change.`,
    );
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar" aria-label="Website categories">
        <a className="brand" href="./" aria-label="Launchpad home">
          <span className="brand-symbol">
            <Icon name="arrow" />
          </span>
          launchpad<span className="brand-dot">.</span>
        </a>
        <div className="workspace-label">YOUR DAILY STARTING POINT</div>
        <nav className="navigation">
          {categories.map((item, index) => (
            <button
              key={item}
              className={category === item ? 'nav-item active' : 'nav-item'}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              <Icon
                name={['grid', 'people', 'play', 'briefcase', 'link'][index]}
              />
              <span>{item}</span>
              {item === 'All websites' && (
                <span className="nav-count">{sites.length}</span>
              )}
              {item === 'My links' && savedSites.length > 0 && (
                <span className="nav-count">{savedSites.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="note-icon">
            <Icon name="spark" />
          </span>
          <h3>
            A little less searching.
            <br />A lot more exploring.
          </h3>
          <p>Your favorite places on the web, all within reach.</p>
          <span className="note-doodle" aria-hidden="true">
            ↗
          </span>
        </div>
        <div className="sidebar-footer">
          <span className="status-dot" />
          Your internet, one click away.
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            Your space <span>/</span> <strong>{category}</strong>
          </div>
          <button
            className="appearance-button"
            onClick={() => setShowAppearance(!showAppearance)}
            aria-expanded={showAppearance}
            aria-controls="appearance-panel"
          >
            <Icon name="palette" /> <span>Personalize</span>
          </button>
        </header>
        <main id="main">
          {showAppearance && (
            <AppearancePanel
              preferences={preferences}
              updatePreferences={updatePreferences}
              onClose={() => setShowAppearance(false)}
            />
          )}
          <p className="notice" role="status">
            {notice}
          </p>
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">
                <span /> A SMALL SHORTCUT TO A BIG WORLD
              </p>
              <h1>
                Good things are
                <br />
                just a <span>click away.</span>
              </h1>
              <p className="hero-description">
                Catch up, get inspired, or find your next rabbit hole.
                <br className="desktop-break" /> Open the places you love,
                straight from here.
              </p>
              <a className="hero-button" href="#websites">
                Explore your websites <Icon name="arrow" />
              </a>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <span className="art-spark spark-one">✳</span>
              <span className="art-spark spark-two">✦</span>
              <div className="floating-tile tile-instagram">
                <PlatformIcon name="instagram" />
              </div>
              <div className="floating-tile tile-facebook">
                <PlatformIcon name="facebook" />
              </div>
              <div className="floating-tile tile-youtube">
                <PlatformIcon name="youtube" />
              </div>
              <span className="art-caption">
                SO MANY PLACES. ONE LAUNCHPAD.
              </span>
            </div>
          </section>

          <Favorites
            favoriteSites={favoriteSites}
            editingFavorites={editingFavorites}
            onToggleEditing={() => setEditingFavorites(!editingFavorites)}
            toggleFavorite={toggleFavorite}
            reorderFavorite={reorderFavorite}
          />
          <section
            className="websites-section"
            id="websites"
            aria-labelledby="websites-title"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow section-eyebrow">PICK A DESTINATION</p>
                <h2 id="websites-title">
                  {category === 'All websites'
                    ? 'Your everyday internet'
                    : category}
                  <span className="site-count">{visibleSites.length}</span>
                </h2>
              </div>
              <button
                className="add-button"
                onClick={() => {
                  setShowForm(!showForm);
                  setError('');
                }}
                aria-expanded={showForm}
                aria-controls="add-website"
              >
                <Icon name="plus" /> Add a website
              </button>
            </div>
            {showForm && (
              <form className="add-form" id="add-website" onSubmit={addSite}>
                <div className="form-heading">
                  <h3>Make room for a favorite</h3>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Close add website form"
                    onClick={() => setShowForm(false)}
                  >
                    <Icon name="close" />
                  </button>
                </div>
                <p>Add any website. Your links are saved in this browser.</p>
                <div className="form-fields">
                  <label>
                    Website name
                    <input
                      autoFocus
                      required
                      maxLength={60}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. My favorite blog"
                    />
                  </label>
                  <label>
                    Website address
                    <input
                      required
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                      placeholder="https://example.com"
                      aria-describedby={error ? 'url-error' : undefined}
                      aria-invalid={Boolean(error)}
                    />
                  </label>
                  <button className="save-button" type="submit">
                    Save website <Icon name="plus" />
                  </button>
                </div>
                {error && (
                  <p className="form-error" id="url-error" role="alert">
                    {error}
                  </p>
                )}
              </form>
            )}
            <div className="filter-row">
              <div
                className="filter-tabs"
                role="group"
                aria-label="Filter websites"
              >
                {['All websites', 'Social', 'Entertainment', 'Work'].map(
                  (item) => (
                    <button
                      key={item}
                      className={
                        category === item ? 'filter-tab selected' : 'filter-tab'
                      }
                      onClick={() => setCategory(item as Category)}
                      aria-pressed={category === item}
                    >
                      {item === 'All websites' ? 'All' : item}
                    </button>
                  ),
                )}
              </div>
              <label className="search-box">
                <Icon name="search" />
                <input
                  aria-label="Search websites"
                  placeholder="Find a website..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {search && (
                  <button
                    className="icon-button"
                    aria-label="Clear search"
                    onClick={() => setSearch('')}
                  >
                    <Icon name="close" />
                  </button>
                )}
              </label>
            </div>
            <div className="website-grid">
              {visibleSites.map((site) => (
                <article
                  className={`website-card card-${site.icon}`}
                  key={site.id}
                >
                  <a
                    className="website-link"
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${site.name} (opens in a new tab)`}
                  >
                    <div className="card-top">
                      <span className={`platform-icon platform-${site.icon}`}>
                        <PlatformIcon name={site.icon} />
                      </span>
                      <span className="card-arrow">
                        <Icon name="external" />
                      </span>
                    </div>
                    <h3>{site.name}</h3>
                    <p>{site.description}</p>
                    <div className="card-bottom">
                      <span>
                        {new URL(site.url).hostname.replace(/^www\./, '')}
                      </span>
                      <span className="category-label">
                        {site.category === 'My links'
                          ? 'Personal'
                          : site.category}
                      </span>
                    </div>
                  </a>
                  <button
                    className="favorite-button"
                    aria-label={`${preferences.favorites.includes(site.id) ? 'Unfavorite' : 'Favorite'} ${site.name}`}
                    aria-pressed={preferences.favorites.includes(site.id)}
                    onClick={() => toggleFavorite(site)}
                  >
                    <Icon name="star" />
                  </button>
                  {site.category === 'My links' && (
                    <button
                      className="remove-button"
                      aria-label={`Remove ${site.name}`}
                      onClick={() => removeSite(site)}
                    >
                      <Icon name="close" />
                    </button>
                  )}
                </article>
              ))}
            </div>
            {visibleSites.length === 0 && (
              <div className="empty-state">
                <Icon name="globe" />
                <h3>
                  {search
                    ? 'No websites found'
                    : 'Your next favorite belongs here'}
                </h3>
                <p>
                  {search
                    ? 'Try another name or website address.'
                    : 'Use “Add a website” to save a place you love.'}
                </p>
              </div>
            )}
            <div className="destination-note">
              <Icon name="external" />
              <p>
                Real websites. A fresh tab.{' '}
                <span>Every link takes you directly to its destination.</span>
              </p>
            </div>
          </section>
          <footer className="page-footer">
            <span>Less looking. More living.</span>
            <span>
              Made for your everyday internet{' '}
              <span className="footer-spark">✳</span>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
