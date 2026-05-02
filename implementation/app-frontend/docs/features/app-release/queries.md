# Queries: App Release

## Phase 1 Status

| Query | Phase 1 |
| ----- | ------- |
| [GetWorkspaceOverview](#getworkspaceoverview) | in scope (narrowed to graph index + 4 metric counters; serves `GET /api/graph/index`) |
| [InspectGraphNode](#inspectgraphnode) | in scope |
| [ListPastSessions](#listpastsessions) | **new in Phase 1** (powers the "Sessões anteriores" picker) |
| [GetSessionSummary](#getsessionsummary) | **new in Phase 1** (powers the resume flow; returns summary section only, never the transcript) |
| [ListGovernanceQueue](#listgovernancequeue) | deferred |

## GetWorkspaceOverview

**Type:** Query (read-only)
**Actor:** Harness release operator

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| workspaceId | string | yes | Target [ReleaseWorkspace](domain.md#releaseworkspace) |

### Filters

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| includeMetrics | boolean | true | Include release metrics and confidence signals |
| includePrototype | boolean | true | Include current prototype selection |

### Output

| Field | Type | Source | Description |
| ----- | ---- | ------ | ----------- |
| workspaceId | string | [ReleaseWorkspace](domain.md#releaseworkspace).workspaceId | Workspace identifier |
| status | string | [ReleaseWorkspace](domain.md#releaseworkspace).status | Current lifecycle status |
| nodeCount | integer | [DomainMap](domain.md#domainmap).nodeCount | Visible graph node count |
| edgeCount | integer | [DomainMap](domain.md#domainmap).edgeCount | Visible graph edge count |
| unresolvedAmbiguityCount | integer | [DomainMap](domain.md#domainmap).unresolvedAmbiguityCount | Remaining discovery ambiguity count |
| selectedPrototypeVariantId | string | [ReleaseWorkspace](domain.md#releaseworkspace).selectedPrototypeVariantId | Active prototype choice |
| activePlaybackSessionId | string | [ReleaseWorkspace](domain.md#releaseworkspace).activePlaybackSessionId | Active playback session if any |

### Reads From

| Entity | Relationship | Fields Used |
| ------ | ------------ | ----------- |
| [ReleaseWorkspace](domain.md#releaseworkspace) | queries | workspaceId, status, selectedPrototypeVariantId, activePlaybackSessionId |
| [DomainMap](domain.md#domainmap) | queries | nodeCount, edgeCount, unresolvedAmbiguityCount |

## InspectGraphNode

**Type:** Query (read-only)
**Actor:** Harness release operator

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| workspaceId | string | yes | Target [ReleaseWorkspace](domain.md#releaseworkspace) |
| nodeId | string | yes | Graph node being inspected |

### Filters

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| includeWorkflowLineage | boolean | true | Include related workflow path |
| includeGovernanceLinks | boolean | true | Include linked decisions or tradeoffs |

### Output

| Field | Type | Source | Description |
| ----- | ---- | ------ | ----------- |
| nodeId | string | request.nodeId | Requested node identifier in the active graph |
| relatedEdgeCount | integer | [DomainMap](domain.md#domainmap).edgeCount | Number of visible related edges |
| evidenceTurnCount | integer | [DomainMap](domain.md#domainmap).evidenceTurnCount | Evidence breadth for the node |

### Reads From

| Entity | Relationship | Fields Used |
| ------ | ------------ | ----------- |
| [DomainMap](domain.md#domainmap) | queries | edgeCount, evidenceTurnCount |

## ListGovernanceQueue

**Type:** Query (read-only)
**Actor:** Harness release operator

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| workspaceId | string | yes | Target [ReleaseWorkspace](domain.md#releaseworkspace) |

### Filters

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| ownerRole | string | all | Restrict to a role-specific lens |
| status | string | open | Return actionable items by default |

### Output

| Field | Type | Source | Description |
| ----- | ---- | ------ | ----------- |
| queueItemId | string | [GovernanceQueueItem](domain.md#governancequeueitem).queueItemId | Queue item identifier |
| title | string | [GovernanceQueueItem](domain.md#governancequeueitem).title | Action summary |
| rationale | string | [GovernanceQueueItem](domain.md#governancequeueitem).rationale | Why this item ranks where it does |
| priorityScore | decimal | [GovernanceQueueItem](domain.md#governancequeueitem).priorityScore | Ordered urgency |
| ownerRole | string | [GovernanceQueueItem](domain.md#governancequeueitem).ownerRole | Intended owner |

### Reads From

| Entity | Relationship | Fields Used |
| ------ | ------------ | ----------- |
| [GovernanceQueueItem](domain.md#governancequeueitem) | queries | queueItemId, title, rationale, priorityScore, ownerRole, status |

## ListPastSessions

**Type:** Query (read-only)
**Actor:** Harness release operator (via "Sessões anteriores" picker)

### Input

(none)

### Filters

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| limit | integer | 50 | Cap result count |
| since | datetime | null | Only sessions ended at or after this timestamp |

### Output

| Field | Type | Source | Description |
| ----- | ---- | ------ | ----------- |
| sessionId | string | filename slug + timestamp | Stable session identifier |
| title | string | session document `objective` line | Display title |
| status | string | `"ended"` (always — `active` sessions live in memory only) | Lifecycle status |
| endedAt | datetime | filename timestamp or document last-section timestamp | When the session ended |
| summaryExcerpt | string | first ~200 chars of the document's `## Summary` section | Preview text for the picker |

### Reads From

| Source | Relationship | Fields Used |
| ------ | ------------ | ----------- |
| `domain_knowledge/sessions/*.md` | filesystem | filename, frontmatter, `## Summary` section |

### Output Ordering

By `endedAt` descending (most recent first).

## GetSessionSummary

**Type:** Query (read-only)
**Actor:** Server-side resume handler (via [ResumeSession](operations.md#resumesession))

### Input

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| sessionId | string | yes | Target session identifier |

### Output

| Field | Type | Source | Description |
| ----- | ---- | ------ | ----------- |
| sessionId | string | request.sessionId | Echoed identifier |
| title | string | document objective line | — |
| summary | string | `## Summary` section body | The seeded context for resume |
| decisions | array | `## Decisions` section rows | Optional |
| filesTouched | array | `## Files touched` section rows | Optional |
| nextSessionPrompt | string | `## Next-session prompt` section | Seeded into the new SDK conversation alongside `summary` |

### Reads From

| Source | Relationship | Fields Used |
| ------ | ------------ | ----------- |
| `domain_knowledge/sessions/<sessionId>.md` | filesystem | named sections only |

**Important:** the document's full transcript section (if present) is NOT included in the output. Resume seeds the model with `summary` + `nextSessionPrompt` only, per [ResumeSession](operations.md#resumesession) Rule R2.
