#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8080}"
ROOT="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT"

serve_with_npx() {
  if ! command -v npx >/dev/null 2>&1; then
    echo "Error: Node.js/npx not found. Install Node.js or Python 3." >&2
    exit 1
  fi
  echo "Serving Tribe at http://localhost:${PORT}"
  echo "Press Ctrl+C to stop."
  exec npx --yes serve . -l "$PORT"
}

if command -v python3 >/dev/null 2>&1; then
  if python3 -m http.server --help >/dev/null 2>&1; then
    echo "Serving Tribe at http://localhost:${PORT}"
    echo "Press Ctrl+C to stop."
    exec python3 -m http.server "$PORT"
  fi
fi

serve_with_npx
