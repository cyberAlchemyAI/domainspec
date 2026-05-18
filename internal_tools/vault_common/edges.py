"""Edge extractor. Single canonical edge-verb taxonomy.

Per OQ-E: edges are surfaced from BOTH frontmatter `EDGE_FIELDS` and from
the canonical `## Connections` Markdown table in the document body. Body
edges are additive — neither source is privileged. The body-table format
is documented in `vault/ontology-conventions.md` §8 ("Edge Types
(Connections Section)").

Per OQ-G: every `Edge` carries a `forward_only_reason` field. It is
populated by the extractor when the source/target match one of the
ontology's carve-out patterns (`.claude/skills/**`, `.claude/agents/**`,
`vault/sessions/**`). Downstream auditors use this to skip the
bidirectionality check on edges that are forward-only by design.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import PurePosixPath
from typing import Literal

from .frontmatter import EDGE_FIELDS
from .walker import VaultDoc

EDGE_TYPES: frozenset[str] = frozenset(EDGE_FIELDS)


ForwardOnlyReason = Literal[
    "skill-target-carveout",
    "agent-target-carveout",
    "session-source-carveout",
]


@dataclass(frozen=True)
class Edge:
    src: str
    dst: str
    edge_type: str
    # Per OQ-G: marks edges the bidirectionality auditor must skip. None for
    # ordinary vault-to-vault edges; one of the carve-out reasons otherwise.
    forward_only_reason: ForwardOnlyReason | None = None


# --- carve-out classification ------------------------------------------------


def _classify_forward_only(
    dst: str, src_is_session: bool
) -> ForwardOnlyReason | None:
    """Return the carve-out reason for this edge, or None.

    The three carve-outs are sourced verbatim from
    `vault/ontology-conventions.md` §8:
      - `.claude/skills/**` targets — skill-target-carveout
      - `.claude/agents/**` targets — agent-target-carveout
      - sessions (is_session: true) as source — session-source-carveout

    If multiple apply, target carve-outs take precedence over the session
    source carve-out (a session pointing at a skill is still a skill-target
    edge; the auditor needs to skip it for either reason).
    """
    # Normalize for substring matching — handles both absolute paths and
    # vault-relative paths (forward slashes assumed; PurePosixPath used to
    # walk parts portably).
    dst_parts = PurePosixPath(dst.replace("\\", "/")).parts
    if _has_subsequence(dst_parts, (".claude", "skills")):
        return "skill-target-carveout"
    if _has_subsequence(dst_parts, (".claude", "agents")):
        return "agent-target-carveout"
    if src_is_session:
        return "session-source-carveout"
    return None


def _has_subsequence(parts: tuple[str, ...], needle: tuple[str, ...]) -> bool:
    """True iff `needle` appears as a contiguous run in `parts`."""
    n = len(needle)
    if n == 0:
        return True
    for i in range(len(parts) - n + 1):
        if parts[i : i + n] == needle:
            return True
    return False


# --- body parser -------------------------------------------------------------

# Match a heading that says "Connections" — tolerates numbered prefixes like
# "## 8. Connections" and trailing whitespace. Case-sensitive on the word
# itself (matches the conventions doc spec).
_CONNECTIONS_HEADING_RE = re.compile(
    r"^#{1,6}\s+(?:\d+\.\s+)?Connections\s*$", re.MULTILINE
)

# Strip surrounding markdown link syntax `[text](href)` or wikilink `[[x]]`
# and backticks, returning the inner reference token.
_MD_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
_WIKILINK_RE = re.compile(r"\[\[([^\]]+)\]\]")


def _clean_cell(cell: str) -> str:
    """Trim a Markdown table cell to its semantic value.

    Handles backticks, `[label](href)` links (returns href), and `[[x]]`
    wikilinks. Falls back to the raw stripped text.
    """
    s = cell.strip()
    # Markdown link → use href (it is the target reference).
    m = _MD_LINK_RE.search(s)
    if m:
        s = m.group(2).strip()
    else:
        m2 = _WIKILINK_RE.search(s)
        if m2:
            s = m2.group(1).strip()
    # Strip backticks and surrounding whitespace.
    s = s.strip().strip("`").strip()
    return s


def _resolve_target(raw: str, src_dir: PurePosixPath) -> str:
    """Resolve a table-cell target relative to the source file's directory.

    Rules:
      - Absolute paths (starting with `/`) are returned as-is.
      - URLs (`http://` or `https://`) are returned as-is.
      - Paths beginning with `vault/` are treated as repo-relative and
        returned as-is — this is the conventions-document style.
      - Anything else is resolved relative to `src_dir`.
    """
    if not raw:
        return raw
    if raw.startswith(("http://", "https://", "/")):
        return raw
    # Repo-relative roots used throughout the vault.
    if raw.startswith(("vault/", "docs/", ".claude/", "internal_tools/", "templates/")):
        return raw
    # Otherwise resolve relative to the source file's directory, normalising
    # `..` segments — but keep the result POSIX-style for stable comparison.
    return str((src_dir / raw).resolve() if False else _norm_join(src_dir, raw))


def _norm_join(base: PurePosixPath, rel: str) -> str:
    """Join `base` + `rel` and normalise `..` without touching the filesystem.

    Preserves a leading `/` if `base` is absolute, so an absolute source
    directory yields an absolute resolved target.
    """
    is_absolute = str(base).startswith("/")
    parts = list(base.parts) + rel.replace("\\", "/").split("/")
    out: list[str] = []
    for p in parts:
        if p in ("", ".", "/"):
            continue
        if p == "..":
            if out:
                out.pop()
            continue
        out.append(p)
    joined = "/".join(out)
    return ("/" + joined) if is_absolute else joined


def _extract_connections_section(body: str) -> str | None:
    """Return the slice of `body` from the Connections heading to the next
    same-or-higher H heading (or EOF). None if no Connections heading."""
    m = _CONNECTIONS_HEADING_RE.search(body)
    if not m:
        return None
    start = m.end()
    # The boundary is the next heading of equal or shallower depth. For
    # simplicity we stop at the next H1/H2 ("# " or "## "). Connections is
    # always declared at H2 in the conventions doc; the tolerance for H1
    # below is a defensive measure.
    boundary_re = re.compile(r"^#{1,2}\s+\S", re.MULTILINE)
    rest = body[start:]
    nxt = boundary_re.search(rest)
    if nxt is None:
        return rest
    return rest[: nxt.start()]


def _iter_connections_rows(
    section: str,
) -> list[tuple[str, str, str]]:
    """Parse the `| Document | Type | Description |` table within the
    Connections section and yield `(document, type, description)` triples.

    Skips the header row and the separator row. Tolerates extra leading or
    trailing pipes, and rows with more than three columns (uses the first
    three semantic columns).
    """
    rows: list[tuple[str, str, str]] = []
    seen_header = False
    for raw_line in section.splitlines():
        line = raw_line.strip()
        if not line.startswith("|"):
            continue
        # Strip leading/trailing pipes then split.
        inner = line.strip("|")
        cells = [c for c in inner.split("|")]
        if len(cells) < 3:
            continue
        # Separator row: all cells made of `-`, `:`, and whitespace.
        if all(set(c.strip()) <= set("-: ") and c.strip() for c in cells[:3]):
            continue
        if not seen_header:
            # First non-separator row is the header (`Document | Type | Description`)
            # — case-tolerant check, but skip whatever it is.
            seen_header = True
            header_norm = [c.strip().lower() for c in cells[:3]]
            if "document" in header_norm[0] or header_norm == [
                "document",
                "type",
                "description",
            ]:
                continue
            # If the first row didn't look like a header, fall through and
            # treat it as data (defensive — conventions doc always has a
            # header).
        document = _clean_cell(cells[0])
        edge_type = _clean_cell(cells[1])
        description = cells[2].strip() if len(cells) > 2 else ""
        if not document or not edge_type:
            continue
        rows.append((document, edge_type, description))
    return rows


# --- public entry point ------------------------------------------------------


def extract_edges(doc: VaultDoc) -> list[Edge]:
    """Extract typed edges from frontmatter AND the `## Connections` body table.

    Per OQ-E, both sources are valid and additive. Per OQ-G, every Edge is
    classified for carve-out so downstream auditors can skip
    forward-only-by-design edges.
    """
    edges: list[Edge] = []
    src = str(doc.path)
    src_is_session = doc.is_session

    # --- frontmatter-declared edges (legacy behavior, preserved) ---
    fm = doc.frontmatter or {}
    for etype in EDGE_TYPES:
        seen_keys: set[str] = set()
        for key in (etype, etype.replace("-", "_")):
            if key in seen_keys:
                continue
            seen_keys.add(key)
            targets = fm.get(key)
            if not targets:
                continue
            if isinstance(targets, str):
                targets = [targets]
            for tgt in targets:
                tgt_s = str(tgt)
                edges.append(
                    Edge(
                        src=src,
                        dst=tgt_s,
                        edge_type=etype,
                        forward_only_reason=_classify_forward_only(
                            tgt_s, src_is_session
                        ),
                    )
                )

    # --- body-declared edges (## Connections table) ---
    section = _extract_connections_section(doc.body or "")
    if section is not None:
        src_dir = PurePosixPath(str(doc.path)).parent
        for document, edge_type, _desc in _iter_connections_rows(section):
            resolved = _resolve_target(document, src_dir)
            edges.append(
                Edge(
                    src=src,
                    dst=resolved,
                    edge_type=edge_type,
                    forward_only_reason=_classify_forward_only(
                        resolved, src_is_session
                    ),
                )
            )

    return edges
