"""convergence-runner CLI: dispatch, replay, show."""

from __future__ import annotations

import json
from pathlib import Path

import typer

from .dispatch import ConvergenceLog

app = typer.Typer(help="convergence-runner — multi-agent dispatch with structured logging")

_DEFAULT_LOG_ROOT = Path.home() / ".domainspec-vault" / "convergence"


@app.command()
def init(log_root: str = typer.Option(str(_DEFAULT_LOG_ROOT), "--log-root")) -> None:
    """Initialize the convergence log directory."""
    ConvergenceLog(log_root)
    typer.echo(f"convergence log root: {log_root}")


@app.command()
def list_experiments(log_root: str = typer.Option(str(_DEFAULT_LOG_ROOT), "--log-root")) -> None:
    """List recorded experiments."""
    log = ConvergenceLog(log_root)
    if not log.experiments.exists():
        typer.echo("(no experiments)")
        return
    for line in log.experiments.read_text().splitlines():
        if not line.strip():
            continue
        rec = json.loads(line)
        typer.echo(f"{rec['experiment_id']}\t{rec['timestamp']}\tprompt={rec['prompt_sha256'][:12]}")


@app.command()
def show(
    experiment_id: str,
    log_root: str = typer.Option(str(_DEFAULT_LOG_ROOT), "--log-root"),
) -> None:
    """Show all runs for an experiment."""
    log = ConvergenceLog(log_root)
    if log.runs.exists():
        for line in log.runs.read_text().splitlines():
            if not line.strip():
                continue
            rec = json.loads(line)
            if rec.get("experiment_id") == experiment_id:
                typer.echo(json.dumps(rec, indent=2))


if __name__ == "__main__":
    app()
