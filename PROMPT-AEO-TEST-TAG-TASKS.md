# Prompt: AEO Test + Tag Tasks

Use this single prompt:

```text
@domainspec-orchestrator domainspec-orchestrate "for feature agent-execution-orchestrator, execute test/verification task TASK-AEO-WP-VERIFY first, then execute tagging task TASK-AEO-WP-TAG-CODE; publish evidence artifacts and return a final PASS/FLAG/BLOCK summary. If TASK-AEO-WP-TAG-CODE is still deferred-until-mutation, keep it deferred and report the exact mutation preconditions required to activate it."
```

Task references:

- docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-WP-VERIFY.md
- docs/features/agent-execution-orchestrator/work-pack/tasks/TASK-AEO-WP-TAG-CODE.md
