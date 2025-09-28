# FlameBank — Web Release (Turnkey)

## Executive summary
FlameBank is a sovereign, web-first banking platform that registers user identities on Web3, issues embedded ledgers, and mints virtual cards per device. This repository contains the web frontend, automation scripts, and an end-to-end GitHub Actions CI/CD pipeline to release the site automatically on pushes to `main`.

## Features
- Automated build + test + deploy pipeline (GitHub Actions)
- Web3 registration hashing (uses `WEB3_RPC_URL` + `WEB3_PRIVATE_KEY`)
- Post-deploy issuance: embedded ledgers + virtual cards via API
- Secure secrets pattern (GitHub Secrets)
- Deploys to GitHub Pages by default (adjustable)

## Security & compliance
- **DO NOT** commit any private keys or secrets.
- Use GitHub Secrets: `GITHUB_TOKEN`, `WEB3_RPC_URL`, `WEB3_PRIVATE_KEY`, `LEDGER_API_KEY`, `CARD_ISSUER_KEY`, and `SITE_URL`.
- Store long-term keys in your HSM/KMS where possible. Rotate keys regularly and log access.

## Environment / Secrets required (GitHub Repository > Settings > Secrets)
- `GITHUB_TOKEN` (provided by GitHub Actions; available automatically)
- `WEB3_RPC_URL` — JSON-RPC endpoint (Infura/Alchemy or sovereign RPC)
- `WEB3_PRIVATE_KEY` — private key for signing registration TXs (use ephemeral wallet ideally)
- `LEDGER_API_KEY` — ledger provider API key
- `CARD_ISSUER_KEY` — card provider API key
- `SITE_URL` — production URL (e.g., https://flamebank.example.com)

## CI/CD
Push to `main` or run workflow_dispatch. Workflow:
1. Checkout
2. Install (npm ci)
3. Build and test
4. Deploy built site to GitHub Pages (or custom provider)
5. Run post-deploy scripts:
   - `hash-registrations.js` — hash/publish registration records to Web3
   - `issue-ledger-cards.js` — create ledger records and provision virtual cards

## Local usage
1. Install:
   ```bash
   npm ci