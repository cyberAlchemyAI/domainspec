#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PACK_DIR="$ROOT/domainspec/copilot"
AGENTS_SRC="$PACK_DIR/agents"
SKILLS_SRC="$PACK_DIR/skills"
AGENTS_DST="$ROOT/.github/agents"
SKILLS_DST="$ROOT/.github/skills"

mkdir -p "$AGENTS_DST"
mkdir -p "$SKILLS_DST"

cp -f "$AGENTS_SRC"/*.agent.md "$AGENTS_DST"/

for skill_dir in "$SKILLS_SRC"/*; do
  skill_name="$(basename "$skill_dir")"
  mkdir -p "$SKILLS_DST/$skill_name"
  cp -f "$skill_dir"/SKILL.md "$SKILLS_DST/$skill_name"/
done

echo "Installed DomainSpec Copilot pack into .github/agents and .github/skills"
