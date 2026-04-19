#!/usr/bin/env tsx
/**
 * DomainSpec Signal Analyzer
 *
 * Reads accumulated pipeline signals from JSONL, checks thresholds,
 * and outputs a summary. Used by:
 * - GitHub Action (domainspec-tuning.yml) to decide if agent reflection is needed
 * - Manual invocation for quick signal overview
 *
 * Usage:
 *   npx tsx domainspec/tools/analyze-signals.ts [--since <date>] [--min <n>] [--json]
 *
 * Exit codes:
 *   0 — no thresholds triggered
 *   1 — thresholds triggered (agent reflection recommended)
 *   2 — error reading signals
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// --- Types ---

interface SignalEnvelope {
  id: string;
  timestamp: string;
  session: string;
  feature: string;
  features?: string[];
  domainspecVersion: string;
  pipelineMode: string;
  type: string;
  severity: string;
  category: string;
  data: Record<string, unknown>;
}

interface ThresholdResult {
  id: string;
  description: string;
  met: boolean;
  evidence: string;
  count: number;
}

interface AnalysisResult {
  signalCount: number;
  dateRange: { from: string; to: string };
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  byFeature: Record<string, number>;
  thresholds: ThresholdResult[];
  thresholdsTriggered: number;
  aggregates: {
    avgOverheadRatio: number | null;
    reworkRate: number;
    firstPassRate: number;
    totalRuns: number;
    agentCost: {
      totalPremiumRequests: number;
      totalDurationSeconds: number;
      agentRuns: number;
      successRate: number | null;
      last7dPremiumRequests: number;
    };
  };
}

// --- Parse args ---

const args = process.argv.slice(2);
const sinceIdx = args.indexOf("--since");
const sinceDate = sinceIdx >= 0 ? args[sinceIdx + 1] : null;
const minIdx = args.indexOf("--min");
const minSignals = minIdx >= 0 ? parseInt(args[minIdx + 1], 10) : 5;
const jsonOutput = args.includes("--json");

// --- Load signals ---

const signalsPath = resolve(process.cwd(), "docs/signals/pipeline-signals.jsonl");

if (!existsSync(signalsPath)) {
  if (jsonOutput) {
    console.log(JSON.stringify({ error: "No signals file found", path: signalsPath }));
  } else {
    console.log(`No signals file found at ${signalsPath}`);
  }
  process.exit(0);
}

const raw = readFileSync(signalsPath, "utf-8");
const lines = raw.split("\n").filter((l) => l.trim().length > 0);

let signals: SignalEnvelope[] = [];
for (const line of lines) {
  try {
    const parsed = JSON.parse(line) as SignalEnvelope;
    if (sinceDate && parsed.timestamp < sinceDate) continue;
    signals.push(parsed);
  } catch {
    // skip malformed lines
  }
}

if (signals.length < minSignals) {
  if (jsonOutput) {
    console.log(
      JSON.stringify({ status: "insufficient", count: signals.length, minimum: minSignals })
    );
  } else {
    console.log(`Insufficient signals: ${signals.length} (minimum: ${minSignals})`);
  }
  process.exit(0);
}

// --- Aggregate ---

const byType: Record<string, number> = {};
const bySeverity: Record<string, number> = {};
const byFeature: Record<string, number> = {};

for (const s of signals) {
  byType[s.type] = (byType[s.type] || 0) + 1;
  bySeverity[s.severity] = (bySeverity[s.severity] || 0) + 1;
  byFeature[s.feature] = (byFeature[s.feature] || 0) + 1;
}

// --- Threshold checks ---

const thresholds: ThresholdResult[] = [];

// TH1: Same governance-gap description in 3+ signals
const govGaps = signals.filter((s) => s.type === "governance-gap");
const govGapGroups = groupBy(govGaps, (s) => String(s.data.shouldHaveBeenCaughtBy || "unknown"));
for (const [skill, group] of Object.entries(govGapGroups)) {
  if (group.length >= 3) {
    thresholds.push({
      id: "TH1",
      description: `Recurring governance gap in ${skill}`,
      met: true,
      evidence: `${group.length} occurrences across features: ${uniqueFeatures(group).join(", ")}`,
      count: group.length,
    });
  }
}

// TH2: overhead ratio > 0.5 for 3 consecutive runs
const overheadSignals = signals
  .filter((s) => s.type === "overhead")
  .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
if (overheadSignals.length >= 3) {
  const last3 = overheadSignals.slice(-3);
  const allHigh = last3.every((s) => (s.data.overheadRatio as number) > 0.5);
  if (allHigh) {
    thresholds.push({
      id: "TH2",
      description: "Overhead ratio > 0.5 for 3 consecutive runs",
      met: true,
      evidence: `Last 3 ratios: ${last3.map((s) => s.data.overheadRatio).join(", ")}`,
      count: 3,
    });
  }
}

// TH3: Same spec-gap pattern in 2+ features
const specGaps = signals.filter((s) => s.type === "spec-gap");
const specGapByDetail = groupBy(specGaps, (s) => String(s.data.missingDetail || ""));
for (const [detail, group] of Object.entries(specGapByDetail)) {
  const features = uniqueFeatures(group);
  if (features.length >= 2) {
    thresholds.push({
      id: "TH3",
      description: `Spec gap "${detail.substring(0, 60)}..." in ${features.length} features`,
      met: true,
      evidence: `Features: ${features.join(", ")}`,
      count: features.length,
    });
  }
}

// TH4: Rework on same step in 5+ signals
const reworks = signals.filter((s) => s.type === "rework");
const reworkByStep = groupBy(reworks, (s) => String(s.data.stepName || ""));
for (const [step, group] of Object.entries(reworkByStep)) {
  if (group.length >= 5) {
    thresholds.push({
      id: "TH4",
      description: `Rework hotspot: ${step}`,
      met: true,
      evidence: `${group.length} rework signals, avg iterations: ${avgIterations(group)}`,
      count: group.length,
    });
  }
}

// TH5: 3+ proposals targeting same file
const proposals = signals.filter((s) => s.type === "proposal");
const proposalByFile = groupBy(proposals, (s) => String(s.data.targetFile || ""));
for (const [file, group] of Object.entries(proposalByFile)) {
  if (group.length >= 3) {
    thresholds.push({
      id: "TH5",
      description: `Proposal cluster for ${file}`,
      met: true,
      evidence: `${group.length} proposals from ${uniqueSessions(group).length} sessions`,
      count: group.length,
    });
  }
}

// TH6: alignment-gap count > 10 in last 5 runs
const alignGaps = signals.filter((s) => s.type === "alignment-gap");
const recentSessions = [...new Set(signals.map((s) => s.session))].slice(-5);
const recentAlignGaps = alignGaps.filter((s) => recentSessions.includes(s.session));
if (recentAlignGaps.length > 10) {
  thresholds.push({
    id: "TH6",
    description: "Alignment drift: >10 gaps in last 5 runs",
    met: true,
    evidence: `${recentAlignGaps.length} alignment gaps across ${recentSessions.length} sessions`,
    count: recentAlignGaps.length,
  });
}

// TH7: Any critical governance gap
const criticalGaps = signals.filter(
  (s) => s.type === "governance-gap" && s.severity === "CRITICAL"
);
if (criticalGaps.length > 0) {
  thresholds.push({
    id: "TH7",
    description: "Critical governance gap detected",
    met: true,
    evidence: criticalGaps.map((s) => String(s.data.description || "")).join("; "),
    count: criticalGaps.length,
  });
}

// TH8: 3+ low-confidence decisions
const lowConfDecisions = signals.filter(
  (s) => s.type === "decision" && s.data.confidence === "low"
);
if (lowConfDecisions.length >= 3) {
  thresholds.push({
    id: "TH8",
    description: "Decision uncertainty: 3+ low-confidence decisions",
    met: true,
    evidence: lowConfDecisions.map((s) => String(s.data.description || "").substring(0, 50)).join("; "),
    count: lowConfDecisions.length,
  });
}

// TH9: spec-compliance violation by same agent in 2+ signals
const specCompliance = signals.filter((s) => s.type === "spec-compliance");
const complianceByAgent = groupBy(specCompliance, (s) => String(s.data.agentName || ""));
for (const [agent, group] of Object.entries(complianceByAgent)) {
  if (group.length >= 2) {
    thresholds.push({
      id: "TH9",
      description: `Spec-compliance violation by ${agent} (${group.length}x)`,
      met: true,
      evidence: `Violations: ${group.map((s) => String(s.data.violationType || "")).join(", ")}. Spec: ${group[0]?.data.specFile || "unknown"}`,
      count: group.length,
    });
  }
}

// TH10: agent-cost premiumRequests > 50 in rolling 7 days
const agentCosts = signals.filter((s) => s.type === "agent-cost");
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const recentCosts = agentCosts.filter((s) => s.timestamp >= sevenDaysAgo);
const totalPremiumRequests = recentCosts.reduce(
  (sum, s) => sum + ((s.data.premiumRequests as number) || 0), 0
);
if (totalPremiumRequests > 50) {
  thresholds.push({
    id: "TH10",
    description: `Agent cost threshold: ${totalPremiumRequests} premium requests in 7 days`,
    met: true,
    evidence: `${recentCosts.length} agent runs, ${totalPremiumRequests} premium requests. Agents: ${[...new Set(recentCosts.map((s) => String(s.data.agentName || "")))].join(", ")}`,
    count: totalPremiumRequests,
  });
}

// --- Compute aggregates ---

const overheadRatios = overheadSignals.map((s) => s.data.overheadRatio as number).filter(Boolean);
const avgOverheadRatio =
  overheadRatios.length > 0
    ? overheadRatios.reduce((a, b) => a + b, 0) / overheadRatios.length
    : null;

const stepVerdicts = signals.filter((s) => s.type === "step-verdict");
const reworkCount = reworks.length;
const reworkRate = stepVerdicts.length > 0 ? reworkCount / stepVerdicts.length : 0;
const firstPassSteps = stepVerdicts.filter((s) => (s.data.retriesNeeded as number) === 0);
const firstPassRate = stepVerdicts.length > 0 ? firstPassSteps.length / stepVerdicts.length : 0;
const totalRuns = overheadSignals.length;

// Agent cost aggregation
const totalAgentCost = agentCosts.reduce(
  (sum, s) => sum + ((s.data.premiumRequests as number) || 0), 0
);
const totalAgentDuration = agentCosts.reduce(
  (sum, s) => sum + ((s.data.durationSeconds as number) || 0), 0
);
const agentSuccessRate = agentCosts.length > 0
  ? agentCosts.filter((s) => s.data.success === true).length / agentCosts.length
  : null;

// --- Output ---

const triggeredThresholds = thresholds.filter((t) => t.met);

const result: AnalysisResult = {
  signalCount: signals.length,
  dateRange: {
    from: signals[0]?.timestamp || "",
    to: signals[signals.length - 1]?.timestamp || "",
  },
  byType,
  bySeverity,
  byFeature,
  thresholds: triggeredThresholds,
  thresholdsTriggered: triggeredThresholds.length,
  aggregates: {
    avgOverheadRatio,
    reworkRate: Math.round(reworkRate * 100) / 100,
    firstPassRate: Math.round(firstPassRate * 100) / 100,
    totalRuns,
    agentCost: {
      totalPremiumRequests: totalAgentCost,
      totalDurationSeconds: totalAgentDuration,
      agentRuns: agentCosts.length,
      successRate: agentSuccessRate !== null ? Math.round(agentSuccessRate * 100) / 100 : null,
      last7dPremiumRequests: totalPremiumRequests,
    },
  },
};

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`\n=== DomainSpec Signal Analysis ===\n`);
  console.log(`Signals analyzed: ${signals.length}`);
  console.log(`Date range: ${result.dateRange.from} → ${result.dateRange.to}`);
  console.log(`\nBy type: ${Object.entries(byType).map(([k, v]) => `${k}(${v})`).join(", ")}`);
  console.log(`By severity: ${Object.entries(bySeverity).map(([k, v]) => `${k}(${v})`).join(", ")}`);
  console.log(`By feature: ${Object.entries(byFeature).map(([k, v]) => `${k}(${v})`).join(", ")}`);
  console.log(`\nAggregates:`);
  console.log(`  Overhead ratio (avg): ${avgOverheadRatio?.toFixed(2) ?? "N/A"}`);
  console.log(`  Rework rate: ${(reworkRate * 100).toFixed(0)}%`);
  console.log(`  First-pass rate: ${(firstPassRate * 100).toFixed(0)}%`);
  console.log(`  Total runs: ${totalRuns}`);
  if (agentCosts.length > 0) {
    console.log(`\nAgent Cost:`);
    console.log(`  Total premium requests: ${totalAgentCost}`);
    console.log(`  Last 7d premium requests: ${totalPremiumRequests}`);
    console.log(`  Agent runs: ${agentCosts.length}`);
    console.log(`  Success rate: ${agentSuccessRate !== null ? (agentSuccessRate * 100).toFixed(0) + "%" : "N/A"}`);
    console.log(`  Total duration: ${Math.round(totalAgentDuration / 60)}m`);
  }
  console.log(`\nThresholds triggered: ${triggeredThresholds.length}`);
  for (const t of triggeredThresholds) {
    console.log(`  [${t.id}] ${t.description}`);
    console.log(`         Evidence: ${t.evidence}`);
  }
  if (triggeredThresholds.length > 0) {
    console.log(`\n→ Agent reflection recommended. Run: domainspec-reflect --from-signals --all`);
  } else {
    console.log(`\n→ No thresholds triggered. Signals accumulating normally.`);
  }
}

process.exit(triggeredThresholds.length > 0 ? 1 : 0);

// --- Helpers ---

function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of arr) {
    const key = keyFn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
}

function uniqueFeatures(signals: SignalEnvelope[]): string[] {
  return [...new Set(signals.map((s) => s.feature))];
}

function uniqueSessions(signals: SignalEnvelope[]): string[] {
  return [...new Set(signals.map((s) => s.session))];
}

function avgIterations(reworkSignals: SignalEnvelope[]): string {
  const iters = reworkSignals.map((s) => (s.data.iterations as number) || 1);
  return (iters.reduce((a, b) => a + b, 0) / iters.length).toFixed(1);
}
