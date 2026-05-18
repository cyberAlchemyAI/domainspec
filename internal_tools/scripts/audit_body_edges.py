"""T7 corpus audit — verify the body-edge parser against the live vault.

One-off observational script. Walks every .md under the configured vault
roots, runs `extract_edges`, and reports:

  1. Files with a `## Connections` block but ZERO body edges extracted
     (likely format drift the parser silently swallows).
  2. Files whose Type column contains values not in the 21-edge catalog
     (after edge-extractor canonicalization). For body-edge rows, we
     compare the raw verb against EDGE_TYPES.
  3. Any parser exceptions per file.

Writes a Markdown report to /tmp/edges-corpus-audit.md.

Usage:
    python -m scripts.audit_body_edges
"""

from __future__ import annotations

import re
import sys
import traceback
from collections import defaultdict
from pathlib import Path

from vault_common import EDGE_TYPES, extract_edges, parse_doc, walk_vault

OUT = Path("/tmp/edges-corpus-audit.md")

# Heading regex mirrors the parser convention (## Connections, any case-sensitive).
_CONN_HEADING = re.compile(r"^#{1,6}\s+Connections\s*$", re.MULTILINE)
# Body-row regex (3 pipes minimum): | <doc> | <verb> | <desc> |
_ROW = re.compile(r"^\s*\|([^|\n]+)\|([^|\n]+)\|([^|\n]+)\|\s*$", re.MULTILINE)
# Separator row to skip
_SEP = re.compile(r"^\s*\|[\s\-:|]+\|\s*$")


def _slice_connections_block(body: str) -> str | None:
    """Return the text between '## Connections' and the next H1/H2 (or EOF)."""
    m = _CONN_HEADING.search(body)
    if not m:
        return None
    start = m.end()
    nxt = re.search(r"^#{1,2}\s+", body[start:], re.MULTILINE)
    end = start + (nxt.start() if nxt else len(body) - start)
    return body[start:end]


def _raw_verbs_in_block(block: str) -> list[str]:
    """Extract the Type column from every body row in the Connections block."""
    verbs: list[str] = []
    for line in block.splitlines():
        if _SEP.match(line):
            continue
        m = _ROW.match(line)
        if not m:
            continue
        verb = m.group(2).strip()
        # Skip the header row
        if verb.lower() in {"type", "edge", "edge type"}:
            continue
        if not verb:
            continue
        verbs.append(verb)
    return verbs


def main() -> int:
    total = 0
    with_conn_block = 0
    silent_zero: list[str] = []  # files with `## Connections` block but 0 body edges
    offcatalog_rows: dict[str, list[tuple[str, str]]] = defaultdict(list)  # path -> [(raw_verb, normalized_or_none)]
    parser_exceptions: list[tuple[str, str]] = []  # (path, traceback)

    for doc in walk_vault():
        total += 1
        body = doc.body or ""
        block = _slice_connections_block(body)

        try:
            edges = list(extract_edges(doc))
        except Exception:  # pragma: no cover - audit
            parser_exceptions.append((str(doc.path), traceback.format_exc()))
            continue

        body_edges = [e for e in edges if getattr(e, "source_loc", None) and "body" in str(e.source_loc)]
        # Fallback: any edge whose src is the file itself counts; the carve-out flag
        # of body vs frontmatter origin lives in source_loc per kernel OQ-G/OQ-E.

        if block is not None:
            with_conn_block += 1
            raw_verbs = _raw_verbs_in_block(block)
            # 1) silent zero check: block exists and contains data rows but zero edges
            if raw_verbs and not edges:
                silent_zero.append(str(doc.path))
            # 2) off-catalog raw verbs (compare against canonical catalog directly;
            #    if parser canonicalizes, the raw form may still be off-catalog).
            for v in raw_verbs:
                if v not in EDGE_TYPES:
                    offcatalog_rows[str(doc.path)].append((v, ""))

    # Severity gate: >10% drift triggers a STOP signal.
    silent_pct = (len(silent_zero) / with_conn_block * 100.0) if with_conn_block else 0.0
    offcatalog_total = sum(len(v) for v in offcatalog_rows.values())

    lines: list[str] = []
    lines.append("---")
    lines.append("tags: [audit, edges, vault_common, t7]")
    lines.append("node_type: audit")
    lines.append("is_session: true")
    lines.append("layer: architecture")
    lines.append("nature: reference")
    lines.append("status: draft")
    lines.append("version: 0.1.0")
    lines.append("last_updated: 2026-05-18")
    lines.append("---")
    lines.append("")
    lines.append("# T7 — Body-Edge Parser Corpus Audit")
    lines.append("")
    lines.append(f"- Files walked: **{total}**")
    lines.append(f"- Files with `## Connections` block: **{with_conn_block}**")
    lines.append(f"- Silent-zero (block present, 0 edges extracted): **{len(silent_zero)}** ({silent_pct:.1f}% of blocks)")
    lines.append(f"- Off-catalog raw verbs in body rows: **{offcatalog_total}** across **{len(offcatalog_rows)}** files")
    lines.append(f"- Parser exceptions: **{len(parser_exceptions)}**")
    lines.append("")
    lines.append("## Verdict")
    if silent_pct > 10.0 or parser_exceptions:
        lines.append("- **STOP signal:** silent-zero rate exceeds 10% or parser exceptions present.")
    else:
        lines.append("- **OK:** drift below the 10% threshold; observation only.")
    lines.append("")

    if silent_zero:
        lines.append("## Silent-Zero Files")
        for p in sorted(silent_zero):
            lines.append(f"- `{p}`")
        lines.append("")

    if offcatalog_rows:
        lines.append("## Off-Catalog Body Verbs")
        lines.append("")
        lines.append("Raw Type-column values not present in `EDGE_TYPES`. These either need a")
        lines.append("catalog amendment (workstream: `vault/discovery/domainspec-vault-edges/`)")
        lines.append("or are documentation/heading artifacts the parser should ignore.")
        lines.append("")
        for path in sorted(offcatalog_rows):
            verbs = offcatalog_rows[path]
            uniq = sorted({v for v, _ in verbs})
            lines.append(f"- `{path}`: {', '.join(uniq)}")
        lines.append("")

    if parser_exceptions:
        lines.append("## Parser Exceptions")
        for path, tb in parser_exceptions:
            lines.append(f"### `{path}`")
            lines.append("```")
            lines.append(tb.rstrip())
            lines.append("```")
            lines.append("")

    OUT.write_text("\n".join(lines))
    print(f"wrote {OUT}")
    print(f"verdict: silent_zero={len(silent_zero)} ({silent_pct:.1f}%); offcatalog_files={len(offcatalog_rows)}; exceptions={len(parser_exceptions)}")
    # Exit non-zero if STOP signal so callers can detect.
    return 1 if silent_pct > 10.0 or parser_exceptions else 0


if __name__ == "__main__":
    sys.exit(main())
