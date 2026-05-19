"""Telemetry consumer for `subagent-strategy.dispatched` events (R28).

Reads the JSONL sink at `internal_tools/vault_telemetry/events/subagent-strategy.jsonl`
and aggregates per-cycle stats. Closes the OQ-telemetry-consumer anchor for the
v0.2.0 bootstrap_override.

The consumer is read-only. It surfaces:
  - dispatch count by mode / dispatch_kind / heuristic_row (when later added)
  - bootstrap_override usage per amendment cycle (anti-abuse signal per R26)
  - orphan-event detection (events whose spec_path no longer exists on disk)
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path


DEFAULT_SINK = Path(__file__).resolve().parent / "events" / "subagent-strategy.jsonl"


@dataclass
class DispatchReport:
    total: int = 0
    by_mode: Counter[str] = field(default_factory=Counter)
    by_dispatch_kind: Counter[str] = field(default_factory=Counter)
    override_count_by_cycle: dict[str, int] = field(default_factory=lambda: defaultdict(int))
    orphan_spec_paths: list[str] = field(default_factory=list)
    malformed: list[str] = field(default_factory=list)

    def render(self) -> str:
        lines = [f"total dispatches: {self.total}"]
        lines.append("by mode:")
        for k, v in sorted(self.by_mode.items()):
            lines.append(f"  {k}: {v}")
        lines.append("by dispatch_kind:")
        for k, v in sorted(self.by_dispatch_kind.items()):
            lines.append(f"  {k}: {v}")
        if self.override_count_by_cycle:
            lines.append("bootstrap_override per cycle (>1 is R26 anti-abuse violation):")
            for cycle, n in sorted(self.override_count_by_cycle.items()):
                marker = " ⚠ VIOLATION" if n > 1 else ""
                lines.append(f"  {cycle}: {n}{marker}")
        if self.orphan_spec_paths:
            lines.append(f"orphan events (spec_path missing on disk): {len(self.orphan_spec_paths)}")
            for p in self.orphan_spec_paths[:5]:
                lines.append(f"  {p}")
        if self.malformed:
            lines.append(f"malformed events: {len(self.malformed)}")
        return "\n".join(lines)


def load_events(sink: Path = DEFAULT_SINK) -> list[dict]:
    if not sink.exists():
        return []
    events: list[dict] = []
    for line in sink.read_text().splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            events.append({"_malformed": line})
    return events


def aggregate(events: list[dict], repo_root: Path | None = None) -> DispatchReport:
    rep = DispatchReport()
    root = repo_root or Path(__file__).resolve().parents[2]
    for ev in events:
        if "_malformed" in ev:
            rep.malformed.append(ev["_malformed"][:80])
            continue
        rep.total += 1
        rep.by_mode[ev.get("mode") or "<none>"] += 1
        rep.by_dispatch_kind[ev.get("dispatch_kind") or "<none>"] += 1
        if ev.get("bootstrap_override_used"):
            cycle = ev.get("amendment_cycle") or "<unspecified>"
            rep.override_count_by_cycle[cycle] += 1
        spec_path = ev.get("spec_path")
        if spec_path and not (root / spec_path).exists():
            rep.orphan_spec_paths.append(spec_path)
    return rep


def report(sink: Path = DEFAULT_SINK, repo_root: Path | None = None) -> DispatchReport:
    return aggregate(load_events(sink), repo_root=repo_root)
