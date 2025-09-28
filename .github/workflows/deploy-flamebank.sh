#!/bin/bash
set -e

# --- CONFIGURATION ---
TARGET_BRANCH="main"          # Branch for stable release
BUILD_DIR="build"             # React default; use ".next" for Next.js
GITHUB_REPO="git@github.com:FlameWolx/Flamebank.git"
DOMAIN="flamebank.ac"

# --- STEP 1: Build Project ---
echo "🔨 Building project..."
npm install
npm run build

# --- STEP 2: Commit & Push Changes ---
echo "📤 Committing changes..."
git add .
git commit -m "Auto-deploy build $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
git push origin $TARGET_BRANCH

# --- STEP 3A: Deploy to GitHub Pages ---
echo "🌐 Deploying to GitHub Pages..."
npx gh-pages -d $BUILD_DIR -b gh-pages

# --- STEP 3B: Optional Vercel Deployment ---
if [ -n "$VERCEL_TOKEN" ]; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod --token $VERCEL_TOKEN
fi

echo "✅ Deployment complete!"
echo "Visit: https://$DOMAIN"