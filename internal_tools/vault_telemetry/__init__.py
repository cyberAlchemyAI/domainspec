"""vault_telemetry — read-only metrics aggregator.

MVP: the residue counter measures whether the four predicted residues from
`graph-as-residue-attractor` empirically generate new constitutions in the
30 days following snapshot zero.

Also owns the convicção bet ledger (closes R1) — relocated from `vault_ctl`
per D-5 rescope (decision D-B, 2026-05-18). Bets are telemetry-shaped signals.
"""

from ._bets_kernel import (
    BetFrontmatter,
    BetStatus,
    ConviccaoLevel,
    is_active_status,
    is_bet_path,
    is_live_bet,
)
from .bets import app as bets_app

__all__ = [
    "BetFrontmatter",
    "BetStatus",
    "ConviccaoLevel",
    "is_active_status",
    "is_bet_path",
    "is_live_bet",
    "bets_app",
]

__version__ = "0.1.0"
