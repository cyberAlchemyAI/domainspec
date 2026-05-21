#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: tools/bootstrap_domainspec_codex.sh --target <path> [options]

Install DomainSpec into a consuming project for Codex runtime use.

Options:
  --target <path>         Target project root. Required.
  --project-command <id>  Optional project-local command alias, e.g. whisky-domainspec.
  --force                 Replace existing installed DomainSpec runtime paths.
  --dry-run               Print planned actions without writing.
  -h, --help              Show this help.

Installed paths:
  .codex/agents/
  .codex/commands/
  .Codex/skills/
  .Codex/get-shit-done/
  .agents/skills/            Compatibility copy for runtimes that inspect .agents.
  domainspec/                Thin reference bundle, not the full framework.
USAGE
}

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
domainspec_root="$(cd "$script_dir/.." && pwd)"
target_root=""
project_command=""
force="false"
dry_run="false"

excluded_skills=(
  "domainspec-task-session"
  "domainspec-definitions-governance"
)

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) target_root="$2"; shift 2 ;;
    --project-command) project_command="$2"; shift 2 ;;
    --force) force="true"; shift ;;
    --dry-run) dry_run="true"; shift ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$target_root" ]]; then
  echo "--target is required" >&2
  usage >&2
  exit 2
fi

target_root="$(mkdir -p "$target_root" && cd "$target_root" && pwd)"

run() {
  if [[ "$dry_run" == "true" ]]; then
    printf '[dry-run]'
    printf ' %q' "$@"
    printf '\n'
  else
    "$@"
  fi
}

replace_dir() {
  local path="$1"
  if [[ -e "$path" && "$force" != "true" ]]; then
    echo "Refusing to replace existing path without --force: $path" >&2
    exit 1
  fi
  if [[ -e "$path" ]]; then
    run rm -rf "$path"
  fi
  run mkdir -p "$path"
}

copy_file() {
  local src="$1"
  local dst="$2"
  run mkdir -p "$(dirname "$dst")"
  run cp "$src" "$dst"
}

copy_dir() {
  local src="$1"
  local dst="$2"
  run mkdir -p "$(dirname "$dst")"
  run cp -a "$src" "$dst"
}

is_excluded_skill() {
  local name="$1"
  local excluded
  for excluded in "${excluded_skills[@]}"; do
    [[ "$name" == "$excluded" ]] && return 0
  done
  return 1
}

write_text() {
  local dst="$1"
  local content="$2"
  run mkdir -p "$(dirname "$dst")"
  if [[ "$dry_run" == "true" ]]; then
    echo "[dry-run] write $dst"
  else
    printf '%s\n' "$content" > "$dst"
  fi
}

patch_file_if_present() {
  local file="$1"
  shift
  [[ -f "$file" ]] || return 0
  if [[ "$dry_run" == "true" ]]; then
    echo "[dry-run] patch $file"
  else
    perl -0pi -e "$*" "$file"
  fi
}

install_runtime() {
  replace_dir "$target_root/.codex/agents"
  copy_dir "$domainspec_root/.codex/agents/." "$target_root/.codex/agents/"

  replace_dir "$target_root/.Codex/skills"
  local skill_dir skill_name
  for skill_dir in "$domainspec_root/.agents/skills"/*; do
    [[ -d "$skill_dir" ]] || continue
    skill_name="$(basename "$skill_dir")"
    is_excluded_skill "$skill_name" && continue
    copy_dir "$skill_dir" "$target_root/.Codex/skills/$skill_name"
  done

  replace_dir "$target_root/.agents/skills"
  for skill_dir in "$domainspec_root/.agents/skills"/*; do
    [[ -d "$skill_dir" ]] || continue
    skill_name="$(basename "$skill_dir")"
    is_excluded_skill "$skill_name" && continue
    copy_dir "$skill_dir" "$target_root/.agents/skills/$skill_name"
  done

  replace_dir "$target_root/.Codex/get-shit-done"
  copy_dir "$domainspec_root/.github/get-shit-done/." "$target_root/.Codex/get-shit-done/"

  replace_dir "$target_root/.codex/commands"
  for skill_dir in "$target_root/.Codex/skills"/domainspec-*; do
    [[ -d "$skill_dir" ]] || continue
    skill_name="$(basename "$skill_dir")"
    write_command_bridge "$skill_name" "$target_root/.codex/commands/$skill_name.md"
  done

  if [[ -n "$project_command" ]]; then
    write_project_command "$project_command" "$target_root/.codex/commands/$project_command.md"
  fi

  patch_installed_runtime
}

write_command_bridge() {
  local command="$1"
  local dst="$2"
  write_text "$dst" "# $command

Use the installed DomainSpec Codex skill at:

[../../.Codex/skills/$command/SKILL.md](../../.Codex/skills/$command/SKILL.md)

This bridge exists so Codex can discover the project-local DomainSpec command while the installed skill remains under \`.Codex/skills/\`."
}

write_project_command() {
  local command="$1"
  local dst="$2"
  write_text "$dst" "# $command

Project-local DomainSpec entrypoint.

Use the installed DomainSpec orchestrator skill:

[../../.Codex/skills/domainspec-orchestrate/SKILL.md](../../.Codex/skills/domainspec-orchestrate/SKILL.md)

Default scope:

- Target project: this repository
- Framework bundle: \`domainspec/\`
- Runtime assets: \`.codex/agents/\`, \`.Codex/skills/\`, \`.Codex/get-shit-done/\`

Route natural-language project work through \`domainspec-orchestrate\` unless the user explicitly names a direct \`domainspec-*\` command."
}

patch_installed_runtime() {
  patch_file_if_present "$target_root/.Codex/skills/domainspec-orchestrate/SKILL.md" \
    's/package docs under `domainspec\/copilot\/`, and //g; s/Treat `domainspec-task-session` as direct-advanced only when explicitly invoked with an explicit file path under `implementation\/domainspec\/plan\/`\./Treat `domainspec-task-session` as framework-internal and unavailable in consumer projects unless the full DomainSpec implementation plan tree is explicitly installed./g'

  patch_file_if_present "$target_root/.codex/agents/domainspec-orchestrator.agent.toml" \
    's/\n- `domainspec\/copilot\/README\.md`//g; s/`domainspec-task-session` remains direct-advanced only when explicitly invoked with an explicit file path under `implementation\/domainspec\/plan\/`/`domainspec-task-session` is framework-internal and unavailable in consumer projects unless the full DomainSpec implementation plan tree is explicitly installed/g'

  patch_file_if_present "$target_root/.Codex/skills/domainspec-init/SKILL.md" \
    's/ and starter files from domainspec\/starter//g; s/copy payment-processing example into docs\/features/create a minimal example feature from domainspec\/templates rather than copying framework examples/g'

  patch_file_if_present "$target_root/.Codex/skills/domainspec-help/SKILL.md" \
    's/Read command definitions under domainspec\/Codex\/skills\/, package docs under domainspec\/Codex\/, and framework updates in domainspec\/CHANGELOG\.md\./Read command definitions under `.Codex\/skills\/domainspec-*\/SKILL.md` and framework updates in `domainspec\/CHANGELOG.md`./g'

  patch_file_if_present "$target_root/.Codex/skills/domainspec-infra-architecture/SKILL.md" \
    's/domainspec\/Codex\/skills\/domainspec-reflect\/SKILL\.md/.Codex\/skills\/domainspec-reflect\/SKILL.md/g; s/(- domainspec\/templates\/setup\.sh\n)/$1- .Codex\/skills\/domainspec-reflect\/SKILL.md\n/'

  patch_file_if_present "$target_root/.Codex/skills/domainspec-pilot-readiness/SKILL.md" \
    's/- domainspec\/docs\/features\/\{feature-name\}\/\n//g; s/domainspec\/docs\/features\//docs\/features\//g; s/Build initial gap map from DomainSpec source docs\./Build initial gap map from project feature docs./g; s/Update source first:\n  - `docs\/features\/\{feature-name\}\/SPEC\.md`\n  - `docs\/features\/\{feature-name\}\/TEST-SPEC\.md`\n- Then sync project docs:/Update project docs:/g; s/Validate no semantic drift between DomainSpec source docs and project docs\./Validate no semantic drift between project docs and implementation evidence./g'

  patch_file_if_present "$target_root/.codex/agents/domainspec-task-executor.agent.toml" \
    's/Synchronize related artifacts \(`TRACEABILITY\.md`, `index\.md`, `ADLC-ALIGNMENT\.md`\) when impacted\./Synchronize related project traceability and index artifacts when impacted./g'
}

install_bundle() {
  replace_dir "$target_root/domainspec"

  local root_files=(
    "CHANGELOG.md"
    "ARCHITECTURE.md"
    "ARCHITECTURE-PATTERN-LIBRARY.md"
    "CONSTITUTION.md"
    "OBSERVABILITY.md"
    "RELATIONSHIPS.md"
    "TAXONOMY.md"
    "TEST-PIPELINE.md"
  )

  local file
  for file in "${root_files[@]}"; do
    copy_file "$domainspec_root/$file" "$target_root/domainspec/$file"
  done

  copy_dir "$domainspec_root/templates" "$target_root/domainspec/templates"

  run mkdir -p "$target_root/domainspec/architecture/pattern-library"
  copy_file "$domainspec_root/architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md" \
    "$target_root/domainspec/architecture/pattern-library/ARCHITECTURE-FOUNDATIONS.md"
  copy_file "$domainspec_root/architecture/pattern-library/LAYERING-REFERENCE.md" \
    "$target_root/domainspec/architecture/pattern-library/LAYERING-REFERENCE.md"

  run mkdir -p "$target_root/domainspec/tools"
  copy_file "$domainspec_root/tools/build-telemetry-bundle.ts" "$target_root/domainspec/tools/build-telemetry-bundle.ts"
  copy_file "$domainspec_root/tools/generate-meta-health.ts" "$target_root/domainspec/tools/generate-meta-health.ts"
  copy_file "$domainspec_root/tools/prune-governance.ts" "$target_root/domainspec/tools/prune-governance.ts"

  write_bundle_readme
  write_bundle_manifest
  sanitize_bundle
}

write_bundle_readme() {
  write_text "$target_root/domainspec/README.md" "---
tags: [domainspec, codex, runtime, reference-bundle]
node_type: readme
is_session: false
layer: architecture, application
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-20
---

# DomainSpec Runtime Bundle

This is a thin runtime reference bundle for DomainSpec skills installed in this project.

It is not the full DomainSpec framework and it is not an installer package. The bundle contains only assets that project-facing DomainSpec skills apply while creating, auditing, or verifying real project artifacts:

- framework constraints and vocabulary (\`CHANGELOG.md\`, \`TAXONOMY.md\`, \`RELATIONSHIPS.md\`, \`CONSTITUTION.md\`);
- architecture and layering references (\`ARCHITECTURE.md\`, \`ARCHITECTURE-PATTERN-LIBRARY.md\`, \`architecture/pattern-library/\`);
- delivery rules (\`TEST-PIPELINE.md\`, \`OBSERVABILITY.md\`);
- artifact templates (\`templates/\`);
- referenced runtime helper scripts (\`tools/\`).

Runtime commands and skills live outside this bundle:

- \`.codex/commands/\`
- \`.codex/agents/\`
- \`.Codex/skills/\`
- \`.Codex/get-shit-done/\`"
}

write_bundle_manifest() {
  write_text "$target_root/domainspec/BUNDLE.md" "---
tags: [domainspec, codex, runtime, reference-bundle]
node_type: readme
is_session: false
layer: architecture, application
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-20
---

# DomainSpec Runtime Reference Bundle

This directory is a thin DomainSpec reference bundle for Codex runtime use.

It intentionally does not vendor the full DomainSpec framework. It contains only framework docs, templates, architecture/layering references, and helper scripts that installed \`.Codex/skills/\` and \`.codex/agents/\` apply while producing real project artifacts.

Excluded by design:

- \`copilot/\` package and installer docs.
- \`plan/\` framework roadmap and internal task-session docs.
- framework example feature docs.
- ADLC/framework-roadmap docs that are not consumed by project-facing runtime skills.

Canonical source remains the DomainSpec framework repository."
}

sanitize_bundle() {
  patch_file_if_present "$target_root/domainspec/OBSERVABILITY.md" \
    's/\n- \[DRIFT-CONVERGENCE\.md\]\(DRIFT-CONVERGENCE\.md\)//g'
  patch_file_if_present "$target_root/domainspec/templates/SIGNAL-SCHEMA.md" \
    's/domainspec\/copilot\/agents\/domainspec-planner\.md/.codex\/agents\/domainspec-planner.agent.toml/g'
}

verify_install() {
  local missing=0
  local required=(
    ".codex/agents/domainspec-orchestrator.agent.toml"
    ".Codex/skills/domainspec-orchestrate/SKILL.md"
    ".Codex/get-shit-done/bin/gsd-tools.cjs"
    ".codex/commands/domainspec-orchestrate.md"
    "domainspec/CHANGELOG.md"
    "domainspec/templates/SPEC.md"
    "domainspec/templates/implementation-layering.md"
    "domainspec/architecture/pattern-library/LAYERING-REFERENCE.md"
    "domainspec/tools/build-telemetry-bundle.ts"
    "domainspec/tools/generate-meta-health.ts"
    "domainspec/tools/prune-governance.ts"
  )

  local rel
  for rel in "${required[@]}"; do
    if [[ ! -e "$target_root/$rel" ]]; then
      echo "Missing required install artifact: $rel" >&2
      missing=1
    fi
  done

  if command -v rg >/dev/null 2>&1; then
    if rg -n "domainspec/(copilot|plan|starter|definitions|papers|protocols|registry|PROJECT.yaml)|implementation/domainspec/plan" \
      "$target_root/.Codex/skills" "$target_root/.codex/agents" "$target_root/domainspec" >/tmp/domainspec-install-stale-refs.$$ 2>/dev/null; then
      cat /tmp/domainspec-install-stale-refs.$$ >&2
      rm -f /tmp/domainspec-install-stale-refs.$$
      echo "Found stale references to non-bundled DomainSpec internals." >&2
      missing=1
    else
      rm -f /tmp/domainspec-install-stale-refs.$$
    fi
  fi

  [[ "$missing" -eq 0 ]]
}

install_runtime
install_bundle
verify_install

echo "Installed DomainSpec Codex runtime into $target_root"
echo "Command surface: .codex/commands/"
echo "Thin bundle: domainspec/"
