#!/bin/bash
# Install git hooks for ontology pipeline validation

set -e

REPO_ROOT=$(git rev-parse --show-toplevel)
HOOK_FILE="$REPO_ROOT/.git/hooks/pre-commit"
HOOK_SOURCE="$REPO_ROOT/.claude/scripts/pre-commit-hook.sh"

if [ ! -f "$HOOK_SOURCE" ]; then
    echo "❌ Error: Hook source not found at $HOOK_SOURCE"
    exit 1
fi

# Copy the hook into place
cp "$HOOK_SOURCE" "$HOOK_FILE"
chmod +x "$HOOK_FILE"

echo "✅ Pre-commit hook installed at $HOOK_FILE"
echo ""
echo "Hook configuration:"
echo "  - Lints dictionaries (schema validation)"
echo "  - Extracts terms and code tags"
echo "  - Validates code tags against dictionaries"
echo "  - Validates event catalog references"
echo "  - Blocks commit if any validation fails"
echo ""
echo "To bypass the hook in emergencies:"
echo "  git commit --no-verify"
echo ""
echo "⚠️  Note: CI will re-validate on push, so --no-verify is not a permanent solution."
