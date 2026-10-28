import { Icon } from './Icons';
import {
  accentColors,
  defaultPreferences,
  type Preferences,
  type ThemeMode,
} from '../lib/preferences';

type SettingsPanelProps = {
  preferences: Preferences;
  updatePreferences: (next: Preferences, message: string) => void;
  onClose: () => void;
  onViewHistory: () => void;
};

export function SettingsPanel({
  preferences,
  updatePreferences,
  onClose,
  onViewHistory,
}: SettingsPanelProps) {
  return (
    <section
      className="appearance-panel"
      id="settings-panel"
      aria-labelledby="settings-title"
    >
      <div className="form-heading">
        <div>
          <p className="eyebrow">A SPACE THAT FEELS LIKE YOU</p>
          <h2 id="settings-title">Settings</h2>
        </div>
        <button
          className="icon-button"
          aria-label="Close settings"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      <div className="appearance-options">
        <fieldset>
          <legend>Appearance</legend>
          <div className="mode-options">
            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
              <button
                key={mode}
                className={
                  preferences.mode === mode
                    ? 'mode-button selected'
                    : 'mode-button'
                }
                aria-pressed={preferences.mode === mode}
                onClick={() =>
                  updatePreferences(
                    { ...preferences, mode },
                    `${mode[0].toUpperCase() + mode.slice(1)} appearance selected.`,
                  )
                }
              >
                <Icon
                  name={
                    mode === 'light'
                      ? 'sun'
                      : mode === 'dark'
                        ? 'moon'
                        : 'monitor'
                  }
                />
                {mode[0].toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Accent color</legend>
          <div className="color-options">
            {accentColors.map((color) => (
              <button
                key={color.name}
                className="color-swatch"
                style={{ background: color.value }}
                aria-label={`${color.name} accent`}
                aria-pressed={preferences.accent.toLowerCase() === color.value}
                onClick={() =>
                  updatePreferences(
                    { ...preferences, accent: color.value },
                    `${color.name} accent selected.`,
                  )
                }
              >
                {preferences.accent.toLowerCase() === color.value && (
                  <Icon name="check" />
                )}
              </button>
            ))}
            <label className="custom-color">
              <input
                type="color"
                aria-label="Custom accent color"
                value={preferences.accent}
                onChange={(event) =>
                  updatePreferences(
                    { ...preferences, accent: event.target.value },
                    'Custom accent selected.',
                  )
                }
              />
              <span>Custom</span>
            </label>
          </div>
        </fieldset>
      </div>
      <div className="settings-options">
        <label className="setting-row">
          <span>
            <strong>Show favorites</strong>
            <small>
              Keep your starred websites within reach. Hiding them keeps your
              favorites and their order.
            </small>
          </span>
          <input
            type="checkbox"
            checked={preferences.showFavorites}
            onChange={(event) =>
              updatePreferences(
                { ...preferences, showFavorites: event.target.checked },
                event.target.checked ? 'Favorites shown.' : 'Favorites hidden.',
              )
            }
          />
        </label>
        <label className="setting-row">
          <span>
            <strong>Remember recently opened websites</strong>
            <small>
              Save the last 50 destinations opened from Launchpad in this
              browser only. Turning this off keeps existing history.
            </small>
          </span>
          <input
            type="checkbox"
            checked={preferences.rememberHistory}
            onChange={(event) =>
              updatePreferences(
                { ...preferences, rememberHistory: event.target.checked },
                event.target.checked
                  ? 'History recording turned on.'
                  : 'History recording paused.',
              )
            }
          />
        </label>
        <button className="add-button" onClick={onViewHistory}>
          <Icon name="history" /> View or clear history
        </button>
      </div>
      <div className="appearance-footer">
        <p>Saved in this browser. System follows your device.</p>
        <button
          onClick={() =>
            updatePreferences(
              {
                ...preferences,
                mode: defaultPreferences.mode,
                accent: defaultPreferences.accent,
              },
              'Appearance reset to defaults.',
            )
          }
        >
          Reset appearance
        </button>
      </div>
    </section>
  );
}
