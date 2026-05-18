"""Dispatch infrastructure for the convergence runner.

MVP: structured spec + log. No actual model client wired here yet — the
agent dispatch is performed by the runtime (Claude Code Agent tool) and
this module captures the spec and persists the result.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class AgentSpec:
    model_id: str
    tool_allowlist: list[str]
    hard_fetch_required: bool = False
    max_tool_calls: int | None = None
    system_prompt_sha256: str | None = None


@dataclass
class ExperimentSpec:
    experiment_id: str
    prompt: str
    corpus_paths: list[str]
    agent_spec: AgentSpec
    replicates: int
    notes: str = ""

    @property
    def prompt_sha256(self) -> str:
        return hashlib.sha256(self.prompt.encode("utf-8")).hexdigest()


@dataclass
class RunResult:
    run_id: str
    experiment_id: str
    started_at: str
    ended_at: str
    tool_calls: dict[str, int]
    tokens: dict[str, int]
    verification_levels: dict[str, int]
    hard_fetch_satisfied: bool
    raw_transcript_ref: str
    output_text: str
    notes: str = ""


def corpus_hash(paths: list[str]) -> str:
    """Content-address a corpus snapshot from paths."""
    h = hashlib.sha256()
    for p in sorted(paths):
        try:
            data = Path(p).read_bytes()
        except OSError:
            data = b""
        h.update(p.encode("utf-8"))
        h.update(b"\t")
        h.update(hashlib.sha256(data).hexdigest().encode("ascii"))
        h.update(b"\n")
    return h.hexdigest()


class ConvergenceLog:
    """Append-only JSONL log of experiments and runs."""

    def __init__(self, root: Path | str):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)
        self.experiments = self.root / "experiments.jsonl"
        self.runs = self.root / "runs.jsonl"
        self.boundary = self.root / "boundary_observations.jsonl"

    def record_experiment(self, spec: ExperimentSpec, c_hash: str) -> None:
        rec = {
            "experiment_id": spec.experiment_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "prompt_sha256": spec.prompt_sha256,
            "prompt_excerpt": spec.prompt[:240],
            "corpus_hash": c_hash,
            "agent_spec": {
                "model_id": spec.agent_spec.model_id,
                "tool_allowlist": spec.agent_spec.tool_allowlist,
                "hard_fetch_required": spec.agent_spec.hard_fetch_required,
                "max_tool_calls": spec.agent_spec.max_tool_calls,
            },
            "replicates": spec.replicates,
            "notes": spec.notes,
        }
        with open(self.experiments, "a", encoding="utf-8") as f:
            f.write(json.dumps(rec) + "\n")

    def record_run(self, result: RunResult) -> None:
        rec = {
            "run_id": result.run_id,
            "experiment_id": result.experiment_id,
            "started_at": result.started_at,
            "ended_at": result.ended_at,
            "tool_calls": result.tool_calls,
            "tokens": result.tokens,
            "verification_levels": result.verification_levels,
            "hard_fetch_satisfied": result.hard_fetch_satisfied,
            "raw_transcript_ref": result.raw_transcript_ref,
            "output_excerpt": result.output_text[:240],
            "notes": result.notes,
        }
        with open(self.runs, "a", encoding="utf-8") as f:
            f.write(json.dumps(rec) + "\n")

    def record_boundary_observation(self, experiment_id: str, **fields: Any) -> None:
        rec = {
            "experiment_id": experiment_id,
            "ts": datetime.now(timezone.utc).isoformat(),
            **fields,
        }
        with open(self.boundary, "a", encoding="utf-8") as f:
            f.write(json.dumps(rec) + "\n")
