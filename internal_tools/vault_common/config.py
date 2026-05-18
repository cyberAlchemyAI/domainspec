"""Vault paths and config."""

from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class Config:
    vault_roots: tuple[Path, ...]
    exclude_dirs: tuple[str, ...] = (
        ".git", ".claude", "node_modules", "__pycache__",
        "snapshots", "migrations", ".pytest_cache",
    )
    db_root: Path = field(default_factory=lambda: Path.home() / ".domainspec-vault")


DOMAINSPEC_VAULT = Path("/Users/victorboscaro/domainspec/vault")

DEFAULT_CONFIG = Config(
    vault_roots=(DOMAINSPEC_VAULT,),
)
