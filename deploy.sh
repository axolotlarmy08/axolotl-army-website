#!/usr/bin/env bash
# Deploy the site: stage everything, commit, push.
# Vercel auto-deploys the push to main in ~1-2 min.
#
# Usage:
#   ./deploy.sh "your commit message"
#   ./deploy.sh           # will prompt for a message

set -euo pipefail

# Always run from the repo root (the dir this script lives in), regardless
# of where the user invoked it from.
cd "$(dirname "$0")"

msg="${1:-}"
if [[ -z "$msg" ]]; then
  read -r -p "Commit message: " msg
fi

if [[ -z "$msg" ]]; then
  echo "Aborted: empty commit message." >&2
  exit 1
fi

# Bail early if there's nothing to commit.
if git diff --quiet && git diff --cached --quiet && [[ -z "$(git ls-files --others --exclude-standard)" ]]; then
  echo "Nothing to commit — working tree clean."
  exit 0
fi

echo "→ Staging all changes"
git add -A

echo "→ Committing: $msg"
git commit -m "$msg"

echo "→ Pushing to origin/$(git rev-parse --abbrev-ref HEAD)"
git push

echo
echo "✓ Pushed. Vercel will deploy in ~1–2 min."
echo "  Check status: https://vercel.com/axolotlarmy08s-projects/axolotl-army-website/deployments"
echo "  Live site:    https://www.axolotlarmy.net"
