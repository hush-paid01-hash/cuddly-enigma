# iOS app and catalog API

The iOS app packages the existing React website with Capacitor 8. It includes
the same search, categories, personal links, themes, ordered favorites, history,
task trails, and Next up queue. The UI and a fallback catalog ship in the app;
launching does not require the website or API to be online. Opening a destination
still requires connectivity to that destination.

External HTTP/HTTPS links open in a Safari sheet with a Done button. They never
replace the app's web view. The website continues to open destinations in new
tabs. Native safe-area padding protects content around the notch and home
indicator in portrait and landscape. Status bar text follows the selected
light, dark, or system appearance.

Personal links, preferences, history, and queue notes remain in local storage in
the app's web view, independently of Safari and the website. They persist across
launches but are removed when app data is deleted. There is no account or
cross-device sync. The API receives no personal links, favorites, history, or
notes. The existing website's local storage keys and behavior are unchanged.

## Build and run on iOS

Use Node.js 22.18+, macOS with Xcode 26+ and its iOS simulator tools. No CocoaPods
installation is needed: the checked-in project uses Swift Package Manager.

```sh
npm ci
npm run ios:sync
npm run ios:open
```

In Xcode, select the App scheme and an iPhone or iPad simulator, then Run.
`ios:sync` builds the website and copies its assets and plugin configuration into
the native project. Run it again after changing web code, dependencies, or
`capacitor.config.ts`. Generated web assets are intentionally not committed.

For a command-line simulator build after syncing:

```sh
xcodebuild -project ios/App/App.xcodeproj -scheme App \
  -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath /tmp/hush-ios-build CODE_SIGNING_ALLOWED=NO build
```

The app targets iOS 15+. `site.hushpaid.app` is a provisional bundle identifier.
Before distributing to devices or TestFlight, the owner must choose an Apple
Developer team in Signing & Capabilities and confirm/register a unique bundle
identifier (update both `capacitor.config.ts` and the Xcode target if it changes).
No signing credentials are included. App Store metadata, privacy disclosures,
screenshots, signing, and submission are release tasks owned by the publisher;
this project does not publish an app automatically.

## Deploy the API

`netlify.toml` builds the existing static website into `dist/` and deploys
`netlify/functions/api.ts` as a Netlify Function at `/api/v1/*`. Deploy this branch
to the existing Netlify site, or use a Netlify deploy preview to test first.
No database, API keys, or runtime secrets are required. The existing AWS workflow
still deploys the static website; S3 alone does not host this function.

The iOS app checks `https://hushpaid.netlify.app/api/v1/catalog` at launch with a
five-second timeout. A valid response updates and caches the catalog. Failed
requests or invalid data leave the saved or bundled catalog usable and offer
Retry update. The public API must be deployed before live catalog updates work.
Changing the website's catalog requires an API deployment; changing the app's
bundled fallback requires rebuilding the iOS app.

To use a deploy preview or a different API host, copy `.env.example` to `.env`
and set `VITE_API_BASE_URL` to its HTTPS `/api/v1` URL **before** `ios:sync`.
This is public build configuration, not a place for secrets. The native web view
continues to load bundled assets; no remote `server.url` is configured.

## API contract and local development

The API is public and read-only. CORS allows all origins because it exposes only
the built-in catalog. It sets no cookies and requires no authentication. Catalog
and search responses can be cached for five minutes. Health and errors are not
cached. GET, HEAD, and OPTIONS are supported; writes receive 405, unknown paths
404, and invalid filters 400. See `openapi/hush.yaml` for the contract.

| Endpoint | Response |
| --- | --- |
| `/api/v1/health` | Status and API version |
| `/api/v1/catalog` | Schema version 1, sites, and ordered task trails |
| `/api/v1/sites?q=coding&category=Learn` | Matching built-in sites and total |
| `/api/v1/sites?trail=research` | Sites in the trail's suggested order |

Search applies all words, case-insensitively, across the same fields as the
website. Optional category and trail filters intersect the results. `q` allows
up to 200 characters. Unknown categories or trail IDs are errors. Personal
links are never included.

Run these commands in separate terminals:

```sh
npm run dev:api
npm run dev
```

The local API listens on `127.0.0.1:8787`; Vite proxies `/api` to it on port 4173.
The local server calls the same Request/Response handler as Netlify. For native
device testing, use an HTTPS Netlify preview URL; localhost in an app refers to
the device, not the development machine.

```sh
curl http://localhost:8787/api/v1/health
curl 'http://localhost:8787/api/v1/sites?q=coding&category=Learn'
npm test
npm run lint
npm run build
```

## Review on a simulator or device

- Launch, search, filter categories, and follow each task trail.
- Add an HTTP/HTTPS personal link; confirm invalid schemes are rejected.
- Open a catalog card, favorite, history entry, and queued item. Dismiss Safari
  and confirm the app remains open and history follows the recording preference.
- Change appearance and accent, reorder favorites, add a queue note, and relaunch
  to confirm persistence. Clear history and confirm other personal data remains.
- Disable connectivity, relaunch, and confirm the catalog and personal data are
  available. Restore connectivity and use Retry update.
- Check portrait, landscape, iPad, keyboard entry, VoiceOver, dark appearance,
  and safe areas. Confirm no content overlaps the status bar or home indicator.

Browser emulation can exercise the shared UI and the native JavaScript branch;
it does not validate WKWebView, Safari sheets, signing, or native layout. A
successful Xcode simulator build and device review are required before release.
