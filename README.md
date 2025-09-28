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
The deployment is fully automated using GitHub Actions. Pushes to the `master` branch trigger:

1. Installation of dependencies
2. Build of the web app
3. Tests execution
4. Deployment to GitHub Pages or target web host

## Folder Structure
/Flamebank
├── .github/
│   └── workflows/
│       ├── release-flamebank.yml      # GitHub Actions workflow; ERROR: fails on beta branch deployment (check secrets & domain config)
├── src/
│   ├── components/
│   │   └── Header.js                  # ERROR: missing import of CSS module
│   ├── pages/
│   │   ├── index.js                    # ERROR: fails to fetch ledger data on first load
│   │   └── beta.js                     # OK
│   └── utils/
│       └── ledger.js                   # ERROR: API endpoint undefined in production
├── public/
│   └── assets/
│       └── logo.png                    # OK
├── tests/
│   └── ledger.test.js                  # ERROR: Jest mock failing on async calls
├── package.json                         # OK
├── yarn.lock / package-lock.json        # OK
├── README.md                            # This file
└── .env                                 # ERROR: missing or misconfigured environment variables