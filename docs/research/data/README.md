---
tags: [research, experiments, data, jsonl]
node_type: readme
is_session: false
layer: application
nature: reference
status: active
version: 0.1.0
last_updated: 2026-05-16
---

# Experiment Data

## What is this?

Raw experiment data captured as JSONL files, one row per observation, named by experiment id and run date. This directory is the immutable source-of-truth for downstream analysis.

## Business Context

DomainSpec research generates experimental runs (E1, E6, E7, E9, …) that emit structured observations. Each run is a self-contained file whose metadata block is defined in `EXPERIMENTS.md`. Derived and aggregated outputs live elsewhere (`results/`) so that re-analysis can always be traced back to an untouched raw artifact.

## Why it matters

Raw experiment data must be append-only and never edited after collection — otherwise reproducibility collapses and historical comparisons become unsafe. Centralizing the JSONL captures here lets analysis pipelines, audits, and future re-runs all consume the same canonical surface.

## 📁 Navigation

- **[E6-run-2026-04-20.jsonl](E6-run-2026-04-20.jsonl)**: Raw observations for experiment E6, run on 2026-04-20.
- **[E9-run-2026-04-20.jsonl](E9-run-2026-04-20.jsonl)**: Raw observations for experiment E9, first run on 2026-04-20.
- **[E9-run2-2026-04-20.jsonl](E9-run2-2026-04-20.jsonl)**: Second run of E9 on 2026-04-20.
- **[E9-run2-rerun-2026-04-20.jsonl](E9-run2-rerun-2026-04-20.jsonl)**: Rerun of the second E9 run for validation.

## Naming Convention

- `E1-run-YYYY-MM-DD.jsonl` — raw data for experiment E1
- `E7-session-log.jsonl` — longitudinal session data for E7

## Rules

1. Never edit a raw data file after collection.
2. Every row must include the metadata block defined in EXPERIMENTS.md.
3. Store derived/aggregated data in `results/`, not here.
