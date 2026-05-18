"""PENDING schema change — drafted for integration, not yet applied.

This file is the staging area for the `layer:` field addition to
`NodeFrontmatter`, per amendment
`vault/amendments/2026-05-16-add-layer-field-to-nodefrontmatter.md`.

The integrator (human reviewer) does the following, in order:
  1. Review `vault/migrations/v1-to-v2.py` dry-run output (sibling agent).
  2. Move the `Layer` alias and `layer` field below into `frontmatter.py`'s
     `NodeFrontmatter`, replacing the current loose `layer: str` declaration.
  3. Wire `_layer_matches_path` into the validator entry point so it can be
     called with a known path (currently `validate_node` takes only the dict).
  4. Run the migration; commit the data diff.
  5. Flip `validator_passed: pending -> true` in the amendment log entry.

Do NOT import from this module at runtime. It is review-only.
"""

from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import model_validator

# --- Type alias --------------------------------------------------------------

Layer = Literal["schema", "instance"]

# --- Field to add to NodeFrontmatter -----------------------------------------
# Soft rollout (RECOMMENDED for v1.1.0 first cut):
#     layer: Layer | None = None
# Hard rollout (target state after migration + one snapshot):
#     layer: Layer
#
# The current `frontmatter.py` declares `layer: str` (unconstrained). The
# amendment narrows this to the two-value Literal; soft rollout keeps the
# field Optional so pre-migration files parse with a warning rather than a
# hard ValidationError.

# --- Validator ---------------------------------------------------------------

def _expected_layer_from_path(vault_relative_path: Path) -> Layer | None:
    """Return the layer implied by a path under vault/, or None if ambiguous."""
    parts = vault_relative_path.parts
    if not parts:
        return None
    if parts[0] == "schema":
        return "schema"
    if parts[0] == "instance":
        return "instance"
    return None  # legacy paths (constitution/, discovery/, etc.) — pre-migration


def _layer_matches_path(declared: Layer | None, path: Path | None) -> tuple[bool, str]:
    """Check declared layer against path. Returns (ok, message)."""
    if path is None:
        return True, ""  # path not provided to validator; skip check
    expected = _expected_layer_from_path(path)
    if expected is None:
        return True, f"path {path} not yet migrated to vault/schema|instance/"
    if declared is None:
        return False, f"missing layer: (expected {expected!r} from path {path})"
    if declared != expected:
        return False, f"layer:{declared} disagrees with path {path} (expected {expected!r})"
    return True, ""


# Drop-in @model_validator for NodeFrontmatter once the model carries a private
# `_source_path` set by the loader. Until then, path-checking lives in
# `vault_ctl.validate` and this validator is a no-op stub.
@model_validator(mode="after")
def _validate_layer_vs_path(self):  # type: ignore[no-untyped-def]
    path = getattr(self, "_source_path", None)
    declared = getattr(self, "layer", None)
    ok, msg = _layer_matches_path(declared, path)
    if not ok:
        # Soft rollout: emit warning via stdlib warnings; --strict promotes.
        import warnings
        warnings.warn(msg, stacklevel=2)
    return self


# --- Diff to apply to frontmatter-ownership-constitution.md ------------------
# version:      1.0.0  ->  1.1.0
# last_updated: <prev> ->  2026-05-16
#
# §1 rule 2 ("Per-type subclasses") — universal-fields list:
#   - (`node_type`, `layer`, `nature`, `status`, ...)
#   + (`node_type`, `layer` [Literal["schema", "instance"]], `nature`, ...)
#
# §4 ("Schema versioning") — append:
#   + v1 -> v2 bump: `layer:` narrowed from free-string to
#   + Literal["schema", "instance"]; migration `vault/migrations/v1-to-v2.py`
#   + back-fills the field from path.

# --- Honest design note ------------------------------------------------------
# Soft vs hard rollout. With `layer: Layer | None = None` plus a warning, the
# pre-migration corpus continues to parse — the validator surfaces the gap
# without halting work. With required `layer: Layer`, every pre-migration file
# fails ValidationError on the first read, including by tools that aren't
# party to this change (telemetry batch jobs, retrieval indexing). Recommend
# soft rollout for v1.1.0; add a `vault-ctl validate --strict` flag that
# promotes the warning to an error. Flip `--strict` to default after the
# migration commits and one snapshot has elapsed (mirrors the schema_version
# discipline in `frontmatter-ownership-constitution.md` §5).
#
# Forward compatibility with the deferred recursive Unit grammar. Lens 07
# adopted the top-level split only; the fully-recursive `vault/schema/X/` <->
# `vault/instance/X/` mirror at every depth is deferred. The `layer:` field at
# root level is sufficient for the partial adoption — a node knows which side
# of the top split it lives on, and that is the discipline the lens verdict
# requires. If the recursive mirror is later adopted, additional fields
# (`slot:` for the named subtree, or a path-derived `unit:` discriminator)
# can be added in a future amendment without retracting this one. This
# amendment does not foreclose the recursive direction; it just refuses to
# pre-pay for it.
