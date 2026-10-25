# hush-bank

Modern AI-powered digital banking platform.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## AWS deployment

This repository includes `/home/runner/work/hush-bank/hush-bank/.github/workflows/aws.yml` to build the Vite app and deploy the `dist/` output to Amazon S3 from GitHub Actions.

Configure these GitHub repository variables before enabling the workflow:

- `AWS_REGION`: AWS region for deployment
- `AWS_S3_BUCKET`: destination S3 bucket name
- `CLOUDFRONT_DISTRIBUTION_ID` (optional): CloudFront distribution to invalidate after deployment

Configure these GitHub repository secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- either `AWS_ROLE_TO_ASSUME` for OIDC authentication, or both `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

The workflow deploys on pushes to `main` or `master`, and it also supports manual runs with `workflow_dispatch`.
