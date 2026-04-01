#!/usr/bin/env bash
# Store Netlify credentials as GitHub Actions secrets (for optional manual Netlify deploy workflow).
# PR previews and production deploys from normal git push are handled by Netlify’s Git integration;
# secrets are only required if you use .github/workflows/netlify-manual-deploy.yml.
set -euo pipefail

if ! command -v gh &>/dev/null; then
  echo "Install GitHub CLI: https://cli.github.com"
  exit 1
fi

if ! gh auth status &>/dev/null; then
  echo "Run: gh auth login"
  exit 1
fi

echo "Netlify → User settings → Applications → Personal access tokens → New access token"
echo "Scopes: read & write on Sites (deploy) — follow Netlify’s current UI labels."
echo ""
read -rsp "Paste NETLIFY_AUTH_TOKEN and press Enter: " TOKEN
echo
printf '%s' "$TOKEN" | gh secret set NETLIFY_AUTH_TOKEN

echo ""
echo "Netlify → Site configuration → Site details → Site ID"
read -rp "Paste NETLIFY_SITE_ID: " SITE_ID
printf '%s' "$SITE_ID" | gh secret set NETLIFY_SITE_ID

echo ""
echo "Done. Verify with: gh secret list"
echo "Optional: run workflow 'Netlify manual deploy' from the Actions tab (workflow_dispatch)."
