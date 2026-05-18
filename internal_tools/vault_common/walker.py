"""Walker — read-only iteration over vault files.

Yields VaultDoc with parsed frontmatter and body. The single canonical
walker for every subsystem.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator

from .config import Config, DEFAULT_CONFIG
from .frontmatter import parse_frontmatter


@dataclass
class VaultDoc:
    path: Path
    text: str
    content_hash: str
    frontmatter: dict | None
    body: str

    @property
    def is_session(self) -> bool:
        return bool((self.frontmatter or {}).get("is_session"))

    @property
    def node_type(self) -> str | None:
        return (self.frontmatter or {}).get("node_type")


def parse_doc(path: Path) -> VaultDoc | None:
    """Read a single markdown file into a VaultDoc."""
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return None
    fm, body = parse_frontmatter(text)
    return VaultDoc(
        path=path,
        text=text,
        content_hash=hashlib.sha256(text.encode("utf-8")).hexdigest(),
        frontmatter=fm,
        body=body,
    )


def walk_vault(config: Config = DEFAULT_CONFIG) -> Iterator[VaultDoc]:
    """Iterate every markdown file under the configured vault roots."""
    for root in config.vault_roots:
        for p in sorted(root.rglob("*.md")):
            if any(part in config.exclude_dirs for part in p.parts):
                continue
            doc = parse_doc(p)
            if doc is not None:
                yield doc
