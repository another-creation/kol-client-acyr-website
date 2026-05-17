#!/bin/bash
# Crawler simulation — hits the metadata proxy with a Twitterbot User-Agent
# and prints the meta tags it returns.
#
# Usage:
#   ./scripts/test-meta.sh <route> [target]
#
# Targets:
#   (omitted)   → http://localhost:3000   — needs `vercel dev` + a built `dist/`
#   live        → https://another-creation.xyz
#   https://…   → any URL (Vercel preview deploys, staging, etc.)
#
# If target is a Vercel preview URL with Deployment Protection enabled,
# the script reads VERCEL_AUTOMATION_BYPASS_SECRET from .env.local and
# appends ?x-vercel-protection-bypass=<token>&x-vercel-set-bypass-cookie=true
# automatically.
#
# Examples:
#   ./scripts/test-meta.sh /shop
#   ./scripts/test-meta.sh /blog/some-article live
#   ./scripts/test-meta.sh /handmade https://kol-client-acyr-website-git-meta.vercel.app

URL=$1
TARGET=${2:-local}

if [ -z "$URL" ]; then
  echo "Usage: $0 <route> [local|live|https://...]"
  exit 1
fi

case "$TARGET" in
  local)
    BASE="http://localhost:3000"
    ;;
  live)
    BASE="https://another-creation.xyz"
    ;;
  http://*|https://*)
    BASE="${TARGET%/}"
    ;;
  *)
    echo "Unknown target: $TARGET"
    echo "Pass 'live', a full https:// URL, or omit for localhost."
    exit 1
    ;;
esac

# Load Vercel bypass token from .env.local if present and we're hitting a Vercel preview.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env.local"
QUERY=""
if [[ "$BASE" == *.vercel.app* ]] && [ -f "$ENV_FILE" ]; then
  TOKEN=$(grep -E '^VERCEL_AUTOMATION_BYPASS_SECRET=' "$ENV_FILE" | head -1 | cut -d= -f2-)
  if [ -n "$TOKEN" ]; then
    QUERY="?x-vercel-protection-bypass=${TOKEN}&x-vercel-set-bypass-cookie=true"
  fi
fi

FULL_URL="${BASE}${URL}${QUERY}"
echo "→ Crawler simulation: ${BASE}${URL}"
echo

# Cookie jar — Vercel's bypass mechanism sets a JWT cookie on first hit, then
# redirects to the clean URL. Without -c/-b the cookie is dropped on the
# redirect and we end up at the auth page.
COOKIES=$(mktemp)
trap 'rm -f "$COOKIES"' EXIT

curl -s -A "Twitterbot" -L -c "$COOKIES" -b "$COOKIES" "${FULL_URL}" \
  | grep -E 'og:|twitter:|<title|name="description"|name="robots"|rel="canonical"'
