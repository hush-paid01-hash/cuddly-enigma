# Launchpad

A responsive website launcher built with React, TypeScript, and Vite. Instagram, Facebook, YouTube, LinkedIn, Pinterest, and Reddit open their real websites in new tabs. No account or backend configuration is required.

Search websites, filter by category, or add your own HTTP/HTTPS links. Addresses without a scheme default to HTTPS. Personal links are saved only in the current browser using local storage and can be removed from My links. Every destination uses a regular link with `target="_blank"` and `rel="noopener noreferrer"`.

Use **Personalize** to choose light, dark, or device appearance, pick an accent preset, or choose a custom color. Star any built-in or personal website to add it to **Your favorites**. Select **Reorder**, then use the earlier/later arrows to arrange favorites with a mouse, touch, or keyboard. Appearance, favorites, and their order are saved in this browser; existing personal links are preserved. If storage is unavailable, changes still work for the current visit and a notice explains they could not be saved.

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
