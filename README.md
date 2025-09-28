# FlameBank Web Release

## Overview
FlameBank is a sovereign web-based banking platform enabling users to register, hash their credentials on Web3, and receive embedded ledgers and virtual cards. This repository contains the web frontend and automated deployment workflow.

## Features
- Web3 registration and hashing
- Embedded ledger issuance per user
- Virtual card issuance (AUD 1,000,000 base ledger)
- Secure deployment pipeline
- CI/CD with automated tests

## Deployment
The deployment is fully automated using GitHub Actions. Pushes to the `main` branch trigger:

1. Installation of dependencies
2. Build of the web app
3. Tests execution
4. Deployment to GitHub Pages or target web host

## Folder Structure