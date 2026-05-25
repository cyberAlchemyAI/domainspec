from __future__ import annotations

import tempfile
import textwrap
import unittest
from pathlib import Path

from tower_explorer import analyse_vault, certify_origin


def write(path: Path, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(textwrap.dedent(body).lstrip())


class TowerExplorerTests(unittest.TestCase):
    def test_cross_layer_edge_requires_origin_rung(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write(
                root / "constitution" / "rule.md",
                """
                ---
                node_type: constitution
                layer: ontology
                status: active
                ---

                # Rule

                ## Connections

                | Document | Type | Description |
                |---|---|---|
                | [../premise/source.md](../premise/source.md) | `derives-from` | no origin here |
                """,
            )
            write(
                root / "premise" / "source.md",
                """
                ---
                node_type: premise
                layer: architecture
                status: active
                ---

                # Source
                """,
            )
            result = certify_origin(root)
            self.assertEqual(result["verdict"], "flag")
            self.assertIn("MISSING_ORIGIN_RUNG", {d["code"] for d in result["diagnostics"]})

    def test_origin_rung_passes_cross_layer_edge(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write(
                root / "constitution" / "rule.md",
                """
                ---
                node_type: constitution
                layer: ontology
                status: active
                ---

                # Rule

                ## Connections

                | Document | Type | Description |
                |---|---|---|
                | [../premise/source.md](../premise/source.md) | `derives-from` | origin_rung: L4; premise source |
                """,
            )
            write(
                root / "premise" / "source.md",
                """
                ---
                node_type: premise
                layer: architecture
                status: active
                ---

                # Source
                """,
            )
            result = certify_origin(root)
            self.assertEqual(result["verdict"], "pass")

    def test_analyse_vault_counts_edges(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write(
                root / "a.md",
                """
                ---
                node_type: readme
                layer: ontology
                status: active
                ---

                # A

                ## Connections

                | Document | Type | Description |
                |---|---|---|
                | [[b]] | `cites` | same layer |
                """,
            )
            write(
                root / "b.md",
                """
                ---
                node_type: readme
                layer: ontology
                status: active
                ---

                # B
                """,
            )
            result = analyse_vault(root)
            self.assertEqual(result["summary"]["nodes"], 2)
            self.assertEqual(result["summary"]["edges"], 1)
            self.assertEqual(result["summary"]["crossLayerEdges"], 0)


if __name__ == "__main__":
    unittest.main()

