"""CLI for reflection-tower structural checks."""

from __future__ import annotations

import argparse
from pathlib import Path

from .explorer import analyse_vault, certify_origin, dumps


def _render_text(payload: dict) -> str:
    summary = payload["summary"]
    verdict = payload.get("verdict")
    title = f"Tower Explorer: {verdict.upper()}" if verdict else "Tower Explorer inventory"
    lines = [
        title,
        "nodes={nodes} edges={edges} cross_layer={crossLayerEdges} unresolved={unresolvedEdges}".format(**summary),
    ]
    diagnostics = payload.get("diagnostics", [])
    if diagnostics:
        lines.append("")
        for diagnostic in diagnostics[:40]:
            lines.append(
                "[{severity}] {code}: {source} -> {target}: {message}".format(**diagnostic)
            )
        if len(diagnostics) > 40:
            lines.append(f"...and {len(diagnostics) - 40} more diagnostic(s)")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="tower-explorer")
    sub = parser.add_subparsers(dest="command", required=True)

    analyse = sub.add_parser("analyse-vault", help="Parse vault nodes and Connections edges.")
    analyse.add_argument("root", type=Path)
    analyse.add_argument("--json", action="store_true")

    certify = sub.add_parser("certify-origin", help="Run T-1 origin-rung certificate.")
    certify.add_argument("root", type=Path)
    certify.add_argument("--json", action="store_true")
    certify.add_argument("--fail-on-flag", action="store_true")

    args = parser.parse_args(argv)
    if args.command == "analyse-vault":
        payload = analyse_vault(args.root)
        print(dumps(payload) if args.json else _render_text(payload))
        return 0
    payload = certify_origin(args.root)
    print(dumps(payload) if args.json else _render_text(payload))
    if payload["verdict"] == "block":
        return 2
    if payload["verdict"] == "flag" and getattr(args, "fail_on_flag", False):
        return 1
    return 0

