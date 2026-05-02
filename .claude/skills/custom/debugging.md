---
description: Hint on how to debug an error or investigate an issue
---

# Debugging Workflow

If you have been called to investigate a bug, remember that this project has an execution graph tracked by GitNexus and domain rules made explicit in the Vault.

**Navigation Tips:**
- **Understanding the failure**: Instead of searching files blindly, consider searching for the error log or symptom using GitNexus tools (e.g., `query` or `context`). This will reveal the execution flows involved.
- **System laws**: Many failures occur due to boundary violations. Consider taking a quick look at the constitution of the affected layer (`project_constitutions/`) so you don't propose a solution that breaks the architecture (like the event system).
- **Safe action**: You have access to `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` which explains how to safely apply changes after discovering the root cause.