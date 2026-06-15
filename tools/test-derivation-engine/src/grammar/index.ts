// Stage A — Parser: canonical Markdown tables -> typed ConceptGraph G.
// SWU-ENG-001. Strict grammar over the REAL poker-team aspect docs.
//
// Doc shapes actually parsed (financial-settlement):
//   states.md:      "## <Entity>" + "### Transition Table" (| From | Event | To | Guard | Effect |)
//                   + "### Invariants" (| ID | Invariant | Formal |)
//   operations.md:  "## <Operation>" + "### Rules" (| ID | Rule | Formal |)
//                   + "### Calculations" (| ID | Calculation | Formula |)
//                   + "### Postconditions" (| ID | Class | Guarantee | Formal Assertion | Traceability |)
//   interfaces.md:  "### <METHOD /path>" + "**Responses:**" (| Status | Condition | Body |)
//   events.md:      "## <Event>" + "### Consumed by" (| Consumer | Action |)
//
// Non-canonical tables (missing/renamed required columns) -> a clear violation,
// never guessed. Prose `Formal`/`Formula` cells the formal sub-grammar cannot
// classify are kept verbatim and flagged needs_formal downstream by the deriver;
// the parser stores them but does not interpret them.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ConceptGraph, Edge, Node, Value } from "../ir/types.js";

export interface ParseResult {
  readonly graph: ConceptGraph;
  /** Non-canonical structures rejected with file:line (never guessed). */
  readonly violations: readonly string[];
}

// --- Markdown table primitives -------------------------------------------------

interface TableRow {
  readonly cells: readonly string[];
  /** 0-based index of the data row within its table (header/separator excluded). */
  readonly rowIndex: number;
}

interface ParsedTable {
  readonly header: readonly string[];
  readonly rows: readonly TableRow[];
}

function stripPipes(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

function isTableLine(line: string): boolean {
  return line.trim().startsWith("|");
}

function isSeparatorLine(line: string): boolean {
  const cells = stripPipes(line);
  return (
    cells.length > 0 &&
    cells.every((c) => /^:?-{1,}:?$/.test(c.replace(/\s/g, "")))
  );
}

/** Read a contiguous markdown table starting at lines[start] (must be a table line). */
function readTable(
  lines: string[],
  start: number,
): { table: ParsedTable; next: number } {
  const header = stripPipes(lines[start] ?? "");
  let i = start + 1;
  // optional separator
  const sep = lines[i];
  if (
    i < lines.length &&
    sep !== undefined &&
    isTableLine(sep) &&
    isSeparatorLine(sep)
  )
    i += 1;
  const rows: TableRow[] = [];
  let rowIndex = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (ln === undefined || !isTableLine(ln)) break;
    if (isSeparatorLine(ln)) {
      i += 1;
      continue;
    }
    rows.push({ cells: stripPipes(ln), rowIndex });
    rowIndex += 1;
    i += 1;
  }
  return { table: { header, rows }, next: i };
}

/** Strip a leading "`...`" code span and trim, e.g. "`x >= 0`" -> "x >= 0". */
function unfence(cell: string): string {
  const m = cell.match(/^`(.*)`$/s);
  return (m?.[1] ?? cell).trim();
}

/** Normalize a heading title (drop links, markdown emphasis, trailing colons). */
function cleanHeading(raw: string | undefined): string {
  return (raw ?? "").replace(/\*\*/g, "").replace(/\s+$/g, "").trim();
}

/** Column-name match tolerant to case/whitespace; order is matched by position-after-alias. */
function headerHas(
  header: readonly string[],
  required: readonly string[],
): boolean {
  if (header.length < required.length) return false;
  const norm = header.map((h) => h.toLowerCase().trim());
  return required.every((r) => norm.includes(r.toLowerCase()));
}

function colIndex(header: readonly string[], name: string): number {
  return header.findIndex((h) => h.toLowerCase().trim() === name.toLowerCase());
}

// --- Per-aspect parsers --------------------------------------------------------

interface ParseContext {
  readonly file: string;
  readonly nodes: Node[];
  readonly edges: Edge[];
  readonly violations: string[];
}

function fieldsRecord(
  rec: Record<string, Value>,
): Readonly<Record<string, Value>> {
  return rec;
}

function readDoc(featureDir: string, file: string): string[] | null {
  try {
    return readFileSync(join(featureDir, file), "utf8").split(/\r?\n/);
  } catch {
    return null;
  }
}

/** states.md -> Entity / Transition / Invariant nodes (+ from/to/on edges). */
function parseStates(ctx: ParseContext, lines: string[]): void {
  let currentEntity: string | null = null;
  let section: "transitions" | "invariants" | null = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === undefined) continue;
    const h2 = line.match(/^##\s+(?!#)(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      currentEntity = cleanHeading(h2[1]);
      const anchor = `${ctx.file}#${currentEntity}`;
      ctx.nodes.push({
        id: anchor,
        type: "Entity",
        source_anchor: anchor,
        fields: fieldsRecord({ name: currentEntity }),
      });
      section = null;
      continue;
    }
    if (h3) {
      const title = cleanHeading(h3[1]).toLowerCase();
      section = title.startsWith("transition")
        ? "transitions"
        : title.startsWith("invariant")
          ? "invariants"
          : null;
      continue;
    }
    if (!currentEntity || !section || !isTableLine(line)) continue;

    const { table, next } = readTable(lines, i);
    i = next - 1;

    if (section === "transitions") {
      const required = ["From", "Event", "To"];
      if (!headerHas(table.header, required)) {
        ctx.violations.push(
          `${ctx.file}:${i + 1}: non-canonical Transition Table for ${currentEntity}; ` +
            `expected columns including From|Event|To, got [${table.header.join(", ")}]`,
        );
        continue;
      }
      const ci = {
        from: colIndex(table.header, "From"),
        event: colIndex(table.header, "Event"),
        to: colIndex(table.header, "To"),
        guard: colIndex(table.header, "Guard"),
        effect: colIndex(table.header, "Effect"),
      };
      for (const row of table.rows) {
        const anchor = `${ctx.file}#${currentEntity}:transition:${row.rowIndex}`;
        const from = row.cells[ci.from] ?? "";
        const event = row.cells[ci.event] ?? "";
        const to = row.cells[ci.to] ?? "";
        ctx.nodes.push({
          id: anchor,
          type: "Transition",
          source_anchor: anchor,
          fields: fieldsRecord({
            entity: currentEntity,
            from,
            event,
            to,
            guard: ci.guard >= 0 ? (row.cells[ci.guard] ?? "") : "",
            effect: ci.effect >= 0 ? (row.cells[ci.effect] ?? "") : "",
          }),
        });
      }
    } else {
      const required = ["ID", "Invariant", "Formal"];
      if (!headerHas(table.header, required)) {
        ctx.violations.push(
          `${ctx.file}:${i + 1}: non-canonical Invariants table for ${currentEntity}; ` +
            `expected ID|Invariant|Formal, got [${table.header.join(", ")}]`,
        );
        continue;
      }
      const ci = {
        id: colIndex(table.header, "ID"),
        text: colIndex(table.header, "Invariant"),
        formal: colIndex(table.header, "Formal"),
      };
      for (const row of table.rows) {
        const id = row.cells[ci.id] ?? "";
        const anchor = `${ctx.file}#${currentEntity}:invariant:${row.rowIndex}`;
        ctx.nodes.push({
          id: anchor,
          type: "Invariant",
          source_anchor: anchor,
          fields: fieldsRecord({
            entity: currentEntity,
            id,
            text: row.cells[ci.text] ?? "",
            formal: unfence(row.cells[ci.formal] ?? ""),
          }),
        });
      }
    }
  }
}

/** operations.md -> Operation / Rule / Calculation / Postcondition nodes. */
function parseOperations(ctx: ParseContext, lines: string[]): void {
  let currentOp: string | null = null;
  let section: "rules" | "calculations" | "postconditions" | null = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === undefined) continue;
    const h2 = line.match(/^##\s+(?!#)(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      const title = cleanHeading(h2[1]);
      // Skip non-operation prose sections (e.g. "Domain Policy Ownership").
      if (/policy ownership/i.test(title)) {
        currentOp = null;
        section = null;
        continue;
      }
      currentOp = title;
      const anchor = `${ctx.file}#${currentOp}`;
      ctx.nodes.push({
        id: anchor,
        type: "Operation",
        source_anchor: anchor,
        fields: fieldsRecord({ name: currentOp }),
      });
      section = null;
      continue;
    }
    if (h3) {
      const title = cleanHeading(h3[1]).toLowerCase();
      section = title.startsWith("rule")
        ? "rules"
        : title.startsWith("calculation")
          ? "calculations"
          : title.startsWith("postcondition")
            ? "postconditions"
            : null;
      continue;
    }
    if (!currentOp || !section || !isTableLine(line)) continue;

    const { table, next } = readTable(lines, i);
    i = next - 1;

    if (section === "rules") {
      if (!headerHas(table.header, ["ID", "Rule", "Formal"])) {
        ctx.violations.push(
          `${ctx.file}:${i + 1}: non-canonical Rules table for ${currentOp}; expected ID|Rule|Formal`,
        );
        continue;
      }
      const ci = {
        id: colIndex(table.header, "ID"),
        text: colIndex(table.header, "Rule"),
        formal: colIndex(table.header, "Formal"),
      };
      for (const row of table.rows) {
        const id = row.cells[ci.id] ?? "";
        const anchor = `${ctx.file}#${currentOp}:rule:${row.rowIndex}`;
        ctx.nodes.push({
          id: anchor,
          type: "Rule",
          source_anchor: anchor,
          fields: fieldsRecord({
            op: currentOp,
            id,
            text: row.cells[ci.text] ?? "",
            formal: unfence(row.cells[ci.formal] ?? ""),
          }),
        });
      }
    } else if (section === "calculations") {
      if (!headerHas(table.header, ["ID", "Calculation", "Formula"])) {
        ctx.violations.push(
          `${ctx.file}:${i + 1}: non-canonical Calculations table for ${currentOp}; expected ID|Calculation|Formula`,
        );
        continue;
      }
      const ci = {
        id: colIndex(table.header, "ID"),
        text: colIndex(table.header, "Calculation"),
        formula: colIndex(table.header, "Formula"),
      };
      for (const row of table.rows) {
        const id = row.cells[ci.id] ?? "";
        const anchor = `${ctx.file}#${currentOp}:calculation:${row.rowIndex}`;
        ctx.nodes.push({
          id: anchor,
          type: "Calculation",
          source_anchor: anchor,
          fields: fieldsRecord({
            op: currentOp,
            id,
            text: row.cells[ci.text] ?? "",
            formula: unfence(row.cells[ci.formula] ?? ""),
          }),
        });
      }
    } else {
      // postconditions
      if (!headerHas(table.header, ["ID", "Class", "Guarantee"])) {
        ctx.violations.push(
          `${ctx.file}:${i + 1}: non-canonical Postconditions table for ${currentOp}; expected ID|Class|Guarantee|...`,
        );
        continue;
      }
      const ci = {
        id: colIndex(table.header, "ID"),
        cls: colIndex(table.header, "Class"),
        guarantee: colIndex(table.header, "Guarantee"),
        formal: colIndex(table.header, "Formal Assertion"),
      };
      for (const row of table.rows) {
        const id = row.cells[ci.id] ?? "";
        const anchor = `${ctx.file}#${currentOp}:postcondition:${row.rowIndex}`;
        ctx.nodes.push({
          id: anchor,
          type: "Postcondition",
          source_anchor: anchor,
          fields: fieldsRecord({
            op: currentOp,
            id,
            class: row.cells[ci.cls] ?? "",
            guarantee: row.cells[ci.guarantee] ?? "",
            formal: ci.formal >= 0 ? unfence(row.cells[ci.formal] ?? "") : "",
          }),
        });
      }
    }
  }
}

/** interfaces.md -> Endpoint / Response nodes. */
function parseInterfaces(ctx: ParseContext, lines: string[]): void {
  let currentEndpoint: string | null = null;
  let inResponses = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === undefined) continue;
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      const title = cleanHeading(h3[1]);
      // Endpoint headings look like "POST /settlements" or "GET /settlements/preview".
      if (/^[A-Z]+\s+\//.test(title)) {
        currentEndpoint = title;
        const anchor = `${ctx.file}#${currentEndpoint}`;
        ctx.nodes.push({
          id: anchor,
          type: "Endpoint",
          source_anchor: anchor,
          fields: fieldsRecord({ name: currentEndpoint }),
        });
      } else {
        currentEndpoint = null;
      }
      inResponses = false;
      continue;
    }
    if (/^\*\*Responses:?\*\*/.test(line.trim())) {
      inResponses = true;
      continue;
    }
    // A new bold label other than Responses ends the responses block.
    if (
      /^\*\*[A-Za-z]/.test(line.trim()) &&
      !/^\*\*Responses/.test(line.trim())
    ) {
      inResponses = false;
    }
    if (!currentEndpoint || !inResponses || !isTableLine(line)) continue;

    const { table, next } = readTable(lines, i);
    i = next - 1;
    if (!headerHas(table.header, ["Status", "Condition", "Body"])) {
      ctx.violations.push(
        `${ctx.file}:${i + 1}: non-canonical Responses table for ${currentEndpoint}; expected Status|Condition|Body`,
      );
      inResponses = false;
      continue;
    }
    const ci = {
      status: colIndex(table.header, "Status"),
      condition: colIndex(table.header, "Condition"),
      body: colIndex(table.header, "Body"),
    };
    for (const row of table.rows) {
      const status = row.cells[ci.status] ?? "";
      const anchor = `${ctx.file}#${currentEndpoint}:response:${row.rowIndex}`;
      ctx.nodes.push({
        id: anchor,
        type: "Response",
        source_anchor: anchor,
        fields: fieldsRecord({
          endpoint: currentEndpoint,
          status,
          condition: row.cells[ci.condition] ?? "",
          body: row.cells[ci.body] ?? "",
        }),
      });
    }
    inResponses = false;
  }
}

/** events.md -> Event / Consumer nodes (+ consumes edges). */
function parseEvents(ctx: ParseContext, lines: string[]): void {
  let currentEvent: string | null = null;
  let inConsumers = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === undefined) continue;
    const h2 = line.match(/^##\s+(?!#)(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      currentEvent = cleanHeading(h2[1]);
      const anchor = `${ctx.file}#${currentEvent}`;
      ctx.nodes.push({
        id: anchor,
        type: "Event",
        source_anchor: anchor,
        fields: fieldsRecord({ name: currentEvent }),
      });
      inConsumers = false;
      continue;
    }
    if (h3) {
      inConsumers = cleanHeading(h3[1]).toLowerCase().startsWith("consumed by");
      continue;
    }
    if (!currentEvent || !inConsumers || !isTableLine(line)) continue;

    const { table, next } = readTable(lines, i);
    i = next - 1;
    if (!headerHas(table.header, ["Consumer", "Action"])) {
      ctx.violations.push(
        `${ctx.file}:${i + 1}: non-canonical Consumed by table for ${currentEvent}; expected Consumer|Action`,
      );
      inConsumers = false;
      continue;
    }
    const ci = {
      consumer: colIndex(table.header, "Consumer"),
      action: colIndex(table.header, "Action"),
    };
    for (const row of table.rows) {
      const consumer = row.cells[ci.consumer] ?? "";
      const anchor = `${ctx.file}#${currentEvent}:consumer:${row.rowIndex}`;
      ctx.nodes.push({
        id: anchor,
        type: "Consumer",
        source_anchor: anchor,
        fields: fieldsRecord({
          event: currentEvent,
          consumer,
          action: row.cells[ci.action] ?? "",
        }),
      });
      ctx.edges.push({
        from: anchor,
        to: `${ctx.file}#${currentEvent}`,
        type: "consumes",
      });
    }
    inConsumers = false;
  }
}

/**
 * workflows.md -> Workflow / WorkflowStep nodes.
 * A workflow is a `## <Name>` whose `**Type:**` line says "Workflow". Its steps come
 * from the `### Step Table` (| # | Step | Actor | Operation | On Success | On Failure | ... |).
 * One WorkflowStep node per step row; each carries its documented On Failure cell so the
 * deriver can encode the exact failure branch when present (else it is empty).
 */
function parseWorkflows(ctx: ParseContext, lines: string[]): void {
  let currentWorkflow: string | null = null;
  let isWorkflowType = false;
  let section: "steps" | null = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === undefined) continue;
    const h2 = line.match(/^##\s+(?!#)(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      currentWorkflow = cleanHeading(h2[1]);
      isWorkflowType = false; // confirmed when we see a **Type:** Workflow line
      section = null;
      continue;
    }
    // Confirm the section is a Workflow (not a Policy / Decision Table block).
    const typeMatch = line.match(/^\*\*Type:\*\*\s*(.+)$/);
    if (typeMatch && currentWorkflow) {
      const ty = cleanHeading(typeMatch[1]).toLowerCase();
      isWorkflowType = ty.startsWith("workflow");
      if (isWorkflowType) {
        const anchor = `${ctx.file}#${currentWorkflow}`;
        ctx.nodes.push({
          id: anchor,
          type: "Workflow",
          source_anchor: anchor,
          fields: fieldsRecord({ name: currentWorkflow }),
        });
      }
      continue;
    }
    if (h3) {
      section = cleanHeading(h3[1]).toLowerCase().startsWith("step table")
        ? "steps"
        : null;
      continue;
    }
    if (
      !currentWorkflow ||
      !isWorkflowType ||
      section !== "steps" ||
      !isTableLine(line)
    )
      continue;

    const { table, next } = readTable(lines, i);
    i = next - 1;
    if (!headerHas(table.header, ["Step"])) {
      ctx.violations.push(
        `${ctx.file}:${i + 1}: non-canonical Step Table for ${currentWorkflow}; expected a Step column`,
      );
      continue;
    }
    const ci = {
      num: colIndex(table.header, "#"),
      step: colIndex(table.header, "Step"),
      actor: colIndex(table.header, "Actor"),
      operation: colIndex(table.header, "Operation"),
      onSuccess: colIndex(table.header, "On Success"),
      onFailure: colIndex(table.header, "On Failure"),
    };
    for (const row of table.rows) {
      const anchor = `${ctx.file}#${currentWorkflow}:step:${row.rowIndex}`;
      ctx.nodes.push({
        id: anchor,
        type: "WorkflowStep",
        source_anchor: anchor,
        fields: fieldsRecord({
          workflow: currentWorkflow,
          num:
            ci.num >= 0 ? (row.cells[ci.num] ?? "") : String(row.rowIndex + 1),
          step: row.cells[ci.step] ?? "",
          actor: ci.actor >= 0 ? (row.cells[ci.actor] ?? "") : "",
          operation: ci.operation >= 0 ? (row.cells[ci.operation] ?? "") : "",
          on_success: ci.onSuccess >= 0 ? (row.cells[ci.onSuccess] ?? "") : "",
          on_failure: ci.onFailure >= 0 ? (row.cells[ci.onFailure] ?? "") : "",
        }),
      });
    }
  }
}

/**
 * queries.md -> Query nodes. A query is a `## <Name>` whose `**Type:**` says "Query".
 * One Query node per query (read behavior is one obligation per query at the semantic
 * level — the prose per-assertion expansions in the committed spec are not encoded in a
 * source table and so are not invented here).
 */
function parseQueries(ctx: ParseContext, lines: string[]): void {
  let currentQuery: string | null = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === undefined) continue;
    const h2 = line.match(/^##\s+(?!#)(.+)$/);
    if (h2) {
      currentQuery = cleanHeading(h2[1]);
      continue;
    }
    const typeMatch = line.match(/^\*\*Type:\*\*\s*(.+)$/);
    if (typeMatch && currentQuery) {
      const ty = cleanHeading(typeMatch[1]).toLowerCase();
      if (ty.startsWith("query")) {
        const anchor = `${ctx.file}#${currentQuery}`;
        ctx.nodes.push({
          id: anchor,
          type: "Query",
          source_anchor: anchor,
          fields: fieldsRecord({ name: currentQuery }),
        });
      }
    }
  }
}

/**
 * mappings.md -> Mapping nodes. A mapping is a `## <Name>` with `**From:**`/`**To:**`
 * direction metadata. One Mapping node per mapping section.
 */
function parseMappings(ctx: ParseContext, lines: string[]): void {
  let currentMapping: string | null = null;
  let from = "";
  let to = "";
  let direction = "";
  let emitted = false;

  const flush = (): void => {
    if (currentMapping && !emitted && (from !== "" || to !== "")) {
      const anchor = `${ctx.file}#${currentMapping}`;
      ctx.nodes.push({
        id: anchor,
        type: "Mapping",
        source_anchor: anchor,
        fields: fieldsRecord({ name: currentMapping, from, to, direction }),
      });
      emitted = true;
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === undefined) continue;
    const h2 = line.match(/^##\s+(?!#)(.+)$/);
    if (h2) {
      flush();
      currentMapping = cleanHeading(h2[1]);
      from = "";
      to = "";
      direction = "";
      emitted = false;
      continue;
    }
    if (!currentMapping) continue;
    const f = line.match(/^\*\*From:\*\*\s*(.+)$/);
    const t = line.match(/^\*\*To:\*\*\s*(.+)$/);
    const d = line.match(/^\*\*Direction:\*\*\s*(.+)$/);
    if (f) from = cleanHeading(f[1]);
    if (t) to = cleanHeading(t[1]);
    if (d) direction = cleanHeading(d[1]);
  }
  flush();
}

// --- Public parse --------------------------------------------------------------

/**
 * Parse a feature's four aspect docs (states/operations/interfaces/events) into G.
 * Nodes are sorted by source_anchor for deterministic serialization.
 */
export function parse(featureDir: string): ParseResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const violations: string[] = [];

  const aspects: Array<{
    file: string;
    fn: (c: ParseContext, l: string[]) => void;
  }> = [
    { file: "states.md", fn: parseStates },
    { file: "operations.md", fn: parseOperations },
    { file: "interfaces.md", fn: parseInterfaces },
    { file: "events.md", fn: parseEvents },
    { file: "workflows.md", fn: parseWorkflows },
    { file: "queries.md", fn: parseQueries },
    { file: "mappings.md", fn: parseMappings },
  ];

  for (const { file, fn } of aspects) {
    const lines = readDoc(featureDir, file);
    if (lines === null) {
      // An absent aspect doc is not a non-canonical violation — it is simply a
      // feature that does not author that aspect. The deriver derives over whatever
      // nodes exist; coverage gaps surface in the round-trip, not as parser errors.
      continue;
    }
    const ctx: ParseContext = { file, nodes, edges, violations };
    fn(ctx, lines);
  }

  nodes.sort((a, b) =>
    a.source_anchor < b.source_anchor
      ? -1
      : a.source_anchor > b.source_anchor
        ? 1
        : 0,
  );
  edges.sort((a, b) => {
    const ka = `${a.from}|${a.type}|${a.to}`;
    const kb = `${b.from}|${b.type}|${b.to}`;
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });

  return { graph: { nodes, edges }, violations };
}
