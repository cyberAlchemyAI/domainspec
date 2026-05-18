"""vault_governance — governance-shaped tooling pulled out of vault_ctl.

Bundles:
  - amendments: schema-amendment discipline CLI (closes R2)
  - governance: runtime witness for `governs` edges CLI (closes R4)
  - AmendmentFrontmatter: Pydantic schema for vault/amendments/*.md
  - the three concrete validators originally shipped in vault_common.governance,
    now registered against the kernel REGISTRY on import (per D-5 rescope and
    kernel OQ-C option 2: kernel keeps the mechanism, subsystem owns the rules).

Importing this package as a side effect registers the validators.
"""

from ._kernel_amendments import (
    AmendmentFrontmatter,
    AmendmentReview,
    AmendmentTrigger,
    ChangeType,
    ReviewState,
)

# Side-effect import: registers concrete validators against the kernel registry.
from . import _kernel_validators  # noqa: F401

from .amendments import app as amendments_app
from .governance import app as governance_app

__all__ = [
    "AmendmentFrontmatter",
    "AmendmentReview",
    "AmendmentTrigger",
    "ChangeType",
    "ReviewState",
    "amendments_app",
    "governance_app",
]

__version__ = "0.1.0"
