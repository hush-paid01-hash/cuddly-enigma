import { Icon } from './Icons';
import {
  accentColors,
  defaultPreferences,
  type Preferences,
  type ThemeMode,
} from '../lib/preferences';

type AppearancePanelProps = {
  preferences: Preferences;
  updatePreferences: (next: Preferences, message: string) => void;
  onClose: () => void;
};

export function AppearancePanel({
  preferences,
  updatePreferences,
  onClose,
}: AppearancePanelProps) {
  return (
    <section
      className="appearance-panel"
      id="appearance-panel"
      aria-labelledby="appearance-title"
    >
      <div className="form-heading">
        <div>
          <p className="eyebrow">A SPACE THAT FEELS LIKE YOU</p>
          <h2 id="appearance-title">Make it yours</h2>
        </div>
        <button
          className="icon-button"
          aria-label="Close appearance settings"
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
