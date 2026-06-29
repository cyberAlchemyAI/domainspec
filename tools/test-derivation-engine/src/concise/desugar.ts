// SWU-A2 (assimilation, build-from-owned): a terse single-file concrete syntax that
// DESUGARS into the canonical `states.md` Markdown the owned grammar already parses
// (grammar/index.ts). This is a *syntax skin* over the owned engine — no parallel IR,
// no new evaluator, no codegen. The desugared output is fed through the existing
// `parse()`, so obligations are identical to hand-written canonical Markdown by
// construction.
//
// Seed scope (intentionally tiny): the **states shape** — Entity + Transition +
// Invariant. The operations/interfaces/events shapes are a marked next step.
//
// Terse grammar (one statement per line; blank lines and `# ...` comments ignored):
//   entity <Name>
//   <From> -<Event>-> <To> [| <guard> [| <effect>]]
//   inv <ID>: <text> [| <formal>]

interface Transition {
  readonly from: string;
  readonly event: string;
  readonly to: string;
  readonly guard: string;
  readonly effect: string;
}

interface Invariant {
  readonly id: string;
  readonly text: string;
  readonly formal: string;
}

interface EntityBlock {
  readonly name: string;
  readonly transitions: Transition[];
  readonly invariants: Invariant[];
}

const ENTITY = /^entity\s+(.+?)\s*$/;
// `<From> -<Event>-> <To>` with an optional `| guard | effect` tail.
const TRANSITION = /^(.+?)\s+-(.+?)->\s+([^|]+?)\s*(?:\|(.*))?$/;
const INVARIANT = /^inv\s+(\S+)\s*:\s*([^|]+?)\s*(?:\|\s*(.*?)\s*)?$/;

/** Parse the terse source into entity blocks. Unrecognized non-blank lines throw. */
function parseConcise(src: string): EntityBlock[] {
  const blocks: EntityBlock[] = [];
  let current: EntityBlock | null = null;

  const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i] ?? "";
    const line = raw.trim();
    if (line === "" || line.startsWith("#")) continue;

    const ent = ENTITY.exec(line);
    if (ent) {
      current = { name: ent[1]!, transitions: [], invariants: [] };
      blocks.push(current);
      continue;
    }

    if (!current) {
      throw new Error(
        `concise: line ${i + 1}: statement before any \`entity\`: "${line}"`,
      );
    }

    const inv = INVARIANT.exec(line);
    if (inv) {
      current.invariants.push({
        id: inv[1]!,
        text: inv[2]!.trim(),
        formal: (inv[3] ?? "").trim(),
      });
      continue;
    }

    const tr = TRANSITION.exec(line);
    if (tr) {
      const tail = (tr[4] ?? "").split("|").map((s) => s.trim());
      current.transitions.push({
        from: tr[1]!.trim(),
        event: tr[2]!.trim(),
        to: tr[3]!.trim(),
        guard: tail[0] ?? "",
        effect: tail[1] ?? "",
      });
      continue;
    }

    throw new Error(
      `concise: line ${i + 1}: unrecognized statement: "${line}"`,
    );
  }
  return blocks;
}

const row = (cells: readonly string[]): string => `| ${cells.join(" | ")} |`;

/** Render one entity block as canonical `states.md` Markdown. */
function renderEntity(e: EntityBlock): string {
  const out: string[] = [`## ${e.name}`, ""];

  if (e.transitions.length > 0) {
    out.push("### Transition Table", "");
    out.push(row(["From", "Event", "To", "Guard", "Effect"]));
    out.push(row(["---", "---", "---", "---", "---"]));
    for (const t of e.transitions) {
      out.push(row([t.from, t.event, t.to, t.guard, t.effect]));
    }
    out.push("");
  }

  if (e.invariants.length > 0) {
    out.push("### Invariants", "");
    out.push(row(["ID", "Invariant", "Formal"]));
    out.push(row(["---", "---", "---"]));
    for (const inv of e.invariants) {
      out.push(row([inv.id, inv.text, inv.formal]));
    }
    out.push("");
  }

  return out.join("\n");
}

/** Desugar terse concrete syntax into canonical `states.md` Markdown. */
export function desugarConcise(src: string): string {
  const blocks = parseConcise(src);
  return blocks.map(renderEntity).join("\n").trimEnd() + "\n";
}
