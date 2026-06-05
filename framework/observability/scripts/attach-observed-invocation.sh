#!/usr/bin/env bash
set -euo pipefail

cat <<'MESSAGE'
attach-observed-invocation.sh has been retired.

Observed invocation is now installed by tools/bootstrap_arcanum.sh for the
Codex-only command surface:

- .codex/commands/ contains full command contracts with observer task zero.
- .codex/hooks.json installs UserPromptSubmit, PostToolUse, and Stop hooks.
- framework/observability/scripts/observe-invocation.sh remains the envelope observer.
- framework/observability/scripts/recover-arcanum-observations.sh recovers missed hook envelopes.

Run:

  tools/bootstrap_arcanum.sh --target . --runtime codex --sigils all --spells all --necronomicon --force
MESSAGE
