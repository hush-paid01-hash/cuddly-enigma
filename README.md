# Launchpad

A responsive website launcher built with React, TypeScript, and Vite. Instagram, Facebook, YouTube, LinkedIn, Pinterest, and Reddit open their real websites in new tabs. No account or backend configuration is required.

Search websites, filter by category, or add your own HTTP/HTTPS links. Addresses without a scheme default to HTTPS. Personal links are saved only in the current browser using local storage and can be removed from My links. Every destination uses a regular link with `target="_blank"` and `rel="noopener noreferrer"`.

## Development

Use Node.js 22.18 or newer.

```bash
npm ci
npm run dev
```

## Verification and production build

```bash
npm test
npm run lint
npm run build
npm run preview
```

## AWS deployment

The workflow in `.github/workflows/aws.yml` builds the static site and deploys `dist/` to Amazon S3 on pushes to `main` or `master`, or via `workflow_dispatch`.

Set repository variables `AWS_REGION` and `AWS_S3_BUCKET`. Optionally set `CLOUDFRONT_DISTRIBUTION_ID` to invalidate a distribution after deployment. Configure the `AWS_ROLE_TO_ASSUME` secret for OIDC authentication, or both `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
