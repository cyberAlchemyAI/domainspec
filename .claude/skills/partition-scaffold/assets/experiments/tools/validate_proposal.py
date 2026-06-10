#!/usr/bin/env python3
"""Validate experiment PROPOSAL.md frontmatter against the protocol.

Stdlib only — no PyYAML, no venv. Parses the deliberately-flat frontmatter
subset the proposal template uses (scalars, folded `>` scalars, block lists
of scalars, and block lists of single-level maps) and enforces the
pre-registration rules in experiments/PROTOCOL.md.

Usage:
    python3 experiments/tools/validate_proposal.py [--frozen] [PATH ...]

With no PATH, validates every experiments/E*/PROPOSAL.md.
--frozen also git-diffs the immutable block of each frozen proposal against
its `frozen_at` commit and fails on any drift.

Exit 0 = all checked proposals are sound for their declared lifecycle.

The validator reads frontmatter only — it cannot check prose-body rules
(single-claim hypothesis, [FREEZE] steps matching §4, pre-registered
names). Those stay review-gated; see PROTOCOL.md "must-fix".

REPO resolves to the directory two levels above this file (the project root
that contains experiments/). In a scaffolded project this is the top-level
root; inside internal_tools/ it resolves to internal_tools/ — so the
freeze-drift git logic and the default glob scope to the nearest sub-project
automatically.
"""
from __future__ import annotations

import glob
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]

LIFECYCLES = {"proposed", "frozen", "running", "resolved"}
FROZEN_STATES = {"frozen", "running", "resolved"}
GATE_OPS = {">=", "<=", ">", "<", "==", "!="}
VERDICTS = {"BLOCK", "FLAG"}
ID_RE = re.compile(r"^experiment-E\d+-[a-z0-9][a-z0-9-]*$")
PLACEHOLDER = re.compile(r"ENN|<[^>]+>|\bslug\b|\bNN\b", re.IGNORECASE)

ALWAYS_REQUIRED = ["id", "node_type", "lifecycle", "date", "hypothesis",
                   "predicts", "gates", "falsifiers", "freezes"]
FROZEN_REQUIRED = ["frozen_at", "schema_version", "corpus"]
# Block that must not change after freeze (checked by --frozen).
IMMUTABLE = ["hypothesis", "predicts", "corpus", "gates", "falsifiers", "freezes"]


# ── minimal frontmatter parser ──────────────────────────────────────────
def split_frontmatter(text: str) -> str:
    if not text.startswith("---"):
        raise ValueError("file does not start with a '---' frontmatter block")
    end = text.find("\n---", 3)
    if end == -1:
        raise ValueError("frontmatter block is not closed with '---'")
    return text[3:end]


def _scalar(value: str):
    """Parse a scalar, honoring quotes and stripping only true trailing
    comments (a '#' inside a quoted string is preserved)."""
    v = value.strip()
    if not v:
        return None
    if v[0] in ("'", '"'):
        q = v[0]
        end = v.find(q, 1)
        if end != -1:
            return v[1:end]
        return v[1:]  # unterminated quote — best effort
    # unquoted: a comment starts at ' #'
    if " #" in v:
        v = v.split(" #", 1)[0].strip()
    if v in ("null", "~", ""):
        return None
    return v


def parse_frontmatter(block: str) -> dict:
    lines = block.split("\n")
    data: dict = {}
    i, n = 0, len(lines)
    while i < n:
        raw = lines[i]
        stripped = raw.strip()
        if not stripped or stripped.startswith("#"):
            i += 1
            continue
        indent = len(raw) - len(raw.lstrip())
        if indent != 0 or ":" not in stripped:
            i += 1
            continue
        key, _, rest = stripped.partition(":")
        key, rest = key.strip(), rest.strip()

        if rest in (">", "|"):  # folded / literal block scalar
            buf, i = [], i + 1
            while i < n and (not lines[i].strip() or
                             (len(lines[i]) - len(lines[i].lstrip())) > 0):
                if lines[i].strip():
                    buf.append(lines[i].strip())
                i += 1
            data[key] = " ".join(buf)
            continue

        if rest == "":  # block list (or empty value)
            items, i = [], i + 1
            while i < n:
                ln = lines[i]
                if not ln.strip():
                    i += 1
                    continue
                ind = len(ln) - len(ln.lstrip())
                if ind == 0:
                    break
                s = ln.strip()
                if not s.startswith("- "):
                    i += 1
                    continue
                first = s[2:].strip()
                if ":" in first and first[0] not in ("'", '"'):
                    d = {}
                    k, _, v = first.partition(":")
                    d[k.strip()] = _scalar(v)
                    item_indent = ind
                    i += 1
                    while i < n:
                        ln2 = lines[i]
                        if not ln2.strip():
                            i += 1
                            continue
                        ind2 = len(ln2) - len(ln2.lstrip())
                        if ind2 <= item_indent or ln2.strip().startswith("- "):
                            break
                        k2, _, v2 = ln2.strip().partition(":")
                        d[k2.strip()] = _scalar(v2)
                        i += 1
                    items.append(d)
                else:
                    items.append(_scalar(first))
                    i += 1
            data[key] = items if items else []
            continue

        data[key] = _scalar(rest)
        i += 1
    return data


# ── checks ──────────────────────────────────────────────────────────────
def _require_list(fm, key, errors):
    val = fm.get(key)
    if val is None:
        errors.append(f"{key}: required but missing/empty")
        return None
    if not isinstance(val, list):
        errors.append(f"{key}: must be a block list, not a scalar "
                      f"(got {val!r}) — prose-only {key} are not allowed")
        return None
    if not val:
        errors.append(f"{key}: at least one entry is required")
    return val


def validate(path: Path, check_frozen: bool = False) -> list[str]:
    errors: list[str] = []
    try:
        text = path.read_text(encoding="utf-8")
        fm = parse_frontmatter(split_frontmatter(text))
    except (ValueError, OSError) as e:
        return [f"frontmatter: {e}"]

    lifecycle = fm.get("lifecycle")
    if lifecycle not in LIFECYCLES:
        errors.append(f"lifecycle: must be one of {sorted(LIFECYCLES)}, got {lifecycle!r}")
    frozen = lifecycle in FROZEN_STATES

    # id
    _id = fm.get("id")
    if not _id:
        errors.append("id: required but missing")
    elif PLACEHOLDER.search(str(_id)) or not ID_RE.match(str(_id)):
        errors.append(f"id: must match experiment-E<N>-<kebab-slug> and not be a "
                      f"placeholder, got {_id!r}")

    if fm.get("node_type") != "experiment":
        errors.append(f"node_type: expected 'experiment', got {fm.get('node_type')!r}")

    for field in ALWAYS_REQUIRED:
        if field in ("gates", "falsifiers", "freezes"):
            continue  # validated structurally below
        if fm.get(field) in (None, "", []):
            errors.append(f"{field}: required but missing/empty")
    if frozen:
        for field in FROZEN_REQUIRED:
            if fm.get(field) in (None, "", []):
                errors.append(f"{field}: required once lifecycle is {lifecycle!r}")

    hyp = fm.get("hypothesis")
    if isinstance(hyp, str) and len(hyp.split()) < 5:
        errors.append("hypothesis: too short to be a falsifiable claim")

    # gates
    gates = _require_list(fm, "gates", errors)
    if isinstance(gates, list):
        seen = set()
        for idx, g in enumerate(gates):
            if not isinstance(g, dict):
                errors.append(f"gates[{idx}]: must be a map (id/metric/op/threshold/verdict_on_fail)")
                continue
            gid = g.get("id", f"#{idx}")
            if gid in seen:
                errors.append(f"gates: duplicate id {gid!r}")
            seen.add(gid)
            for k in ("id", "metric", "op", "threshold", "verdict_on_fail"):
                if g.get(k) in (None, ""):
                    errors.append(f"gates[{gid}]: missing {k}")
            if g.get("op") and g["op"] not in GATE_OPS:
                errors.append(f"gates[{gid}]: op {g['op']!r} not in {sorted(GATE_OPS)}")
            if g.get("verdict_on_fail") and g["verdict_on_fail"] not in VERDICTS:
                errors.append(f"gates[{gid}]: verdict_on_fail {g['verdict_on_fail']!r} not in {sorted(VERDICTS)}")
            thr = g.get("threshold")
            if thr is not None:
                try:
                    float(thr)
                except (TypeError, ValueError):
                    errors.append(f"gates[{gid}]: threshold {thr!r} is not numeric")

    # falsifiers
    fals = _require_list(fm, "falsifiers", errors)
    if isinstance(fals, list):
        seen = set()
        for idx, f in enumerate(fals):
            if not isinstance(f, dict):
                errors.append(f"falsifiers[{idx}]: must be a map (id/condition/verdict)")
                continue
            fid = f.get("id", f"#{idx}")
            if fid in seen:
                errors.append(f"falsifiers: duplicate id {fid!r}")
            seen.add(fid)
            for k in ("id", "condition", "verdict"):
                if f.get(k) in (None, ""):
                    errors.append(f"falsifiers[{fid}]: missing {k}")
            if f.get("verdict") and f["verdict"] not in VERDICTS:
                errors.append(f"falsifiers[{fid}]: verdict {f['verdict']!r} not in {sorted(VERDICTS)}")

    _require_list(fm, "freezes", errors)

    if frozen and fm.get("frozen_at") in (None, "", "null"):
        errors.append("frozen_at: must be a commit SHA once frozen")

    if lifecycle == "resolved":
        if not (path.parent / "VERDICT.md").exists():
            errors.append("lifecycle is 'resolved' but no sibling VERDICT.md exists")

    if check_frozen and frozen and fm.get("frozen_at"):
        errors += check_freeze_drift(path, fm)

    return errors


def check_freeze_drift(path: Path, fm_live: dict) -> list[str]:
    """git-diff the immutable block against the frozen_at commit."""
    sha = str(fm_live["frozen_at"])
    try:
        rel = path.resolve().relative_to(REPO)
    except ValueError:
        return ["--frozen: file is outside the repo, cannot git-diff"]
    try:
        out = subprocess.run(
            ["git", "-C", str(REPO), "show", f"{sha}:{rel}"],
            capture_output=True, text=True, timeout=15)
    except (OSError, subprocess.SubprocessError) as e:
        return [f"--frozen: git invocation failed ({e})"]
    if out.returncode != 0:
        return [f"--frozen: cannot read {rel} at {sha} "
                f"({out.stderr.strip() or 'commit/path not found'})"]
    try:
        fm_frozen = parse_frontmatter(split_frontmatter(out.stdout))
    except ValueError as e:
        return [f"--frozen: frozen revision unparseable ({e})"]
    drift = [k for k in IMMUTABLE if fm_live.get(k) != fm_frozen.get(k)]
    return [f"--frozen: immutable field {k!r} changed since {sha[:8]}" for k in drift]


def main(argv: list[str]) -> int:
    args = argv[1:]
    check_frozen = "--frozen" in args
    args = [a for a in args if a != "--frozen"]
    paths = [Path(p) for p in args]
    if not paths:
        paths = [Path(p) for p in
                 glob.glob(str(REPO / "experiments" / "E*" / "PROPOSAL.md"))]
    if not paths:
        print("No PROPOSAL.md files found under experiments/E*/. "
              "Nothing to validate.")
        return 0

    failed = 0
    for path in sorted(paths):
        try:
            rel = path.relative_to(REPO)
        except ValueError:
            rel = path
        if not path.exists():
            print(f"✗ {rel}: file not found")
            failed += 1
            continue
        errs = validate(path, check_frozen=check_frozen)
        if errs:
            failed += 1
            print(f"✗ {rel}")
            for e in errs:
                print(f"    - {e}")
        else:
            print(f"✓ {rel}")
    print(f"\n{len(paths) - failed}/{len(paths)} proposal(s) valid")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
