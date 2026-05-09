#!/usr/bin/env bash
set -u -o pipefail

# Safe markdown link checker for ad-hoc usage in interactive terminals.
# It never exits from inside the processing loop.

usage() {
  cat <<'EOF'
Usage:
  bash tools/check_markdown_links.sh <markdown-file>

Examples:
  bash tools/check_markdown_links.sh docs/features/knowledge-graph-visualization/work-pack/context/TASK-KG-IMP-01-CONTEXT.md
EOF
}

if [[ ${1:-} == "-h" || ${1:-} == "--help" ]]; then
  usage
  exit 0
fi

if [[ $# -ne 1 ]]; then
  usage
  exit 2
fi

markdown_file="$1"
if [[ ! -f "$markdown_file" ]]; then
  echo "ERROR: file not found: $markdown_file"
  exit 2
fi

markdown_dir="$(dirname "$markdown_file")"
missing=0

extract_links() {
  local file="$1"
  if command -v rg >/dev/null 2>&1; then
    timeout 20s rg -o "\[[^\]]+\]\([^\)]+\)" "$file" | sed -E 's/^.*\(([^)]+)\).*$/\1/' || \
      grep -oE "\[[^]]+\]\([^)]+\)" "$file" | sed -E 's/^.*\(([^)]+)\).*$/\1/'
  else
    grep -oE "\[[^]]+\]\([^)]+\)" "$file" | sed -E 's/^.*\(([^)]+)\).*$/\1/'
  fi
}

while IFS= read -r link; do
  [[ -z "$link" ]] && continue

  # Ignore external links and same-file anchors.
  if [[ "$link" == http* || "$link" == mailto:* || "$link" == \#* ]]; then
    continue
  fi

  # Keep path part only (drop anchors) and decode common encoded spaces.
  base="${link%%#*}"
  base="${base//%20/ }"
  target="$markdown_dir/$base"

  if [[ ! -e "$target" ]]; then
    echo "MISSING $link"
    missing=1
  fi
done < <(extract_links "$markdown_file")

if [[ $missing -eq 0 ]]; then
  echo "OK: all markdown links resolve"
  exit 0
fi

echo "FAIL: one or more markdown links are missing"
exit 1
