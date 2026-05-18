"""Bet ledger frontmatter schema.

Companion to `frontmatter.py`. Per the convicção-bet-ledger constitution,
every bet file under `vault/bets/` validates against `BetFrontmatter`.

This module is a *sibling* to `frontmatter.py` rather than an extension —
the bet ledger is a new instance carrier closing the R1 residue, not a new
node type in the existing schema. Integrators may later register
`BetFrontmatter` in `frontmatter._FRONTMATTER_BY_TYPE` if `node_type: bet`
is added to the canonical type set; until then, bets live in their own
namespace and are dispatched by file location, not node_type.
"""

from __future__ import annotations

from datetime import date
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

BetStatus = Literal["open", "called-true", "called-false", "withdrawn"]
ConviccaoLevel = Literal["high", "medium", "low"]

BETS_DIR_NAME = "bets"


class BetFrontmatter(BaseModel):
    """Frontmatter shape for a vault/bets/B-NNN-*.md file.

    Mirrors §3 of `vault/constitution/convicção-bet-ledger-constitution.md`.
    """

    model_config = ConfigDict(
        populate_by_name=True,
        extra="allow",
        arbitrary_types_allowed=True,
    )

    bet_id: str = Field(pattern=r"^B-\d{3,}$")
    for_claim: str
    staked_on: date | str
    falsification_test: str = Field(min_length=1)
    dependents: list[str] = Field(default_factory=list)
    status: BetStatus = "open"
    convicção_at_stake: ConviccaoLevel = Field(alias="convicção_at_stake")


def is_bet_path(path: Path) -> bool:
    """True if the path lives under a `bets/` directory in the vault."""
    return BETS_DIR_NAME in path.parts


def is_active_status(status: str | None) -> bool:
    """Statuses at which a high-convicção node must carry at least one bet."""
    return status in {"active", "consolidated", "evergreen"}


def is_live_bet(status: str | None) -> bool:
    """A bet that still counts toward closing the no-orphan rule."""
    return status in {"open", "called-true"}
