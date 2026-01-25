#!/usr/bin/env sh
# Exit with status 1 if latest commit message contains [publish], causing Netlify to skip the build.
# Return 0 otherwise.
set -eu
MSG=$(git log -1 --pretty=%B 2>/dev/null || true)
echo "Netlify ignore check: commit message='${MSG}'"
echo "Checking for [publish] token..."
if echo "$MSG" | grep -iq '\[publish\]'; then
  echo "[publish] token found — skipping Netlify build (exit 1)"
  exit 1
fi
echo "No [publish] token found — proceed with build (exit 0)"
exit 0
