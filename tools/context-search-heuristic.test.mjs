import assert from "node:assert/strict";
import test from "node:test";

// Strategies available to the spec-writer and planner agents.
const STRATEGIES = {
  LINKS_TAGS_FIRST: "links-tags-first",
  BROAD_SEARCH_FIRST: "broad-search-first",
  FOCUSED_RESEARCHER_FIRST: "focused-researcher-first",
  CAPABILITY_GRAPH_FIRST: "capability-graph-first",
};

// Weighted score where lower is better.
// signal is inverted to represent "effort to get useful signal".
function score({ signal, cost, ambiguity }, weights) {
  const signalPenalty = 1 - signal;
  return (
    signalPenalty * weights.signalPenalty +
    cost * weights.cost +
    ambiguity * weights.ambiguity
  );
}

function chooseStrategy(task, weights) {
  const scored = Object.entries(task.options)
    .map(([name, metrics]) => ({ name, total: score(metrics, weights) }))
    .sort((a, b) => a.total - b.total);

  const best = scored[0];
  const second = scored[1];
  const tieThreshold = 0.03;

  // If near tie or uncertain, default to DomainSpec-first navigation.
  if (!second || Math.abs(best.total - second.total) <= tieThreshold) {
    return STRATEGIES.LINKS_TAGS_FIRST;
  }

  return best.name;
}

const weights = {
  signalPenalty: 0.45,
  cost: 0.3,
  ambiguity: 0.25,
};

const scenarios = [
  {
    id: "known-feature-update",
    expected: STRATEGIES.LINKS_TAGS_FIRST,
    options: {
      [STRATEGIES.LINKS_TAGS_FIRST]: {
        signal: 0.92,
        cost: 0.18,
        ambiguity: 0.1,
      },
      [STRATEGIES.BROAD_SEARCH_FIRST]: {
        signal: 0.7,
        cost: 0.65,
        ambiguity: 0.4,
      },
      [STRATEGIES.FOCUSED_RESEARCHER_FIRST]: {
        signal: 0.84,
        cost: 0.5,
        ambiguity: 0.25,
      },
      [STRATEGIES.CAPABILITY_GRAPH_FIRST]: {
        signal: 0.85,
        cost: 0.22,
        ambiguity: 0.15,
      },
    },
  },
  {
    id: "unclear-legacy-contracts",
    expected: STRATEGIES.FOCUSED_RESEARCHER_FIRST,
    options: {
      [STRATEGIES.LINKS_TAGS_FIRST]: {
        signal: 0.55,
        cost: 0.45,
        ambiguity: 0.7,
      },
      [STRATEGIES.BROAD_SEARCH_FIRST]: {
        signal: 0.62,
        cost: 0.8,
        ambiguity: 0.6,
      },
      [STRATEGIES.FOCUSED_RESEARCHER_FIRST]: {
        signal: 0.83,
        cost: 0.4,
        ambiguity: 0.25,
      },
      [STRATEGIES.CAPABILITY_GRAPH_FIRST]: {
        signal: 0.6,
        cost: 0.38,
        ambiguity: 0.55,
      },
    },
  },
  {
    id: "brand-new-cross-feature-capability",
    expected: STRATEGIES.BROAD_SEARCH_FIRST,
    options: {
      [STRATEGIES.LINKS_TAGS_FIRST]: {
        signal: 0.45,
        cost: 0.4,
        ambiguity: 0.85,
      },
      [STRATEGIES.BROAD_SEARCH_FIRST]: {
        signal: 0.8,
        cost: 0.48,
        ambiguity: 0.3,
      },
      [STRATEGIES.FOCUSED_RESEARCHER_FIRST]: {
        signal: 0.7,
        cost: 0.52,
        ambiguity: 0.45,
      },
      [STRATEGIES.CAPABILITY_GRAPH_FIRST]: {
        signal: 0.4,
        cost: 0.32,
        ambiguity: 0.75,
      },
    },
  },
  {
    id: "tie-default-to-links-tags",
    expected: STRATEGIES.LINKS_TAGS_FIRST,
    options: {
      [STRATEGIES.LINKS_TAGS_FIRST]: {
        signal: 0.8,
        cost: 0.32,
        ambiguity: 0.3,
      },
      [STRATEGIES.BROAD_SEARCH_FIRST]: {
        signal: 0.81,
        cost: 0.34,
        ambiguity: 0.3,
      },
      [STRATEGIES.FOCUSED_RESEARCHER_FIRST]: {
        signal: 0.79,
        cost: 0.32,
        ambiguity: 0.31,
      },
      [STRATEGIES.CAPABILITY_GRAPH_FIRST]: {
        signal: 0.80,
        cost: 0.33,
        ambiguity: 0.31,
      },
    },
  },
  {
    id: "low-ambiguity-low-cost-docs-maintenance",
    expected: STRATEGIES.LINKS_TAGS_FIRST,
    options: {
      [STRATEGIES.LINKS_TAGS_FIRST]: {
        signal: 0.88,
        cost: 0.12,
        ambiguity: 0.08,
      },
      [STRATEGIES.BROAD_SEARCH_FIRST]: {
        signal: 0.75,
        cost: 0.55,
        ambiguity: 0.25,
      },
      [STRATEGIES.FOCUSED_RESEARCHER_FIRST]: {
        signal: 0.78,
        cost: 0.44,
        ambiguity: 0.2,
      },
      [STRATEGIES.CAPABILITY_GRAPH_FIRST]: {
        signal: 0.82,
        cost: 0.15,
        ambiguity: 0.1,
      },
    },
  },
  {
    id: "high-ambiguity-multi-owner-refs",
    expected: STRATEGIES.FOCUSED_RESEARCHER_FIRST,
    options: {
      [STRATEGIES.LINKS_TAGS_FIRST]: {
        signal: 0.58,
        cost: 0.38,
        ambiguity: 0.82,
      },
      [STRATEGIES.BROAD_SEARCH_FIRST]: {
        signal: 0.74,
        cost: 0.62,
        ambiguity: 0.55,
      },
      [STRATEGIES.FOCUSED_RESEARCHER_FIRST]: {
        signal: 0.86,
        cost: 0.46,
        ambiguity: 0.28,
      },
      [STRATEGIES.CAPABILITY_GRAPH_FIRST]: {
        signal: 0.62,
        cost: 0.42,
        ambiguity: 0.65,
      },
    },
  },
  {
    id: "capability-scoped-update",
    expected: STRATEGIES.CAPABILITY_GRAPH_FIRST,
    options: {
      [STRATEGIES.LINKS_TAGS_FIRST]: {
        signal: 0.78,
        cost: 0.22,
        ambiguity: 0.2,
      },
      [STRATEGIES.BROAD_SEARCH_FIRST]: {
        signal: 0.65,
        cost: 0.6,
        ambiguity: 0.35,
      },
      [STRATEGIES.FOCUSED_RESEARCHER_FIRST]: {
        signal: 0.75,
        cost: 0.45,
        ambiguity: 0.22,
      },
      [STRATEGIES.CAPABILITY_GRAPH_FIRST]: {
        signal: 0.94,
        cost: 0.15,
        ambiguity: 0.08,
      },
    },
  },
  {
    id: "cross-dependency-navigation",
    expected: STRATEGIES.FOCUSED_RESEARCHER_FIRST,
    options: {
      [STRATEGIES.LINKS_TAGS_FIRST]: {
        signal: 0.6,
        cost: 0.35,
        ambiguity: 0.55,
      },
      [STRATEGIES.BROAD_SEARCH_FIRST]: {
        signal: 0.72,
        cost: 0.7,
        ambiguity: 0.45,
      },
      [STRATEGIES.FOCUSED_RESEARCHER_FIRST]: {
        signal: 0.88,
        cost: 0.42,
        ambiguity: 0.2,
      },
      [STRATEGIES.CAPABILITY_GRAPH_FIRST]: {
        signal: 0.7,
        cost: 0.38,
        ambiguity: 0.4,
      },
    },
  },
  {
    id: "stories-driven-coverage-check",
    expected: STRATEGIES.LINKS_TAGS_FIRST,
    options: {
      [STRATEGIES.LINKS_TAGS_FIRST]: {
        signal: 0.92,
        cost: 0.18,
        ambiguity: 0.1,
      },
      [STRATEGIES.BROAD_SEARCH_FIRST]: {
        signal: 0.6,
        cost: 0.55,
        ambiguity: 0.4,
      },
      [STRATEGIES.FOCUSED_RESEARCHER_FIRST]: {
        signal: 0.72,
        cost: 0.4,
        ambiguity: 0.25,
      },
      [STRATEGIES.CAPABILITY_GRAPH_FIRST]: {
        signal: 0.84,
        cost: 0.2,
        ambiguity: 0.18,
      },
    },
  },
];

test("heuristic chooses expected strategy across representative scenarios", () => {
  const results = scenarios.map((scenario) => ({
    id: scenario.id,
    expected: scenario.expected,
    actual: chooseStrategy(scenario, weights),
  }));

  const failures = results.filter((r) => r.actual !== r.expected);
  const accuracy = (results.length - failures.length) / results.length;

  assert.equal(
    failures.length,
    0,
    `Heuristic mismatches (${failures.length}): ${JSON.stringify(failures, null, 2)}`,
  );

  assert.ok(
    accuracy >= 0.83,
    `Accuracy below threshold: ${(accuracy * 100).toFixed(1)}%`,
  );
});
