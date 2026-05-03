#!/usr/bin/env bash
set -euo pipefail

FRAMEWORK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CANONICAL_README="$FRAMEWORK_ROOT/README.md"
COPILOT_README="$FRAMEWORK_ROOT/copilot/README.md"
CHANGELOG="$FRAMEWORK_ROOT/CHANGELOG.md"
TEMPLATES_DIR="$FRAMEWORK_ROOT/templates"
COPILOT_SKILLS_DIR="$FRAMEWORK_ROOT/copilot/skills"
RELATIONSHIP_VALIDATOR="$FRAMEWORK_ROOT/tools/validate-relationships.ts"
WORK_PACK_VALIDATOR="$FRAMEWORK_ROOT/tools/validate-work-pack-coverage.ts"

failures=0

report_violation() {
  echo "VIOLATION: $1"
  failures=$((failures + 1))
}

report_ok() {
  echo "OK: $1"
}

require_file() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    report_violation "Missing required file: $path"
  fi
}

require_dir() {
  local path="$1"
  if [[ ! -d "$path" ]]; then
    report_violation "Missing required directory: $path"
  fi
}

contains_token() {
  local token="$1"
  local haystack="$2"
  grep -qx "$token" <<< "$haystack"
}

extract_commands_from_canonical_readme() {
  sed -n '/^### Public Commands/,/^### Agents Reference/p' "$CANONICAL_README" \
    | grep -oE 'domainspec-[a-z0-9-]+' \
    | sort -u
}

extract_commands_from_copilot_readme() {
  {
    sed -n '/^### Public Commands/,/^### Agents/p' "$COPILOT_README"
    sed -n '/^### Appendix: Internal Bridge Commands/,/^### Context Search Heuristic/p' "$COPILOT_README"
  } | grep -oE 'domainspec-[a-z0-9-]+' \
    | sort -u
}

extract_listed_templates() {
  sed -n '/^## Templates/,/^## Examples/p' "$CANONICAL_README" \
    | grep -oE 'templates/[A-Za-z0-9._-]+' \
    | sed 's#^templates/##' \
    | sort -u
}

extract_shipped_templates() {
  find "$TEMPLATES_DIR" -mindepth 1 -maxdepth 1 -type f -printf '%f\n' | sort -u
}

extract_shipped_skills() {
  find "$COPILOT_SKILLS_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort -u
}

extract_changelog_head_version() {
  sed -n 's/^## \[\([^]]*\)\].*/\1/p' "$CHANGELOG" | head -n 1
}

extract_readme_documented_version() {
  grep -oE 'current: v?[0-9]+\.[0-9]+\.[0-9]+' "$CANONICAL_README" \
    | head -n 1 \
    | sed -E 's/current: v?//'
}

require_file "$CANONICAL_README"
require_file "$COPILOT_README"
require_file "$CHANGELOG"
require_dir "$TEMPLATES_DIR"
require_dir "$COPILOT_SKILLS_DIR"
require_file "$RELATIONSHIP_VALIDATOR"
require_file "$WORK_PACK_VALIDATOR"

if [[ $failures -gt 0 ]]; then
  echo "check_docs_sync: FAIL ($failures issues)"
  exit 1
fi

changelog_version="$(extract_changelog_head_version)"
documented_version="$(extract_readme_documented_version || true)"

if [[ -z "$changelog_version" ]]; then
  report_violation "Unable to resolve changelog head version from $CHANGELOG"
elif [[ -z "$documented_version" ]]; then
  report_violation "Unable to resolve documented version reference from $CANONICAL_README"
elif [[ "$changelog_version" != "$documented_version" ]]; then
  report_violation "README version drift: changelog=$changelog_version README=$documented_version"
else
  report_ok "Version reference matches changelog head ($changelog_version)"
fi

shipped_skills="$(extract_shipped_skills)"
canonical_commands="$(extract_commands_from_canonical_readme || true)"
copilot_commands="$(extract_commands_from_copilot_readme || true)"

while IFS= read -r skill; do
  [[ -z "$skill" ]] && continue

  if ! contains_token "$skill" "$canonical_commands"; then
    report_violation "Canonical README missing command for shipped skill: $skill"
  fi

  if ! contains_token "$skill" "$copilot_commands"; then
    report_violation "Copilot README missing command for shipped skill: $skill"
  fi
done <<< "$shipped_skills"

while IFS= read -r command; do
  [[ -z "$command" ]] && continue
  if ! contains_token "$command" "$shipped_skills"; then
    report_violation "Canonical README lists non-shipped command: $command"
  fi
done <<< "$canonical_commands"

while IFS= read -r command; do
  [[ -z "$command" ]] && continue
  if ! contains_token "$command" "$shipped_skills"; then
    report_violation "Copilot README lists non-shipped command: $command"
  fi
done <<< "$copilot_commands"

listed_templates="$(extract_listed_templates || true)"
shipped_templates="$(extract_shipped_templates)"

while IFS= read -r template; do
  [[ -z "$template" ]] && continue
  if ! contains_token "$template" "$listed_templates"; then
    report_violation "Canonical README template table missing shipped template: $template"
  fi
done <<< "$shipped_templates"

while IFS= read -r template; do
  [[ -z "$template" ]] && continue
  if ! contains_token "$template" "$shipped_templates"; then
    report_violation "Canonical README template table lists missing template file: $template"
  fi
done <<< "$listed_templates"

if ! (
  cd "$FRAMEWORK_ROOT"
  pnpm dlx tsx tools/validate-relationships.ts --mode warn
); then
  report_violation "Relationship vocabulary validator execution failed"
else
  report_ok "Relationship vocabulary scan completed (warn mode)"
fi

if ! (
  cd "$FRAMEWORK_ROOT"
  pnpm dlx tsx tools/validate-work-pack-coverage.ts --mode warn
); then
  report_violation "Work-pack coverage validator execution failed"
else
  report_ok "Work-pack coverage scan completed (warn mode)"
fi

if [[ $failures -gt 0 ]]; then
  echo "check_docs_sync: FAIL ($failures issues)"
  exit 1
fi

echo "check_docs_sync: PASS"
