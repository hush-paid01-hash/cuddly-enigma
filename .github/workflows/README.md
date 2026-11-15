# GitHub Actions Workflows for iOS Game Ecosystem

This directory contains automated CI/CD pipelines for:
- Building all 4 components
- Running comprehensive tests
- Performance benchmarking
- Security scanning
- Automated releases
- ESign deployment

## Workflows Included

1. **build.yml** - Compile and build all components
2. **test.yml** - Unit, integration, and UI testing
3. **benchmark.yml** - Performance testing and reporting
4. **security.yml** - SAST, dependency scanning, compliance
5. **release.yml** - Automated release creation
6. **deploy.yml** - ESign deployment automation

## Quick Start

Workflows trigger on:
- Push to `main` branch
- Pull requests
- Release tags
- Manual triggers

## Configuration

See individual workflow files for configuration options.

## Secrets Required

Add these to GitHub repository settings:

```
APPLE_ID=your@apple.com
APPLE_PASSWORD=app-specific-password
TEAM_ID=XXXXXXXXXX
ESIGN_API_KEY=your-esign-api-key
```

## Running Locally

Test workflows locally with:

```bash
# Install act (GitHub Actions locally)
brew install act

# Run specific workflow
act -j build

# Run with secrets
act -j build -s APPLE_ID=your@apple.com
```

## Status

✅ All workflows production-ready
✅ Fully documented
✅ Tested on GitHub runners
✅ Ready to deploy

For detailed documentation, see:
- `.github/workflows/*.yml` - Individual workflow files
- `Docs/CI_CD.md` - Complete CI/CD documentation
