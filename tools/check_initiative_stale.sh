#!/usr/bin/env bash
set -euo pipefail

REGISTRY_FILE="${1:-plan/context/CTX-03-initiative-registry-cycle-001.md}"
TODAY="${2:-$(date +%F)}"

if [[ ! -f "$REGISTRY_FILE" ]]; then
  echo "error: registry file not found: $REGISTRY_FILE" >&2
  exit 1
fi

today_epoch="$(date -d "$TODAY" +%s)"

total=0
stale_count=0

echo "# CTX-03 Stale Initiative Report"
echo
echo "- Registry file: $REGISTRY_FILE"
echo "- Evaluation date: $TODAY"
echo
echo "| Initiative ID | Owner Role | Status | Last Evidence Update | Review SLA Days | Days Since Update | Stale | Reason |"
echo "| --- | --- | --- | --- | --- | --- | --- | --- |"

while IFS='|' read -r _ initiative owner status last_update review_sla _rest; do
  initiative="$(echo "$initiative" | xargs)"
  owner="$(echo "$owner" | xargs)"
  status="$(echo "$status" | xargs)"
  last_update="$(echo "$last_update" | xargs)"
  review_sla="$(echo "$review_sla" | xargs)"

  [[ "$initiative" =~ ^I- ]] || continue
  [[ "$review_sla" =~ ^[0-9]+$ ]] || continue

  total=$((total + 1))

  stale="no"
  reason="within-review-sla"
  days_since="0"

  if [[ "$status" == "done" || "$status" == "archived" ]]; then
    stale="no"
    reason="terminal-status"
    days_since="0"
  else
    if ! update_epoch="$(date -d "$last_update" +%s 2>/dev/null)"; then
      stale="yes"
      reason="invalid-last-update-date"
      days_since="NA"
      stale_count=$((stale_count + 1))
    else
      days_since=$(( (today_epoch - update_epoch) / 86400 ))
      if (( days_since > review_sla )); then
        stale="yes"
        reason="exceeds-review-sla"
        stale_count=$((stale_count + 1))
      fi
    fi
  fi

  echo "| $initiative | $owner | $status | $last_update | $review_sla | $days_since | $stale | $reason |"
done < "$REGISTRY_FILE"

echo
echo "- Total initiatives scanned: $total"
echo "- Stale initiatives: $stale_count"

if (( stale_count > 0 )); then
  exit 2
fi
