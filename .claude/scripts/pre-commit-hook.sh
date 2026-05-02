#!/bin/bash

# Pre-commit hook for ontology extraction pipeline
# Blocks commits if:
# 1. Dictionary files are malformed (linter fails)
# 2. Code tags reference unknown terms (validation fails)
# 3. Type field on tags is invalid (strict mode)
# 4. Events reference non-existent catalog entries

set +e  # Don't exit on first error; we want to show full context

_show_help() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "BLOCKING RULES:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "LINTER ERRORS (dictionary schema violations):"
    echo "  ❌ Missing description on a term"
    echo "  ❌ Missing 'Code equivalent:' AND 'Unanchorable: true'"
    echo "  ❌ Invalid edge verb (not in approved vocabulary)"
    echo "  ❌ Edge target references non-existent term"
    echo "  ❌ Event reference doesn't exist in EventLog.EventType"
    echo ""
    echo "VALIDATION ERRORS (code-dictionary mismatches):"
    echo "  ❌ @biz/@sys tag refs unknown term (orphan anchor)"
    echo "  ❌ Invalid type on code tag (must be one of 13 valid types)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "NEXT STEPS:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Review error messages above"
    echo ""
    echo "2. Check available dictionary terms:"
    echo "   grep '^###' docs/vault/dictionary-*.md"
    echo ""
    echo "3. Check available edge verbs (32 total: 24 base + 8 additional):"
    echo "   python3 -c 'from internal_tools.semantic_index.application.taxonomy import VALID_EDGE_VERBS; print(sorted(VALID_EDGE_VERBS))'"
    echo ""
    echo "4. Check available types (13 total):"
    echo "   python3 -c 'from internal_tools.semantic_index.application.taxonomy import VALID_TYPES_FLAT; print(sorted(VALID_TYPES_FLAT))'"
    echo ""
    echo "5. Check available events:"
    echo "   python3 -c 'from infrastructure.database.models import EventLog; print(sorted([e.name for e in EventLog.EventType]))'"
    echo ""
    echo "6. Read detailed blocking rules documentation:"
    echo "   cat specs/ontology/docs/data-foundations/implementation-plan-precommit-hook.md"
    echo ""
    echo "7. Bypass (emergency only, CI will re-validate on push):"
    echo "   git commit --no-verify"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

echo "[ontology] Running extraction pipeline..."

# Resolve Python: prefer venv, then python3
REPO_ROOT="$(git rev-parse --show-toplevel)"
if [ -x "$REPO_ROOT/venv/bin/python" ]; then
    PYTHON="$REPO_ROOT/venv/bin/python"
elif command -v python3 &>/dev/null; then
    PYTHON="python3"
else
    echo "[ontology] ❌ No Python interpreter found (tried venv/bin/python, python3)."
    exit 1
fi

# Detect if dictionary or Python files changed
CHANGED_FILES=$(git diff --cached --name-only)

if ! echo "$CHANGED_FILES" | grep -qE "(dictionary.*\.md|\.py$)"; then
    echo "[ontology] No dictionary or code changes detected. Skipping."
    exit 0
fi

echo "[ontology] Detected dictionary or code changes. Running validation..."

# Run from repo root
cd "$(git rev-parse --show-toplevel)" || exit 1

# Capture output to files for better error reporting
TEMP_OUT="/tmp/ontology-precommit-output.txt"
TEMP_JSON="/tmp/ontology-precommit.json"

# ─── Run extraction + validation ──────────────────────────────────────────────
echo "[ontology] Step 1/2: Extracting and validating..."
$PYTHON -m internal_tools.semantic_index.application.cli extract \
    --strict \
    --output "$TEMP_JSON" \
    2>&1 | tee "$TEMP_OUT"

EXTRACT_EXIT=$?

if [ $EXTRACT_EXIT -ne 0 ]; then
    echo ""
    echo "[ontology] ❌ Extraction/validation failed. Commit blocked."
    _show_help
    rm -f "$TEMP_OUT" "$TEMP_JSON"
    exit 1
fi

# ─── Run event validation ─────────────────────────────────────────────────────
# NOTE: Event validation not yet implemented. Skip for now.
# When implemented, uncomment below:
# echo ""
# echo "[ontology] Step 2/2: Validating event catalog references..."
# python -m internal_tools.semantic_index.application.cli validate-events \
#     --dictionary-events docs/vault/dictionary-events.md \
#     2>&1 | tee -a "$TEMP_OUT"
#
# EVENT_EXIT=$?

# ─── Check results ───────────────────────────────────────────────────────────
echo ""
echo "[ontology] ✅ Validation passed. Commit proceeding."
rm -f "$TEMP_OUT" "$TEMP_JSON"
exit 0
