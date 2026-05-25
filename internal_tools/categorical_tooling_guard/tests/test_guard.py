from __future__ import annotations

import unittest
from pathlib import Path

from categorical_tooling_guard.guard import GuardPolicy, evaluate_report


def base_report(**summary_overrides):
    summary = {
        "concepts": 3,
        "typed_edges": 2,
        "parser_blind": False,
        "faithfulness_ratio": 1.0,
        "verdict": "RICH ENOUGH",
    }
    summary.update(summary_overrides)
    return {
        "summary": summary,
        "checks": {
            "m6_clusters": [],
            "unwitnessed_edges": [],
            "collisions": [],
        },
    }


class GuardPolicyTests(unittest.TestCase):
    def test_clean_report_passes(self):
        bundle = evaluate_report(base_report())
        self.assertEqual(bundle["verdict"], "pass")
        self.assertEqual(bundle["diagnostics"], [])

    def test_parser_blind_blocks(self):
        bundle = evaluate_report(base_report(parser_blind=True, typed_edges=0))
        self.assertEqual(bundle["verdict"], "block")
        self.assertIn("PARSER_BLIND", {d["code"] for d in bundle["diagnostics"]})

    def test_m6_cluster_blocks_by_default(self):
        report = base_report()
        report["checks"]["m6_clusters"] = [
            {
                "target": "ApplyGuardPolicy",
                "edge_type": "enforces",
                "sources": ["A", "B"],
            }
        ]
        bundle = evaluate_report(report)
        self.assertEqual(bundle["verdict"], "block")
        self.assertIn("M6_CLUSTER", {d["code"] for d in bundle["diagnostics"]})

    def test_m6_threshold_can_allow_legacy_cluster(self):
        report = base_report()
        report["checks"]["m6_clusters"] = [
            {"target": "T", "edge_type": "enforces", "sources": ["A", "B"]}
        ]
        bundle = evaluate_report(report, GuardPolicy(m6_threshold=1))
        self.assertEqual(bundle["verdict"], "pass")

    def test_low_faithfulness_flags(self):
        bundle = evaluate_report(base_report(faithfulness_ratio=0.25))
        self.assertEqual(bundle["verdict"], "flag")
        self.assertIn("LOW_FAITHFULNESS_RATIO", {d["code"] for d in bundle["diagnostics"]})

    def test_lean_unavailable_flags_or_blocks(self):
        missing = Path("/tmp/definitely-missing-lean-validator")
        flagged = evaluate_report(
            base_report(),
            GuardPolicy(lean_enabled=True, validator_root=missing),
        )
        blocked = evaluate_report(
            base_report(),
            GuardPolicy(lean_required=True, validator_root=missing),
        )
        self.assertEqual(flagged["verdict"], "flag")
        self.assertEqual(blocked["verdict"], "block")


if __name__ == "__main__":
    unittest.main()

