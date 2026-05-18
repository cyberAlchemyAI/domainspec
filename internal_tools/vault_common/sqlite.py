"""SQLite kernel. Each subsystem owns its own DB file; this is just open/migrate."""

from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator


@contextmanager
def open_db(path: Path | str, migrations: list[str] | None = None) -> Iterator[sqlite3.Connection]:
    """Open a SQLite connection, run optional migrations, yield it."""
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(p)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        if migrations:
            for migration in migrations:
                conn.executescript(migration)
        yield conn
        conn.commit()
    finally:
        conn.close()
