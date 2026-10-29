# iOS IPA artifacts

The existing Capacitor app packages the React website at
https://hushpaid.netlify.app using bundled web assets. `npm run ios:ipa` builds
those assets, syncs the iOS project, archives a **Release device build** with
Xcode, and packages an IPA. It does not deploy or add an API.

## GitHub Actions

The **Build iOS IPA** workflow (`.github/workflows/ios-ipa.yml`) runs on pull
requests and can be started manually from Actions. It uses macOS 15, Xcode 26.0,
Node 22, and the lockfile. The shared `App` scheme supports headless archives.

By default, it creates `hush-unsigned.ipa` and a SHA-256 checksum in the run's
`hush-ios-unsigned-<run number>` artifact. Download and unzip that artifact from
the Actions run page; artifacts expire after 14 days. The IPA contains a device
`Payload/App.app`, **not a simulator app**. It is unsigned and cannot be installed
on an iPhone or submitted to App Store Connect until correctly signed and
provisioned. A successful simulator check alone does not produce an IPA.

For a signed IPA, configure these repository secrets, then manually run the
workflow with **signed** enabled and the matching **export_method**:

| Secret | Required value |
| --- | --- |
| `IOS_CERTIFICATE_BASE64` | Base64-encoded `.p12` containing an Apple Distribution certificate **and its private key** |
| `IOS_CERTIFICATE_PASSWORD` | Nonempty password used to export that `.p12` |
| `IOS_PROVISION_PROFILE_BASE64` | Base64-encoded, unexpired distribution `.mobileprovision` for the bundle ID and certificate |
| `IOS_TEAM_ID` | Apple Developer team ID that owns the profile and certificate |

An active Apple Developer Program membership and registered bundle ID are
required. The current bundle ID is `site.hushpaid.app`; confirm ownership before
release. If changing it, update the Capacitor config, both Xcode target build
configurations, the build script's export mapping, and the workflow's profile
validation together.

- **release-testing** exports an Ad Hoc IPA. Its provisioning profile must include
  each test device's UDID. Install only on those registered devices.
- **app-store-connect** exports an App Store/TestFlight IPA using an App Store
  distribution profile. It requires a subsequent App Store Connect upload and
  processing; it cannot be directly installed like an Ad Hoc build.

The workflow imports credentials into a temporary keychain, checks the profile's
team, bundle ID, and expiry, and removes signing files and the keychain even if
building fails. Pull requests never import signing credentials. A signed run
fails if required secrets are missing; it does not substitute an unsigned IPA.
Only IPA files and checksums are uploaded. The workflow uses its run number as
the app build number; use a number greater than any previously uploaded version
when uploading to App Store Connect.

No App Store Connect API key is needed to create the IPA. This workflow performs
no upload, publication, or submission. Those steps require separate App Store
Connect access and the publisher's metadata, privacy disclosures, and review.

## Local builds

Use macOS, Xcode 26+ with the iOS SDK installed and its license accepted, and
Node 22.18+. The existing Swift Package Manager setup requires no CocoaPods.

```sh
npm ci
npm run ios:ipa
# Output: ios/App/output/unsigned/hush-unsigned.ipa and .ipa.sha256
```

For a signed local build, first import the distribution certificate/private key
into your keychain and install the matching provisioning profile. Then:

```sh
export IOS_TEAM_ID=YOUR_TEAM_ID
export IOS_PROFILE_UUID=YOUR_INSTALLED_PROFILE_UUID
export IOS_EXPORT_METHOD=release-testing # or app-store-connect
export IOS_BUILD_NUMBER=1 # choose an unused number for App Store Connect
npm run ios:ipa -- signed
# Output: ios/App/output/signed/hush-signed.ipa and .ipa.sha256
```

Archives and export metadata stay under the ignored `ios/App/output/` directory.
Each build clears its mode's output first so a failed build cannot upload an old
IPA. Never commit certificates, private keys, provisioning profiles, or IPAs.

## Verification status

Web build and Capacitor synchronization can run without Xcode. The packaging
script tests use simulated Xcode command results to check unsigned IPA layout,
checksums, signed export options, and failure handling:

```sh
python3 -m unittest discover -s tests -p 'test_ios_build.py'
npm run ios:sync
```

These checks do not compile Swift or validate Apple signatures. Actual IPA
creation requires a successful macOS workflow or local Xcode build; signed IPA
creation additionally requires the credentials above. Device installation and
the native review checklist in [iOS setup](ios-and-api.md) remain release checks.
