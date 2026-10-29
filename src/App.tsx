import { useEffect, useState, type FormEvent } from 'react';
import { Icon, PlatformIcon } from './components/Icons';
import { SettingsPanel } from './components/SettingsPanel';
import { History } from './components/History';
import {
  readHistory,
  recordOpening,
  saveHistory,
  type HistoryEntry,
} from './lib/history';
import { NextUp } from './components/NextUp';
import {
  discoverSites,
  readQueue,
  saveQueue,
  toggleQueued,
  updateQueueNote,
  resolveQueue,
  type QueueEntry,
} from './lib/discovery';
import { Favorites } from './components/Favorites';
import { readSavedSites, normalizeUrl, type Site } from './lib/sites';
import { bundledCatalog, fetchCatalog, readCatalog } from './lib/catalog';
import { destinationHint, isNative, updateNativeTheme } from './lib/native';

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
  'Learn',
  'Create',
  'Everyday',
  'My links',
] as const;
type Category = (typeof categories)[number];

function App() {
  const [catalog, setCatalog] = useState(() =>
    isNative ? readCatalog() : bundledCatalog,
  );
  const [catalogStatus, setCatalogStatus] = useState<
    'loading' | 'online' | 'offline'
  >('loading');
  const [catalogAttempt, setCatalogAttempt] = useState(0);
  const trails = catalog.trails;
  const [preferences, setPreferences] = useState(readPreferences);
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState<'websites' | 'history' | 'queue'>(
    'websites',
  );
  const [queue, setQueue] = useState(readQueue);
  const [trailId, setTrailId] = useState('');
  const [history, setHistory] = useState(readHistory);
  const [editingFavorites, setEditingFavorites] = useState(false);
  const [savedSites, setSavedSites] = useState<Site[]>(readSavedSites);
  const [category, setCategory] = useState<Category>('All websites');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const sites = [...catalog.sites, ...savedSites];
  const favoriteSites = preferences.favorites.flatMap((id) => {
    const site = sites.find((item) => item.id === id);
    return site ? [site] : [];
  });
  const favoriteIds = favoriteSites.map((site) => site.id);

  useEffect(() => {
    if (!isNative) return;
    let active = true;
    void fetchCatalog(
      import.meta.env.VITE_API_BASE_URL ??
        'https://hushpaid.netlify.app/api/v1',
    )
      .then((next) => {
        if (!active) return;
        setCatalog(next);
        setCatalogStatus('online');
      })
      .catch(() => {
        if (active) setCatalogStatus('offline');
      });
    return () => {
      active = false;
    };
  }, [catalogAttempt]);

  useEffect(() => {
    if (!isNative) return;
    const failed = () =>
      setNotice('This website could not open. Please try again.');
    window.addEventListener('hush:link-error', failed);
    return () => window.removeEventListener('hush:link-error', failed);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      document.documentElement.dataset.theme =
        preferences.mode === 'system'
          ? media.matches
            ? 'dark'
            : 'light'
          : preferences.mode;
      updateNativeTheme(document.documentElement.dataset.theme === 'dark');
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

  function openSite(site: Pick<HistoryEntry, 'name' | 'url'>) {
    if (!preferences.rememberHistory) return;
    const next = recordOpening(history, site);
    setHistory(next);
    if (!saveHistory(next)) {
      setNotice(
        'History updated for this visit only; your browser could not save it.',
      );
    }
  }

  function clearHistory() {
    setHistory([]);
    setNotice(
      saveHistory([])
        ? 'History cleared.'
        : 'History cleared for this visit. Your browser could not remove saved history; it may return next time.',
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

  const visibleSites = discoverSites(sites, category, search, trailId, trails);
  const queuedSites = resolveQueue(queue, sites);

  function updateQueue(next: QueueEntry[], message: string) {
    setQueue(next);
    const persisted = saveQueue(next);
    setNotice(
      persisted
        ? message
        : 'Next up updated for this visit only; your browser could not save it.',
    );
  }

  function toggleNextUp(site: Site) {
    const exists = queue.some((entry) => entry.siteId === site.id);
    updateQueue(
      toggleQueued(queue, site.id),
      `${site.name} ${exists ? 'removed from' : 'added to'} Next up.`,
    );
  }

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
        id:
          crypto.randomUUID?.() ??
          Array.from(crypto.getRandomValues(new Uint32Array(4)), (part) =>
            part.toString(16),
          ).join('-'),
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
    setTrailId('');
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
    const nextQueue = queue.filter((entry) => entry.siteId !== site.id);
    setQueue(nextQueue);
    const queuePersisted = saveQueue(nextQueue);
    setNotice(
      persisted && favoritesPersisted && queuePersisted
        ? `${site.name} removed.`
        : `${site.name} removed for this visit. Your browser could not save the change.`,
    );
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar" aria-label="Your space">
        <a className="brand" href="./" aria-label="hush home">
          <img
            className="brand-symbol"
            src="/app-icon.svg"
            alt=""
            width="40"
            height="40"
          />
          hush<span className="brand-dot">.</span>
          <span className="version-badge">V5</span>
        </a>
        <div className="workspace-label">YOUR WORKSPACE</div>
        <nav className="navigation">
          {categories.map((item, index) => (
            <button
              key={item}
              className={
                view === 'websites' && category === item
                  ? 'nav-item active'
                  : 'nav-item'
              }
              onClick={() => {
                setCategory(item);
                setTrailId('');
                setSearch('');
                setView('websites');
                setShowSettings(false);
              }}
              aria-pressed={view === 'websites' && category === item}
            >
              <Icon
                name={
                  [
                    'grid',
                    'people',
                    'play',
                    'briefcase',
                    'globe',
                    'palette',
                    'monitor',
                    'link',
                  ][index]
                }
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
          <button
            className={view === 'queue' ? 'nav-item active' : 'nav-item'}
            aria-pressed={view === 'queue'}
            onClick={() => {
              setView('queue');
              setShowSettings(false);
            }}
          >
            <Icon name="check" />
            <span>Next up</span>
            <span className="nav-count">{queuedSites.length}</span>
          </button>
          <button
            className={view === 'history' ? 'nav-item active' : 'nav-item'}
            aria-pressed={view === 'history'}
            onClick={() => {
              setView('history');
              setShowSettings(false);
            }}
          >
            <Icon name="history" />
            <span>History</span>
          </button>
          <button
            className={showSettings ? 'nav-item active' : 'nav-item'}
            aria-expanded={showSettings}
            aria-controls="settings-panel"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Icon name="settings" />
            <span>Settings</span>
          </button>
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
        <header className="workspace-header">
          <div className="workspace-toolbar">
            <div className="workspace-title">
              <span className="status-dot" />
              <span>Your space</span>
              <span className="workspace-subtitle">A little more focused.</span>
            </div>
            <form
              className="toolbar-search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                setView('websites');
                setCategory('All websites');
                setTrailId('');
                setShowSettings(false);
                requestAnimationFrame(() =>
                  document.getElementById('websites')?.scrollIntoView(),
                );
              }}
            >
              <Icon name="search" />
              <span className="search-prefix">
                hush <span>/</span>
              </span>
              <input
                aria-label="Search your websites"
                placeholder="Search websites, topics, or tasks"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setView('websites');
                  setCategory('All websites');
                  setTrailId('');
                  setShowSettings(false);
                }}
              />
              {search && (
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Clear search"
                  onClick={() => setSearch('')}
                >
                  <Icon name="close" />
                </button>
              )}
              <span className="search-hint" aria-hidden="true">
                ↵
              </span>
            </form>
            <button
              className="appearance-button"
              aria-label="Customize your space"
              onClick={() => setShowSettings(!showSettings)}
              aria-expanded={showSettings}
              aria-controls="settings-panel"
              title="Customize your space"
            >
              <Icon name="settings" /> <span>Customize</span>
            </button>
          </div>
        </header>
        <main id="main">
          {showSettings && (
            <SettingsPanel
              preferences={preferences}
              updatePreferences={updatePreferences}
              onClose={() => setShowSettings(false)}
              onViewHistory={() => {
                setView('history');
                setShowSettings(false);
              }}
            />
          )}
          <p className="notice" role="status">
            {notice}
          </p>
          {isNative && (
            <div className="mobile-catalog" role="status">
              <span>
                {catalogStatus === 'loading'
                  ? 'Checking for catalog updates…'
                  : catalogStatus === 'online'
                    ? 'Catalog up to date. Your personal data stays on this device.'
                    : 'Using the on-device catalog. Your links and settings are available.'}
              </span>
              {catalogStatus === 'offline' && (
                <button
                  className="add-button"
                  onClick={() => {
                    setCatalogStatus('loading');
                    setCatalogAttempt((value) => value + 1);
                  }}
                >
                  Retry update
                </button>
              )}
            </div>
          )}
          {view === 'queue' ? (
            <NextUp
              entries={queuedSites}
              onOpen={openSite}
              onNote={(id, note) =>
                updateQueue(
                  updateQueueNote(queue, id, note),
                  'Next step saved.',
                )
              }
              onFinish={(site) =>
                updateQueue(
                  queue.filter((entry) => entry.siteId !== site.id),
                  `${site.name} marked done. Removed from Next up.`,
                )
              }
              onExplore={() => {
                setView('websites');
                setCategory('All websites');
                setTrailId('');
                setSearch('');
              }}
            />
          ) : view === 'history' ? (
            <History
              entries={history}
              recording={preferences.rememberHistory}
              onOpen={openSite}
              onClear={clearHistory}
              onSettings={() => setShowSettings(true)}
            />
          ) : (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <p className="eyebrow">
                    <span /> WELCOME TO HUSH V5
                  </p>
                  <h1>
                    Your internet.
                    <br />
                    <span>More possibility.</span>
                  </h1>
                  <p className="hero-description">
                    Useful corners of the web. A clear next step.
                    <br className="desktop-break" /> Explore a task trail. Save
                    something worth trying.
                  </p>
                  <a className="hero-button" href="#websites">
                    Find your next destination <Icon name="arrow" />
                  </a>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="icon-orbit orbit-outer" />
                  <div className="icon-orbit orbit-inner" />
                  <span className="orbit-dot" />
                  <img
                    className="hero-app-icon"
                    src="/app-icon.svg"
                    alt=""
                    width="140"
                    height="140"
                  />
                  <span className="art-caption">
                    LESS NOISE. MORE POSSIBILITY.
                  </span>
                </div>
              </section>

              <section
                className="trails-section"
                aria-labelledby="trails-title"
              >
                <div className="section-heading">
                  <div>
                    <p className="eyebrow section-eyebrow">
                      START WITH A PURPOSE
                    </p>
                    <h2 id="trails-title">What do you want to do?</h2>
                  </div>
                  <button
                    className="add-button"
                    onClick={() => {
                      setView('queue');
                      requestAnimationFrame(() =>
                        document.getElementById('next-up-title')?.focus(),
                      );
                    }}
                  >
                    Next up <span>{queuedSites.length}</span>
                    <Icon name="arrow" />
                  </button>
                </div>
                <div className="trails-grid">
                  {trails.map((trail, index) => (
                    <button
                      className={`trail-card ${trailId === trail.id ? 'selected' : ''}`}
                      key={trail.id}
                      aria-pressed={trailId === trail.id}
                      onClick={() => {
                        setTrailId(trail.id);
                        setCategory('All websites');
                        setSearch('');
                        requestAnimationFrame(() =>
                          document.getElementById('websites-title')?.focus(),
                        );
                      }}
                    >
                      <span className="trail-number">
                        0{index + 1} <Icon name="arrow" />
                      </span>
                      <strong>{trail.name}</strong>
                      <small>{trail.sites.length} steps to explore</small>
                    </button>
                  ))}
                </div>
              </section>
              {preferences.showFavorites && (
                <Favorites
                  favoriteSites={favoriteSites}
                  onOpen={openSite}
                  editingFavorites={editingFavorites}
                  onToggleEditing={() => setEditingFavorites(!editingFavorites)}
                  toggleFavorite={toggleFavorite}
                  reorderFavorite={reorderFavorite}
                />
              )}
              <section
                className="websites-section"
                id="websites"
                aria-labelledby="websites-title"
              >
                <div className="section-heading">
                  <div>
                    <p className="eyebrow section-eyebrow">
                      PICK A DESTINATION
                    </p>
                    <h2 id="websites-title" tabIndex={-1}>
                      {trailId
                        ? trails.find((trail) => trail.id === trailId)?.name
                        : category === 'All websites'
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
                {trailId && (
                  <div className="trail-detail">
                    <p>
                      {
                        trails.find((trail) => trail.id === trailId)
                          ?.description
                      }
                    </p>
                    <button
                      className="add-button"
                      onClick={() => setTrailId('')}
                    >
                      Exit trail <Icon name="close" />
                    </button>
                  </div>
                )}
                {showForm && (
                  <form
                    className="add-form"
                    id="add-website"
                    onSubmit={addSite}
                  >
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
                    <p>
                      Add any website. Your links are saved in this browser.
                    </p>
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
                    {categories.map((item) => (
                      <button
                        key={item}
                        className={
                          category === item
                            ? 'filter-tab selected'
                            : 'filter-tab'
                        }
                        onClick={() => {
                          setCategory(item as Category);
                          setTrailId('');
                        }}
                        aria-pressed={view === 'websites' && category === item}
                      >
                        {item === 'All websites' ? 'All' : item}
                      </button>
                    ))}
                  </div>
                  <span className="filter-summary" role="status">
                    {visibleSites.length}{' '}
                    {visibleSites.length === 1 ? 'website' : 'websites'}
                    {search ? ` matching “${search}”` : ' to explore'}
                  </span>
                </div>
                <div className="website-grid">
                  {visibleSites.map((site) => (
                    <article
                      className={`website-card card-${site.icon}`}
                      key={site.id}
                    >
                      <a
                        className="website-link"
                        onClick={() => openSite(site)}
                        onAuxClick={(event) => {
                          if (event.button === 1) openSite(site);
                        }}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${site.name} (${destinationHint})`}
                      >
                        <div className="card-top">
                          <span
                            className={`platform-icon platform-${site.icon}`}
                          >
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
                      <button
                        className="queue-button"
                        aria-label={`${queue.some((entry) => entry.siteId === site.id) ? 'Remove' : 'Save'} ${site.name} ${queue.some((entry) => entry.siteId === site.id) ? 'from' : 'to'} Next up`}
                        aria-pressed={queue.some(
                          (entry) => entry.siteId === site.id,
                        )}
                        onClick={() => toggleNextUp(site)}
                      >
                        <Icon
                          name={
                            queue.some((entry) => entry.siteId === site.id)
                              ? 'check'
                              : 'plus'
                          }
                        />{' '}
                        Next up
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
                        ? 'Try a topic like coding, maps, or books. Exit the trail or choose All to broaden your search.'
                        : 'Use “Add a website” to save a place you love.'}
                    </p>
                  </div>
                )}
                <div className="destination-note">
                  <Icon name="external" />
                  <p>
                    Real websites. A fresh tab.{' '}
                    <span>
                      Every link takes you directly to its destination.
                    </span>
                  </p>
                </div>
              </section>
            </>
          )}
          <footer className="page-footer">
            <span>Less looking. More living.</span>
            <span>
              hush V5 · Made for your everyday internet{' '}
              <span className="footer-spark">✳</span>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
