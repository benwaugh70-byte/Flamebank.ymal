# 1. Make sure you are on the beta branch
git checkout beta

# 2. Add the workflow file (adjust path if needed)
git add .github/workflows/release-flamebank.yml

# 3. Commit the workflow
git commit -m "Add automated release & deploy workflow"

# 4. Push to GitHub (this will trigger the workflow automatically)
git push origin beta

# 5. Optionally, push a version tag to trigger a release build
git tag v0.1.0
git push origin v0.1.0