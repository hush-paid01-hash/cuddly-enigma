import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons';
import { resolveOmnibox } from '../lib/omnibox';
import { destinationHint } from '../lib/native';

export function Omnibox({
  prominent = false,
  onOpen,
}: {
  prominent?: boolean;
  onOpen: (site: { name: string; url: string }) => void;
}) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const destination = resolveOmnibox(query);

  useEffect(() => {
    if (prominent) return;
    const focusAddress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    };
    window.addEventListener('keydown', focusAddress);
    return () => window.removeEventListener('keydown', focusAddress);
  }, [prominent]);

  return (
    <div className={`omnibox-wrap ${prominent ? 'omnibox-prominent' : ''}`}>
      <form
        className="omnibox"
        role="search"
        aria-label={prominent ? 'Start a web search' : 'Address bar'}
        onSubmit={(event) => {
          event.preventDefault();
          if (destination) link.current?.click();
          else {
            setError(true);
            input.current?.focus();
          }
        }}
      >
        <Icon name={prominent ? 'search' : 'globe'} />
        <input
          ref={input}
          aria-label={
            prominent
              ? 'Search the web or enter an address'
              : 'Address or Google search'
          }
          placeholder={
            prominent ? 'Search Google or type a URL' : 'Search or type a URL'
          }
          value={query}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={error}
          aria-describedby={
            error
              ? prominent
                ? 'start-search-error'
                : 'address-error'
              : undefined
          }
          onChange={(event) => {
            setQuery(event.target.value);
            setError(false);
          }}
        />
        {query && (
          <button
            type="button"
            className="browser-control"
            aria-label={prominent ? 'Clear web search' : 'Clear address'}
            onClick={() => {
              setQuery('');
              setError(false);
              input.current?.focus();
            }}
          >
            <Icon name="close" />
          </button>
        )}
        <button
          className="browser-control omnibox-go"
          type="submit"
          aria-label={
            prominent ? 'Search or open website' : 'Go to address or search'
          }
          title={destinationHint}
        >
          <Icon name="arrow" />
        </button>
        <a
          ref={link}
          href={destination ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          hidden
          tabIndex={-1}
          onClick={() => {
            if (destination) onOpen({ name: query.trim(), url: destination });
          }}
        >
          Open destination
        </a>
      </form>
      {error && (
        <p
          className="omnibox-error"
          role="alert"
          id={prominent ? 'start-search-error' : 'address-error'}
        >
          Enter a search or a valid HTTP/HTTPS website address.
        </p>
      )}
    </div>
  );
}
