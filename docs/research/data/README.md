# Experiment Data

This directory stores raw experiment data as JSONL files.

## Naming Convention

- `E1-run-YYYY-MM-DD.jsonl` — raw data for experiment E1
- `E7-session-log.jsonl` — longitudinal session data for E7

## Rules

1. Never edit a raw data file after collection.
2. Every row must include the metadata block defined in EXPERIMENTS.md.
3. Store derived/aggregated data in `results/`, not here.
