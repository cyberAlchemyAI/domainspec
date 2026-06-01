#!/usr/bin/env bash
# UserPromptSubmit hook: inject DomainSpec Implementation Axioms when the
# user's prompt mentions spec / discovery / plan / implementation work in
# either English or Portuguese.
#
# Stdin:  JSON like {"prompt": "...", ...} from Claude Code.
# Stdout: JSON {"hookSpecificOutput": {...}} on match, nothing otherwise.
# Exit:   0 in all normal cases.

set -u

input_json="$(cat)"

# Extract the prompt safely. If jq is missing or the JSON is malformed,
# fail silent so we never block the user's submit.
if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

prompt="$(printf '%s' "$input_json" | jq -r '.prompt // empty' 2>/dev/null)"
if [ -z "$prompt" ]; then
  exit 0
fi

# Case-insensitive keyword match. Accented PT words (implementação,
# especificação) are listed in both accented and unaccented forms.
# Word boundaries are used where they help; PT accents may not respect
# \b cleanly in all locales, so we keep those patterns as substrings.
if ! printf '%s' "$prompt" | grep -iqE '(\bspec\b|\bspecs\b|\bspecification\b|\bdiscovery\b|\bplan\b|\bplanning\b|\bplanejar\b|\bplano\b|\bimplement\b|\bimplementation\b|\bimplementing\b|implementar|implementação|implementacao|\bfeature\b|\bRFC\b|\baxiom\b|\baxioms\b|axioma|especificação|especificacao|\binfra\b|\binfrastructure\b|\bdocker\b|\bdockerfile\b|\bcompose\b|\bdb\b|\bdatabase\b|\bpostgres\b|\bsqlite\b|\bschema\b|\bmigration\b|\bmigrations\b|\bpipeline\b|\bendpoint\b|\bendpoints\b|\barchitecture\b|\barchitectural\b|\bfolder\b|\bfolders\b|\bstructure\b|\bconstitution\b|\bpremise\b|\bport\b|\badapter\b|tabela|tabelas|pasta|pastas|\bbanco\b|\bbancos\b|arquitetura|migração|migracao|infraestrutura|constituição|constituicao)'; then
  exit 0
fi

read -r -d '' AXIOM_TEXT <<'AXIOMS' || true
## DomainSpec Implementation Axioms (auto-loaded by hook)

This prompt mentions spec/discovery/plan/implementation work. Before authoring or modifying any spec/discovery/plan/implementation artifact, honor these 4 non-negotiable axioms:

- **AX-DS-1 — Spec is source; code is its compiled image.** Truth flows spec → code. Build implementation from documented behavior (SPEC, operations, states, interfaces, events, queries, TEST-SPEC). Do not infer intent by reading existing code. When feature code already exists, run `domainspec-audit-alignment` before edits.
- **AX-DS-2 — One vocabulary across spec and code.** Code symbols and spec concepts must project onto the same registry. Do not invent names at the keyboard. Renames are spec changes first, code changes second.
- **AX-DS-3 — No orphan behavior.** Every behavior in code traces to an authoring artifact (spec, discovery, decision, premise, or axiom). No "just-in-case" branches, convenience helpers, defensive validation beyond documented boundaries, or scope creep.
- **AX-DS-4 — Decision space is preserved with the decision.** If implementation forces a choice not already recorded (error model, naming, library, layer placement, persistence engine, database engine, data-access library), stop and route through `domainspec-decision-gate`. Never decide silently in code.

**On axiom conflict:** stop, name the axiom by ID (e.g. "AX-DS-3 conflict: function X has no citing artifact"), surface the conflicting code path or decision, and request resolution via the appropriate gate (`domainspec-decision-gate`, `domainspec-audit-alignment`, or spec revision) before proceeding.

Full skill reference: `.claude/skills/domainspec-implementation-axioms/SKILL.md`
AXIOMS

# Encode as JSON safely via jq (handles newlines, quotes, unicode).
printf '%s' "$AXIOM_TEXT" | jq -Rs '{
  hookSpecificOutput: {
    hookEventName: "UserPromptSubmit",
    additionalContext: .
  }
}'
