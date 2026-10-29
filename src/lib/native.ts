import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { StatusBar, Style } from '@capacitor/status-bar';
import { normalizeUrl } from './sites';

export const isNative = Capacitor.isNativePlatform();
export const destinationHint = isNative
  ? 'opens in Safari'
  : 'opens in a new tab';

export function updateNativeTheme(dark: boolean) {
  if (!isNative) return;
  void StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(
    (error: unknown) =>
      console.warn('Could not update status bar appearance', error),
  );
}

export function initializeNative() {
  if (!isNative) return;
  document.documentElement.dataset.platform = Capacitor.getPlatform();
  // Let React's link handlers record hush history before opening Safari's sheet.
  document.addEventListener('click', (event) => {
    const link =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a[target="_blank"]')
        : null;
    if (!link || event.defaultPrevented || !normalizeUrl(link.href)) return;
    event.preventDefault();
    void Browser.open({ url: link.href }).catch(() => {
      window.dispatchEvent(new Event('hush:link-error'));
    });
  });
}
