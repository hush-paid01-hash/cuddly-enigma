import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'site.hushpaid.app',
  appName: 'hush',
  webDir: 'dist',
  plugins: { StatusBar: { style: 'LIGHT' } },
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
  },
};

export default config;
