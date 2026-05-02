---
description: How to write and maintain a README inside /specs/ directories
---

# README Pattern Workflow

When you are navigating, creating, or updating a folder anywhere inside `/specs/`, you must ensure a `README.md` exists at its root and strictly follows this pattern.

**Rule of Thumb:** A `README.md` file is exclusively for navigation, context, and helping humans/agents orient themselves. It must **never** contain actionable ideas, technical debt, unstructured feature requests, or backlog items.

## Required Structure

Every `README.md` inside a specification folder must contain these exact sections:

### 1. What is this?
A clear, concise description (1-3 sentences) of what this specific folder and its specifications encompass.

### 2. Business Context
Explain the operational, domain, or business context surrounding these specifications. What user journey, external system, or company process does this refer to?

### 3. Why it matters
The justification and impact of the specifications within this folder. What value does this system unlock, or what business/technical risk does it mitigate?

### 4. 📁 Navigation
A physical map of the directory. Every file and subfolder must be listed here with a short explanation of its purpose.

```markdown
- **[file-name.md](file-name.md)**: Description of the file.
- **`subfolder/`**: Description of what is inside the subfolder.
```

---

## Agent Directives
- **Read First:** Before exploring or editing files inside a `/specs/` folder, you **MUST** read its `README.md` to ground yourself in the business context and folder layout.
- **Update Always:** If you create a new file or subfolder within this directory, you **MUST** manually update the Navigation section of the `README.md` to reflect the new structure.
