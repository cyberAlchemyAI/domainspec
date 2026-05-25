#!/usr/bin/env python3
"""
DomainSpec L1 spec-richness audit.

Runs six structural checks against an L1 spec directory to estimate whether
LLM compilation to L2 (code, tests, metrics) will incur residue:

  Check 1 — Object injectivity (no concept collapses)
  Check 2 — Faithfulness on edges (every typed edge witnessed)
  Check 3 — Fullness (every test obligation has a sourcing concept)
  Check 4 — M6-pattern detection (residue-bait clusters)
  Check 5 — Cardinality lower bound (theoretical |T|_min vs actual)
  Check 6 — Perturbation invariance (LanFaithful empirical proxy)

Usage:
  python3 audit_richness.py <spec-dir>           Human-readable report.
  python3 audit_richness.py <spec-dir> --fix     Adds prescriptive fix text.
  python3 audit_richness.py <spec-dir> --json    Emits structured JSON.
  python3 audit_richness.py <spec-dir> --json --fix  JSON with `fix` field.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path

# -----------------------------------------------------------------------------
# Edge signatures from the DomainSpec paper (backend track only).
# (edge_type, allowed source meta-types, allowed target meta-types)
# -----------------------------------------------------------------------------
EDGE_SIGNATURES: list[tuple[str, set[str], set[str]]] = [
    ("performs",     {"Entity"},                          {"Operation"}),
    ("produces",     {"Operation"},                       {"Event"}),
    ("enforces",     {"Rule"},                            {"Operation"}),
    ("calculates",   {"Calculation"},                     {"Operation"}),
    ("transitions",  {"Event"},                           {"StateMachine"}),
    ("exposes",      {"Interface"},                       {"Operation", "Query"}),
    ("orchestrates", {"Workflow"},                        {"Operation"}),
    ("applies",      {"Policy"},                          {"Operation"}),
    ("maps",         {"Mapping"},                         {"Entity", "Interface"}),
    ("contains",     {"Entity"},                          {"ValueObject"}),
    ("queries",      {"Query"},                           {"Entity"}),
    ("emits",        {"Entity"},                          {"Event"}),
]

# Bold-prefix conventions used by zagr-marketplace (and DomainSpec generally) to
# declare typed edges inline at the top of each concept section. Each prefix maps
# to (edge_type, direction).
#   direction = "canonical": current section's concept is σ-source, link target is σ-target
#   direction = "inverse":   current section's concept is σ-target, link target is σ-source
PREFIX_EDGES: list[tuple[str, str, str]] = [
    # prefix (regex literal, anchored at start, case-insensitive), edge_type, direction
    (r"\*\*Actor:\*\*",               "performs",     "inverse"),
    (r"\*\*Triggers:\*\*",            "exposes",      "inverse"),
    (r"\*\*Trigger:\*\*",             "exposes",      "inverse"),
    (r"\*\*Produced by:\*\*",         "produces",     "inverse"),
    (r"\*\*Triggers transition:\*\*", "transitions",  "canonical"),
    (r"\*\*Orchestrates:\*\*",        "orchestrates", "canonical"),
    (r"\*\*Orchestrated by:\*\*",     "orchestrates", "inverse"),
    # Examples-dialect additions:
    (r"\*\*Exposes:\*\*",             "exposes",      "canonical"),  # Interface → Op/Query
    (r"\*\*Emits:\*\*",               "produces",     "canonical"),  # Op section: Op → Event
]
PREFIX_EDGE_RES = [(re.compile("^" + p, re.IGNORECASE), et, d)
                   for p, et, d in PREFIX_EDGES]

# Informational bold prefixes that label a section attribute but do NOT declare
# an edge. Lines beginning with these are skipped by both the bold-edge harvest
# and the σ-fallback so their incidental links don't leak into the typed graph.
# Generalises to experiment-style and domain-style dialects alike.
INFO_PREFIXES: list[str] = [
    r"\*\*Type:\*\*",
    r"\*\*Capability:\*\*",
    r"\*\*Agent:\*\*",
    r"\*\*Concept ID:\*\*",
    r"\*\*Identity:\*\*",
    r"\*\*Schema:\*\*",
    r"\*\*Path:\*\*",
    r"\*\*Allowed values:\*\*",
    r"\*\*Invariant:\*\*",
    r"\*\*Invariants:\*\*",
    r"\*\*Permission key:\*\*",
    r"\*\*Idempotency:\*\*",
    r"\*\*Algorithm:\*\*",
    r"\*\*Score formula\b",
    r"\*\*Derivation rule:\*\*",
    r"\*\*Calibration question",
    r"\*\*Method choice",
    r"\*\*Statistical-power note:\*\*",
    r"\*\*Stage-1 vs Stage-2",
    r"\*\*Self-service deletion",  # zagr inline note
    r"\*\*Retention rule",
]
INFO_PREFIX_RES = [re.compile("^" + p, re.IGNORECASE) for p in INFO_PREFIXES]

# Lines containing these tokens express negations or denial conditions; their
# incidental links must NOT be promoted to typed edges. This eliminates the
# "RejectNode emits NodeReadyForRegistration" class of false positives.
NEGATION_PATTERNS: list[str] = [
    r"\*\*No\*\*",
    r"\*\*Not\*\*",
    r"\bMUST NOT\b",
    r"\bmust not\b",
    r"\bnever\b",
    r"\bforbidden\b",
    r"\bnot stored\b",
    r"\bnot invoked\b",
    r"\bdo not\b",
    r"\bnot used\b",
    r"~~",
]
NEGATION_RE = re.compile("|".join(NEGATION_PATTERNS))


# What outgoing/incoming edges each meta-type minimally needs to be witnessed.
# An Operation should have ≥1 incoming `performs` (some Entity does it)
# and ideally ≥1 incoming `enforces` (some Rule guards it).
META_REQUIREMENTS: dict[str, dict[str, list[str]]] = {
    "Operation":    {"incoming": ["performs"]},
    "Event":        {"incoming": ["produces"]},
    "Workflow":     {"outgoing": ["orchestrates"]},
    "Query":        {"outgoing": ["queries"]},
    "Rule":         {"outgoing": ["enforces"]},
    "Calculation":  {"outgoing": ["calculates"]},
    "Policy":       {"outgoing": ["applies"]},
    "Mapping":      {"outgoing": ["maps"]},
    "Interface":    {"outgoing": ["exposes"]},
    "Entity":       {},  # entities are roots; no minimum
    "ValueObject":  {},
    "Enum":         {},
    "StateMachine": {},
    "Aggregate":    {},  # treated like Entity for edge-requirement purposes
    "Governance":   {},  # corpus seals, criteria seals, methodology notes
}


@dataclass
class Concept:
    name: str
    meta: str
    section: str | None = None         # "## Section" the concept lives under
    file: str | None = None            # aspect file
    rules: int = 0                     # rule rows in `### Rules` table
    postconditions: int = 0            # bullets in `### Postconditions`
    error_states: int = 0              # rows in `### Error States` table
    transitions: int = 0               # rows in transition tables
    invariants: int = 0                # *-INV-* rows
    fields: int = 0                    # rows in `### Input` / field tables
    out_edges: list[tuple[str, str]] = field(default_factory=list)  # (edge_type, target)
    in_edges:  list[tuple[str, str]] = field(default_factory=list)  # (edge_type, source)


# -----------------------------------------------------------------------------
# Parsing
# -----------------------------------------------------------------------------
def slugify(s: str) -> str:
    """GitHub-style header anchor."""
    s = s.lower()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"\s+", "-", s).strip("-")
    return s


def parse_registry(spec_md: str) -> dict[str, str]:
    """
    Extract (concept_name -> meta_type) from SPEC.md's concept registry.

    Accepts two registry section conventions:
      - `## Concept Registry` (zagr-marketplace dialect; 3-column table)
      - `## Concepts`         (examples dialect; 4-column table with Description)

    The ID column may or may not be backtick-wrapped.
    """
    concepts: dict[str, str] = {}
    in_registry = False
    for line in spec_md.splitlines():
        stripped = line.strip()
        if stripped == "## Concept Registry" or stripped == "## Concepts":
            in_registry = True
            continue
        if in_registry and line.startswith("## "):
            break
        if not in_registry:
            continue
        # Three-cell prefix: | [Name](link) | id | meta-type | (optional 4th col)
        m = re.match(
            r"\|\s*\[([^\]]+)\]\([^)]*\)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|",
            line,
        )
        if not m:
            continue
        name = m.group(1).strip()
        # m.group(2) is the ID (may have backticks); we don't actually need it.
        meta_raw = m.group(3).strip()
        # Strip parentheticals and normalize
        meta = re.sub(r"\s*\([^)]*\)", "", meta_raw)
        meta = meta.replace("Saga-shaped ", "")
        meta = meta.replace("Value Object", "ValueObject")
        meta = meta.replace("State Machine", "StateMachine")
        concepts[name] = meta.strip()
    return concepts


def parse_aspect_file(path: Path, concepts: dict[str, Concept],
                      all_link_refs: set[tuple[str, str]],
                      pre_typed_edges: set[tuple[str, str, str]],
                      orphan_sections: list[str],
                      strict: bool = True) -> None:
    """
    Walk one aspect file. Detect `## SectionName` headers, attribute the section
    to a registry concept (when its slug matches a known concept's slug),
    and count rule/postcondition/transition/error/field rows under each section.
    Also collect outgoing markdown links for edge inference.
    """
    text = path.read_text()
    lines = text.splitlines()

    # Build concept-slug → name index
    slug_to_name: dict[str, str] = {}
    for name in concepts:
        slug_to_name[slugify(name)] = name

    current_concept: Concept | None = None
    subsection: str | None = None  # "Rules" | "Postconditions" | "Error States" | etc.

    # Markdown table-row predicate: starts with `|` and isn't a separator.
    sep_row = re.compile(r"^\|[\s\-:|]+\|\s*$")
    table_row = lambda l: l.startswith("|") and not sep_row.match(l)

    for i, line in enumerate(lines):
        # Section header: `## Name` or `### Name`
        h2 = re.match(r"^##\s+(.+?)\s*$", line)
        h3 = re.match(r"^###\s+(.+?)\s*$", line)
        if h2:
            section = h2.group(1).strip()
            slug = slugify(section)
            current_concept = concepts.get(slug_to_name.get(slug, ""), None)
            if current_concept is not None:
                current_concept.file = path.name
                current_concept.section = section
            else:
                # Track non-registry H2 sections so the audit can warn about
                # orphaned aspect content (likely a registry omission or a
                # spec-only narrative section like "Objective" / "Module Map").
                # Filter common non-concept headers to avoid noise.
                if section.lower() not in {
                    "objective", "module map", "overview", "what this module owns",
                    "aspects", "aspect docs", "concepts", "concept registry",
                    "domain concepts", "capabilities", "cross-feature dependencies",
                    "produces for", "deferred obligations", "stories",
                    "change history", "references", "audit-reason matrix (cross-reference)",
                }:
                    orphan_sections.append(f"{path.name}: ## {section}")
            subsection = None
            continue
        if h3:
            subsection = h3.group(1).strip()
            continue

        if current_concept is None:
            continue

        # Skip informational bold prefixes outright — neither edge harvest nor
        # σ-fallback should run on these lines.
        if any(rx.match(line) for rx in INFO_PREFIX_RES):
            continue

        # Skip negation / cross-reference / Error-State lines from σ-fallback.
        # We still allow bold-prefix edges on these (a "**Produced by:** [X]"
        # in an Error-States row would be unusual but unambiguous), but we
        # remember the negation status to gate the generic link harvest below.
        line_negates = bool(NEGATION_RE.search(line)) or line.lstrip().startswith(">")
        in_error_states = (subsection or "").lower() == "error states"

        # Bold-prefix edge declarations (Actor, Triggers, Produced by, …).
        # If the line begins with a known prefix, harvest its links as pre-typed
        # edges using the prefix's σ-direction and skip the generic detection
        # below to avoid double-counting.
        prefix_handled = False
        for prefix_re, edge_type, direction in PREFIX_EDGE_RES:
            if not prefix_re.match(line):
                continue
            # Inverse-direction prefixes (Actor, Triggers, Produced by,
            # Orchestrated by) name a single counterpart; any further links on
            # the line are scope qualifiers ("Actor: User with Role over Node")
            # or negated cross-references ("Orchestrated by: X. Y is not
            # invoked"). Take only the first link to avoid false positives.
            # Canonical-direction prefixes (Orchestrates, Exposes, Emits) may
            # legitimately list multiple targets — keep harvesting all.
            limit_to_first = direction == "inverse"
            harvested = 0
            for m in re.finditer(r"\[([^\]]+)\]\(([^)]*?)#([^)]+)\)", line):
                target_slug = m.group(3).lower()
                target_name = slug_to_name.get(target_slug)
                if not target_name or target_name == current_concept.name:
                    continue
                if direction == "canonical":
                    src, tgt = current_concept.name, target_name
                else:
                    src, tgt = target_name, current_concept.name
                pre_typed_edges.add((src, edge_type, tgt))
                all_link_refs.add((current_concept.name, target_name))
                harvested += 1
                if limit_to_first and harvested >= 1:
                    break
            prefix_handled = True
            break
        if prefix_handled:
            continue

        sub_lc = (subsection or "").lower()

        # Rules subsection of an Operation: links to Rule/Policy concepts declare
        # `enforces(Rule, current_op)` or `applies(Policy, current_op)`.
        # Accepts variants: "Rules", "Business Rules", "Validation Rules", etc.
        if sub_lc.endswith("rules") and current_concept.meta == "Operation":
            for m in re.finditer(r"\[([^\]]+)\]\(([^)]*?)#([^)]+)\)", line):
                target_slug = m.group(3).lower()
                target_name = slug_to_name.get(target_slug)
                if not target_name or target_name == current_concept.name:
                    continue
                target_concept = concepts.get(target_name)
                if target_concept is None:
                    continue
                if target_concept.meta == "Rule":
                    pre_typed_edges.add((target_name, "enforces", current_concept.name))
                elif target_concept.meta == "Policy":
                    pre_typed_edges.add((target_name, "applies", current_concept.name))
                all_link_refs.add((current_concept.name, target_name))

        # "Reads From" subsection in a Query section: queries(Query, Entity).
        if sub_lc in {"reads from", "reads"} and current_concept.meta == "Query":
            for m in re.finditer(r"\[([^\]]+)\]\(([^)]*?)#([^)]+)\)", line):
                target_slug = m.group(3).lower()
                target_name = slug_to_name.get(target_slug)
                if not target_name or target_name == current_concept.name:
                    continue
                target_concept = concepts.get(target_name)
                if target_concept and target_concept.meta == "Entity":
                    pre_typed_edges.add((current_concept.name, "queries", target_name))
                    all_link_refs.add((current_concept.name, target_name))

        # Workflow Sequence bare-name harvest. Specs that don't anchor-link
        # operations from inside numbered workflow steps (e.g. ccb-matching-
        # experiment) still describe the orchestration as prose. When a
        # Workflow concept's section contains a "Sequence" / "Steps" /
        # "Algorithm" subsection, match bare CamelCase names against the
        # registry and emit `orchestrates(Workflow, Operation)` edges.
        if (current_concept.meta == "Workflow"
                and sub_lc in {"sequence", "steps", "algorithm", "flow"}):
            for token in re.findall(r"\b([A-Z][A-Za-z0-9]+)\b", line):
                target_name = slug_to_name.get(slugify(token))
                if not target_name or target_name == current_concept.name:
                    continue
                target_concept = concepts.get(target_name)
                if target_concept and target_concept.meta == "Operation":
                    pre_typed_edges.add(
                        (current_concept.name, "orchestrates", target_name))
                    all_link_refs.add((current_concept.name, target_name))

        # "Field Mapping" subsection in a Mapping section: maps(Mapping, Entity/Interface).
        if sub_lc.startswith("field mapping") and current_concept.meta == "Mapping":
            for m in re.finditer(r"\[([^\]]+)\]\(([^)]*?)#([^)]+)\)", line):
                target_slug = m.group(3).lower()
                target_name = slug_to_name.get(target_slug)
                if not target_name or target_name == current_concept.name:
                    continue
                target_concept = concepts.get(target_name)
                if target_concept and target_concept.meta in {"Entity", "Interface"}:
                    pre_typed_edges.add((current_concept.name, "maps", target_name))
                    all_link_refs.add((current_concept.name, target_name))

        # Outgoing links: [Text](file.md#anchor) or [Text](#anchor)
        # In strict mode (default), incidental links on negated lines or inside
        # Error-State subsections only count toward link-refs (fullness signal),
        # NOT toward the typed-edge graph. In permissive mode the historical
        # behaviour is preserved.
        suppress_typed = strict and (line_negates or in_error_states)
        for m in re.finditer(r"\[([^\]]+)\]\(([^)]*?)#([^)]+)\)", line):
            target_slug = m.group(3).lower()
            target_name = slug_to_name.get(target_slug)
            if target_name and target_name != current_concept.name:
                if not suppress_typed:
                    current_concept.out_edges.append(("?", target_name))
                all_link_refs.add((current_concept.name, target_name))

        # Subsection-aware row counting
        if subsection and table_row(line):
            # Skip table headers (line right after `### Subsection` is the header row,
            # then the separator); we count "data rows" only.
            # Heuristic: a row whose first cell is non-empty and not a column label.
            cells = [c.strip() for c in line.strip("|").split("|")]
            first = cells[0] if cells else ""
            # Header-row heuristic: capitalized title-looking words, no codes
            looks_like_header = bool(re.match(r"^(ID|Field|Condition|From|Trigger|Aspect|Concept|Step|Endpoint|Status|Source|Target|Capability|Consumer|OD|DD|OQ|Rule|Type|Required|Description|Result|Notes?|Method|Path|Param)$", first))
            if looks_like_header or first == "":
                continue
            sub_lc = subsection.lower()
            if sub_lc.endswith("rules"):
                current_concept.rules += 1
            elif sub_lc == "error states":
                current_concept.error_states += 1
            elif sub_lc in {"input", "inputs", "fields", "schema"}:
                current_concept.fields += 1
            elif "transition" in sub_lc:
                current_concept.transitions += 1

        # Postconditions / Effects are bullet lists, not tables
        if subsection and subsection.lower() in {"postconditions", "effects"}:
            if line.startswith("- "):
                current_concept.postconditions += 1

        # Invariant rows: lines like `| N-INV-1 | ... |` or `| AAL-INV-2 | ... |`
        if table_row(line):
            cells = [c.strip() for c in line.strip("|").split("|")]
            first = cells[0] if cells else ""
            if re.match(r"^[A-Z]{1,5}-INV-\d+$", first):
                current_concept.invariants += 1

        # (Transition counting handled in the subsection-aware row counter above
        # via the "transition" sub_lc branch; the prior fallback here was dead
        # code that set a flag and never read it.)


def infer_edge_type(concepts: dict[str, Concept],
                    pre_typed: set[tuple[str, str, str]] | None = None
                    ) -> tuple[list, list]:
    """
    Build the typed-edge set:
      1. Start with pre-typed edges from the bold-prefix parser.
      2. Filter pre-typed edges to those whose (src_meta, edge_type, tgt_meta)
         actually satisfies σ — drops spurious harvests when a bold-prefix line
         contained multiple unrelated links (e.g. "Actor: User with Role ADMIN"
         where Role is an Enum, not an Entity).
      3. For remaining link refs that aren't already pre-typed, fall back to
         σ-matching in canonical direction.
    Returns (typed_edges, untyped_edges). Deduplicates and mutates concept
    edge lists.
    """
    sigma_index: dict[str, tuple[set[str], set[str]]] = {
        et: (src, tgt) for et, src, tgt in EDGE_SIGNATURES
    }

    def sigma_ok(src_name: str, et: str, tgt_name: str) -> bool:
        sc = concepts.get(src_name)
        tc = concepts.get(tgt_name)
        if sc is None or tc is None or et not in sigma_index:
            return False
        src_set, tgt_set = sigma_index[et]
        return sc.meta in src_set and tc.meta in tgt_set

    typed_set: set[tuple[str, str, str]] = {
        (s, et, t) for s, et, t in (pre_typed or set()) if sigma_ok(s, et, t)
    }
    untyped_set: set[tuple[str, str, str]] = set()
    # Track (src, tgt) pairs already typed (in either direction) to avoid
    # also adding a σ-match version.
    typed_pairs: set[tuple[str, str]] = set()
    for s, _, t in typed_set:
        typed_pairs.add((s, t))
        typed_pairs.add((t, s))

    for src_name, c in concepts.items():
        seen_for_src: set[tuple[str, str]] = set()
        for _, tgt_name in c.out_edges:
            if (src_name, tgt_name) in seen_for_src:
                continue
            seen_for_src.add((src_name, tgt_name))
            if (src_name, tgt_name) in typed_pairs:
                continue  # already covered by pre-typed
            tgt = concepts.get(tgt_name)
            if tgt is None:
                continue
            matched = None
            for et, src_set, tgt_set in EDGE_SIGNATURES:
                if c.meta in src_set and tgt.meta in tgt_set:
                    matched = et
                    break
            if matched:
                typed_set.add((src_name, matched, tgt_name))
            else:
                untyped_set.add((src_name, "?", tgt_name))

    # Rebuild concept edge lists from the deduped sets
    for c in concepts.values():
        c.out_edges = []
        c.in_edges = []
    for src, et, tgt in typed_set:
        concepts[src].out_edges.append((et, tgt))
        concepts[tgt].in_edges.append((et, src))
    for src, _, tgt in untyped_set:
        concepts[src].out_edges.append(("?", tgt))

    return sorted(typed_set), sorted(untyped_set)


# -----------------------------------------------------------------------------
# Test-spec parsing
# -----------------------------------------------------------------------------
def parse_test_spec(test_md: str) -> tuple[int, dict[str, int]]:
    """
    Returns (total_test_rows, tests_per_concept_token).
    Test IDs: T-{ASPECT}-{Concept}-{nn}.
    """
    # Test row in a table: starts with `| T-` followed by an ID
    rows = re.findall(r"^\|\s*(T-[A-Z]+-[A-Za-z0-9-]+-\d+)\s*\|", test_md, re.M)
    total = len(rows)

    per_concept: Counter[str] = Counter()
    for r in rows:
        m = re.match(r"T-([A-Z]+)-([A-Za-z0-9-]+)-\d+$", r)
        if m:
            concept_token = m.group(2)
            per_concept[concept_token] += 1
    return total, dict(per_concept)


# -----------------------------------------------------------------------------
# The six checks
# -----------------------------------------------------------------------------
def check_1_collisions(concepts: dict[str, Concept]) -> list[tuple[str, ...]]:
    """
    Concepts whose derivation signature is identical.
    Signature includes: meta-type, counts of rules/postconditions/etc., AND
    the multiset of typed outgoing/incoming edge types — distinguishes concepts
    whose only differentiator is their relationship topology.
    """
    sig_to_names: defaultdict[tuple, list[str]] = defaultdict(list)
    for name, c in concepts.items():
        out_sig = tuple(sorted(Counter(et for et, _ in c.out_edges).items()))
        in_sig  = tuple(sorted(Counter(et for et, _ in c.in_edges).items()))
        sig = (c.meta, c.rules, c.postconditions, c.error_states,
               c.transitions, c.fields, c.invariants, out_sig, in_sig)
        # Skip concepts with no countable structure AND no edges — too sparse to compare.
        if (c.rules + c.postconditions + c.error_states + c.transitions
            + c.fields + c.invariants == 0
            and not c.out_edges and not c.in_edges):
            continue
        sig_to_names[sig].append(name)
    return [tuple(v) for v in sig_to_names.values() if len(v) > 1]


def check_2_faithfulness(concepts: dict[str, Concept]) -> list[tuple[str, str, str]]:
    """Concepts missing required incoming/outgoing edges per their meta-type."""
    issues: list[tuple[str, str, str]] = []  # (concept, missing_kind, edge_type)
    for name, c in concepts.items():
        req = META_REQUIREMENTS.get(c.meta, {})
        for et in req.get("incoming", []):
            if not any(e[0] == et for e in c.in_edges):
                issues.append((name, "incoming", et))
        for et in req.get("outgoing", []):
            if not any(e[0] == et for e in c.out_edges):
                # Try checking the raw out_edges — edge type may have been inferred
                if not any(e[0] == et for e in c.out_edges):
                    typed_outs = {e[0] for e in c.out_edges}
                    if et not in typed_outs:
                        issues.append((name, "outgoing", et))
    return issues


def check_3_fullness(concepts: dict[str, Concept],
                     tests_per_concept: dict[str, int],
                     all_link_refs: set[tuple[str, str]]) -> tuple[list[str], list[tuple[str, int]]]:
    """
    Returns (concepts_with_zero_tests, concepts_with_low_tests).

    Test-ID convention strips meta-type suffix:
      Workflow    → 'Workflow' suffix dropped (SoftDeleteCascadeWorkflow → SoftDeleteCascade)
      Mapping     → 'Mapping' suffix dropped
      Query       → tested as token equals name OR name without 'Query'
      StateMachine→ skipped (transitions tested via Op tests)
      Rule/Policy → tested as T-RULES-{InvariantId}, not by concept name
      Enum/VO     → tested transitively
      Entity      → tested transitively through Operations on the Entity. We
                    count an Entity as covered if ≥1 Operation that mentions
                    it (via incoming `performs` or via the Entity name appearing
                    in any Operation/Query/Workflow's section) has tests.
      Interface   → tested as T-IF-{method}-{path}; we count any T-IF-* row
                    when an Interface exists (interface-level fullness is
                    derived from endpoints, which we don't extract here).
    """
    zero: list[str] = []
    low: list[tuple[str, int]] = []
    skip_meta = {"Enum", "ValueObject", "StateMachine", "Rule", "Policy"}

    # Concept name → list of test-token candidates that should match
    def split_camel(s: str) -> list[str]:
        return re.findall(r"[A-Z][a-z0-9]*", s) or [s]

    def candidate_tokens(name: str) -> set[str]:
        cands = {name}
        # Strip meta-type-style suffix words
        for suf in ("Workflow", "Mapping", "Query", "Constraint",
                    "Invariant", "Predicate", "Policy"):
            if name.endswith(suf) and name != suf:
                cands.add(name[: -len(suf)])
        # Add every CamelCase prefix (covers conventions like
        # "RetentionAwareDeletionWorkflow" → test token "RetentionAware")
        words = split_camel(name)
        for k in range(1, len(words)):
            cands.add("".join(words[:k]))
        # camelCase first-letter-lower variants
        for c in list(cands):
            if c:
                cands.add(c[0].lower() + c[1:])
        return {x.lower() for x in cands}

    # Total T-IF-* rows in the spec (used as Interface coverage)
    interface_total = sum(n for tok, n in tests_per_concept.items()
                          if tok.lower().startswith("t-if-") or
                             tok.lower().startswith(("get-", "post-", "put-", "del-", "patch-")))

    for name, c in concepts.items():
        if c.meta in skip_meta:
            continue
        if c.meta == "Interface":
            # Interface-level coverage: existence of T-IF-* rows.
            if interface_total == 0:
                zero.append(name)
            continue

        cands = candidate_tokens(name)
        count = 0
        for token, n in tests_per_concept.items():
            if token.lower() in cands:
                count += n

        # For Entities, transitive coverage: an Entity is "tested" if any
        # concept that links to it (via any link, typed or untyped) has tests.
        if c.meta == "Entity" and count == 0:
            referrers = {src for src, tgt in all_link_refs if tgt == name}
            for ref in referrers:
                ref_meta = concepts[ref].meta if ref in concepts else None
                if ref_meta not in {"Operation", "Workflow", "Query", "Mapping"}:
                    continue
                ref_cands = candidate_tokens(ref)
                for token, n in tests_per_concept.items():
                    if token.lower() in ref_cands:
                        count += n

        if count == 0:
            zero.append(name)
        elif c.meta == "Query" and count < 3:
            low.append((name, count))
        elif c.meta == "Workflow" and count < 2:
            low.append((name, count))
    return zero, low


def check_4_m6(concepts: dict[str, Concept],
               typed_edges: list[tuple[str, str, str]]) -> list[tuple[str, str, list[str]]]:
    """
    M6-pattern: pairwise-unrelated concepts converging on a non-Entity target.

    The 4-object M6 counterexample structure: a Discrete subgraph mapping into
    a non-discrete target. Translated: ≥2 concepts that have NO edges among
    themselves all point to the same target via the same edge type.

    Excludes Entity targets (Entity is an aggregate root; many incoming queries
    or contains edges is the *expected* pattern, not residue-bait). Reports the
    edge-type so duplicate-image patterns by edge family are visible.
    """
    incoming: defaultdict[tuple[str, str], list[str]] = defaultdict(list)
    for src, et, tgt in typed_edges:
        incoming[(tgt, et)].append(src)

    edge_pairs = {(s, t) for s, _, t in typed_edges}
    edge_pairs |= {(t, s) for s, _, t in typed_edges}

    clusters: list[tuple[str, str, list[str]]] = []
    for (tgt, et), srcs in incoming.items():
        if len(set(srcs)) < 2:
            continue
        # Skip Entity targets — many-to-one queries/contains is normal, not residue.
        if concepts.get(tgt) and concepts[tgt].meta == "Entity":
            continue
        unique_srcs = sorted(set(srcs))
        # Are all srcs pairwise unrelated?
        unrelated = True
        for i, a in enumerate(unique_srcs):
            for b in unique_srcs[i + 1:]:
                if (a, b) in edge_pairs:
                    unrelated = False
                    break
            if not unrelated:
                break
        if unrelated:
            clusters.append((tgt, et, unique_srcs))
    return clusters


def check_5_cardinality(concepts: dict[str, Concept],
                        actual_tests: int) -> tuple[int, int, int, dict[str, int]]:
    """Compute |T|_min from spec counts."""
    breakdown: dict[str, int] = {}

    # δ4: rules → 2 tests each (pass + fail)
    rules = sum(c.rules for c in concepts.values())
    breakdown["δ4 rules×2"] = rules * 2

    # δ6: postconditions → 1 test each
    posts = sum(c.postconditions for c in concepts.values())
    breakdown["δ6 postconditions"] = posts

    # δ7: error states → 1 test each
    errs = sum(c.error_states for c in concepts.values())
    breakdown["δ7 error states"] = errs

    # δ1+δ2: transitions → 1 test each (rough)
    trans = sum(c.transitions for c in concepts.values())
    breakdown["δ1+δ2 transitions"] = trans

    # δ3: invariants → 1 test each
    invs = sum(c.invariants for c in concepts.values())
    breakdown["δ3 invariants"] = invs

    # δ12: queries → ≥3 tests each
    queries = sum(1 for c in concepts.values() if c.meta == "Query")
    breakdown["δ12 queries×3"] = queries * 3

    # δ13: workflows → ≥2 tests per step (we don't count steps; use 4 as floor)
    workflows = sum(1 for c in concepts.values() if c.meta == "Workflow")
    breakdown["δ13 workflows×4"] = workflows * 4

    # δ10+δ11: events → ≥2 tests each (emit + consume)
    events = sum(1 for c in concepts.values() if c.meta == "Event")
    breakdown["δ10+δ11 events×2"] = events * 2

    t_min = sum(breakdown.values())
    shortfall = max(0, t_min - actual_tests)
    return t_min, actual_tests, shortfall, breakdown


# -----------------------------------------------------------------------------
# Prescription generators: turn a finding into a concrete edit.
# -----------------------------------------------------------------------------
EDGE_HOME_FILE: dict[str, str] = {
    # Where the edge of this type would normally be declared
    "performs":     "domain.md",       # under the Entity, list operations
    "produces":     "operations.md",   # under the Operation, list events
    "enforces":     "operations.md",   # under the Operation's "### Rules"
    "calculates":   "operations.md",
    "transitions":  "events.md",
    "exposes":      "interfaces.md",
    "orchestrates": "workflows.md",
    "applies":      "operations.md",
    "maps":         "mappings.md",
    "contains":     "domain.md",
    "queries":      "queries.md",
    "emits":        "domain.md",
}


def fix_collision(concepts: dict[str, Concept], group: tuple[str, ...]) -> str:
    metas = {concepts[n].meta for n in group}
    if len(metas) == 1:
        meta = next(iter(metas))
        return (f"Two {meta}s have indistinguishable derivation signatures. "
                f"Add a discriminator: for {group[0]} or {group[1]}, declare a "
                f"distinguishing rule, postcondition, or relationship in its "
                f"aspect file. If they truly are the same, merge them and "
                f"parameterize.")
    return (f"Concepts of different meta-types collapsed structurally — likely "
            f"a parser blind spot, not a real collision. Verify by reading "
            f"each concept's aspect section.")


def fix_unwitnessed_edge(concept: Concept, kind: str, edge_type: str) -> str:
    home = EDGE_HOME_FILE.get(edge_type, "<aspect>.md")
    sig_src, sig_tgt = next(((s, t) for et, s, t in EDGE_SIGNATURES if et == edge_type),
                            (set(), set()))
    if kind == "incoming":
        return (f"{concept.meta} '{concept.name}' has no declared '{edge_type}' "
                f"source. Edit {home} under the {sorted(sig_src)} that "
                f"{edge_type} this concept; add a markdown link "
                f"`[{concept.name}](operations.md#{slugify(concept.name)})` "
                f"in a '### {edge_type.capitalize()}' subsection.")
    else:
        return (f"{concept.meta} '{concept.name}' has no declared '{edge_type}' "
                f"target. Edit {home}: under the {concept.name} section, add "
                f"a '### {edge_type.capitalize()}' subsection listing every "
                f"{sorted(sig_tgt)} this concept {edge_type}.")


def fix_zero_tests(concept: Concept) -> str:
    rule_hint = {
        "Operation": "δ4 (rules ≥2 tests each) + δ6 (1 per postcondition) + δ7 (1 per error state)",
        "Workflow":  "δ13 (happy + compensation per step)",
        "Query":     "δ12 (output shape + filter + auth, ≥3 tests)",
        "Mapping":   "δ14 (1 transformation test per row)",
        "Event":     "δ10 (producer emission) + δ11 (consumer handling)",
    }.get(concept.meta, "the relevant δ-rules")
    return (f"Add T-{concept.meta[:3].upper()}-{concept.name}-NN rows to "
            f"TEST-SPEC.md. Per {rule_hint}, this concept should have ≥1 row.")


def fix_low_tests(concept: Concept, count: int) -> str:
    if concept.meta == "Query":
        return (f"Query '{concept.name}' has {count} tests; δ12 expects ≥3 "
                f"(output shape, filter parameters, authorization). Add the "
                f"missing test types as T-QR-{concept.name}-NN rows in "
                f"TEST-SPEC.md.")
    return (f"'{concept.name}' has only {count} tests for its meta-type. "
            f"Add coverage in TEST-SPEC.md.")


def fix_m6_cluster(target: str, edge_type: str, sources: list[str]) -> str:
    return (
        f"Multiple unrelated concepts share the same {edge_type} target "
        f"'{target}'. Pick one of:\n"
        f"      (a) Declare an explicit relationship between {{{', '.join(sources)}}} "
        f"in their aspect files (e.g. a shared parent Workflow or a common Rule).\n"
        f"      (b) Differentiate the targets — give each source its own distinct "
        f"target (e.g. {sources[0]}→{target}__{sources[0].lower()}).\n"
        f"      (c) If the convergence is intentional, add a comment in the "
        f"target concept's section noting the shared sources, so an LLM "
        f"compiling the spec doesn't have to infer the relationship from prose.")


def fix_cardinality(breakdown: dict[str, int], actual: int, shortfall: int) -> str:
    if shortfall == 0:
        return "Faithfulness ratio meets the lower bound. No action needed."
    largest = max(breakdown.items(), key=lambda kv: kv[1])
    return (f"Test count is {shortfall} below the theoretical minimum. The "
            f"largest contributor to |T|_min is {largest[0]} = {largest[1]}; "
            f"audit whether each item in that category has corresponding test "
            f"rows. If parametric `it.each` collapses several derived tests "
            f"into one, document the convention in TEST-SPEC.md and adjust "
            f"the cardinality expectation accordingly.")


def fix_redundancy(target: str, count: int, edge_type: str,
                   target_meta: str | None) -> str:
    if target_meta == "Entity" and edge_type in {"queries", "contains"}:
        return (f"'{target}' is an Entity with {count} incoming '{edge_type}' "
                f"edges — this is the expected aggregate-root pattern, not "
                f"residue. No action needed unless one of the queries is "
                f"genuinely redundant.")
    return (f"'{target}' has {count} incoming '{edge_type}' edges. Review "
            f"whether the sources are genuinely distinct: if two sources "
            f"produce/queries/orchestrate the same target with the same "
            f"semantics, consolidate them. If the redundancy is intentional, "
            f"differentiate them by adding a discriminating field or "
            f"declaring an explicit relationship.")


def check_6_perturbation(concepts: dict[str, Concept],
                          typed_edges: list[tuple[str, str, str]]) -> list[tuple[str, int, str]]:
    """
    Empirical LanFaithful proxy: edges whose deletion would not change the
    obligation set. Approximation: a target with multiple incoming edges of
    the same type has redundancy — any one of them could be removed.
    """
    by_target_type: defaultdict[tuple[str, str], list[str]] = defaultdict(list)
    for src, et, tgt in typed_edges:
        by_target_type[(tgt, et)].append(src)
    redundant: list[tuple[str, int, str]] = []
    for (tgt, et), srcs in by_target_type.items():
        if len(srcs) > 1:
            redundant.append((tgt, len(srcs), et))
    return sorted(redundant, key=lambda x: -x[1])


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
def run_audit(spec_dir: Path, strict: bool = True,
              test_spec_name: str = "TEST-SPEC.md") -> dict | None:
    """Run all checks and return a structured findings dict, or None on error.

    `strict` (default True) suppresses σ-fallback edge inference on negated and
    Error-State lines. Set to False to restore the historical permissive
    behaviour (more edges harvested, more parser-noise M6 clusters).
    `test_spec_name` is the filename of the test-spec inside `spec_dir` (specs
    that use a different name, e.g. STORIES.md, can override).
    """
    spec_md_path = spec_dir / "SPEC.md"
    if not spec_md_path.exists():
        print(f"ERROR: {spec_md_path} not found", file=sys.stderr)
        return None
    spec_md_text = spec_md_path.read_text()

    # YAML-style frontmatter (optional). Only the `profile:` key is read today.
    profile_from_frontmatter: str | None = None
    fm = re.match(r"^---\s*\n(.*?)\n---\s*\n", spec_md_text, re.DOTALL)
    if fm:
        for line in fm.group(1).splitlines():
            m = re.match(r"\s*profile\s*:\s*(\S+)\s*$", line)
            if m:
                profile_from_frontmatter = m.group(1).strip().strip('"\'')
                break

    registry = parse_registry(spec_md_text)
    if not registry:
        print("ERROR: empty registry — check SPEC.md format", file=sys.stderr)
        return None

    concepts = {name: Concept(name=name, meta=meta) for name, meta in registry.items()}
    # Aspect file list extended for dialects that author governance/stories
    # alongside the domain/operations canon.
    aspect_files = ["domain.md", "operations.md", "states.md", "interfaces.md",
                    "events.md", "queries.md", "workflows.md", "mappings.md",
                    "governance.md"]
    all_link_refs: set[tuple[str, str]] = set()
    pre_typed_edges: set[tuple[str, str, str]] = set()
    orphan_sections: list[str] = []
    for fn in aspect_files:
        p = spec_dir / fn
        if p.exists():
            parse_aspect_file(p, concepts, all_link_refs, pre_typed_edges,
                              orphan_sections, strict=strict)

    typed_edges, untyped_edges = infer_edge_type(concepts, pre_typed_edges)

    actual_tests = 0
    tests_per_concept: dict[str, int] = {}
    test_path = spec_dir / test_spec_name
    if test_path.exists():
        actual_tests, tests_per_concept = parse_test_spec(test_path.read_text())

    collisions = check_1_collisions(concepts)
    f_issues = check_2_faithfulness(concepts)
    zero, low = check_3_fullness(concepts, tests_per_concept, all_link_refs)
    clusters = check_4_m6(concepts, typed_edges)
    t_min, actual, shortfall, breakdown = check_5_cardinality(concepts, actual_tests)
    redundant = check_6_perturbation(concepts, typed_edges)

    # PARSER-BLIND short-circuit: if no typed edges were extracted but the
    # registry is non-trivial, the audit cannot meaningfully rate richness.
    # This usually means the spec uses a dialect the parser doesn't recognise
    # (no anchor links between aspect files, or unsupported bold prefixes)
    # rather than that the spec is genuinely unrelational. Surface this
    # directly instead of emitting a misleading "UNDER-SPECIFIED" score.
    parser_blind = len(typed_edges) == 0 and len(registry) >= 5
    if parser_blind:
        severity = 0
        verdict = ("PARSER-BLIND (0 typed edges extracted; verify dialect "
                   "compatibility — anchor-link discipline or supported bold "
                   "prefixes may be missing)")
    else:
        severity = 0
        severity += min(len(collisions), 3) * 2
        severity += min(len(f_issues), 5)
        severity += min(len(zero), 5)
        severity += min(len(clusters), 3) * 2
        if t_min and actual / t_min < 0.8:
            severity += 3
        if severity == 0:
            verdict = "RICH ENOUGH (residue-zero compilation plausible)"
        elif severity <= 6:
            verdict = "RICH IN STRUCTURE BUT WITH GAPS (low-to-moderate residue risk)"
        elif severity <= 12:
            verdict = "MODERATELY UNDER-SPECIFIED (notable residue risk)"
        else:
            verdict = "UNDER-SPECIFIED (high residue risk)"

    return {
        "spec_dir": str(spec_dir),
        "profile": profile_from_frontmatter or "paperBaseline",
        "summary": {
            "concepts": len(registry),
            "typed_edges": len(typed_edges),
            "untyped_link_refs": len(untyped_edges),
            "test_rows": actual_tests,
            "test_spec_file": test_spec_name,
            "theoretical_min_tests": t_min,
            "shortfall": shortfall,
            "faithfulness_ratio": (actual / t_min) if t_min else 0,
            "severity_score": severity,
            "verdict": verdict,
            "parser_blind": parser_blind,
            "strict_mode": strict,
            "meta_distribution": dict(Counter(c.meta for c in concepts.values())),
            "orphan_sections": sorted(set(orphan_sections)),
        },
        "_concepts": concepts,  # internal — stripped from JSON output
        "checks": {
            "collisions": [
                {"concepts": list(g),
                 "fix": fix_collision(concepts, g)}
                for g in collisions
            ],
            "unwitnessed_edges": [
                {"concept": n, "meta": concepts[n].meta,
                 "kind": kind, "edge_type": et,
                 "fix": fix_unwitnessed_edge(concepts[n], kind, et)}
                for n, kind, et in sorted(f_issues)
            ],
            "fullness_zero": [
                {"concept": n, "meta": concepts[n].meta,
                 "fix": fix_zero_tests(concepts[n])}
                for n in zero
            ],
            "fullness_low": [
                {"concept": n, "meta": concepts[n].meta, "tests": cnt,
                 "fix": fix_low_tests(concepts[n], cnt)}
                for n, cnt in low
            ],
            "m6_clusters": [
                {"target": tgt, "edge_type": et, "sources": srcs,
                 "fix": fix_m6_cluster(tgt, et, srcs)}
                for tgt, et, srcs in clusters
            ],
            "cardinality": {
                "breakdown": breakdown,
                "theoretical_min": t_min,
                "actual": actual,
                "shortfall": shortfall,
                "fix": fix_cardinality(breakdown, actual, shortfall),
            },
            "redundant_directions": [
                {"target": tgt, "edge_type": et, "incoming_count": cnt,
                 "fix": fix_redundancy(tgt, cnt, et,
                                       concepts[tgt].meta if tgt in concepts else None)}
                for tgt, cnt, et in redundant
            ],
        },
    }


def render_text(report: dict, show_fix: bool) -> str:
    """Human-readable report. If show_fix, append `→ Fix:` lines."""
    lines: list[str] = []
    s = report["summary"]
    spec_name = Path(report["spec_dir"]).name
    lines.append("=" * 72)
    lines.append(f"DomainSpec L1 Richness Audit — {spec_name}")
    lines.append("=" * 72)
    lines.append(f"Registry concepts:        {s['concepts']}")
    lines.append(f"Typed edges:              {s['typed_edges']}")
    lines.append(f"Untyped link refs:        {s['untyped_link_refs']}  (no σ-match)")
    lines.append(f"Test rows in {s.get('test_spec_file', 'TEST-SPEC.md'):14s} "
                 f"{s['test_rows']}")
    lines.append(f"Strict σ-fallback:        {s.get('strict_mode', True)}")
    lines.append("")
    lines.append("Meta-type distribution:")
    for meta, n in sorted(s["meta_distribution"].items(), key=lambda x: -x[1]):
        lines.append(f"  {meta:15s} {n}")
    lines.append("")
    if s.get("parser_blind"):
        lines.append("⚠  PARSER-BLIND: no typed edges extracted from this spec.")
        lines.append("   The audit cannot rate richness when no relational")
        lines.append("   structure is visible. Common causes:")
        lines.append("     • Aspect files use bare-name references instead of")
        lines.append("       [Concept](file.md#anchor) links.")
        lines.append("     • Spec uses bold prefixes the parser doesn't know.")
        lines.append("     • Registry meta-types fall outside the σ-table.")
        lines.append("   The check sections below are produced from what the")
        lines.append("   parser CAN see — verdict severity is suppressed.")
        lines.append("")
    if s.get("orphan_sections"):
        lines.append(f"Orphan H2 sections (not in registry): {len(s['orphan_sections'])}")
        for o in s["orphan_sections"][:10]:
            lines.append(f"  • {o}")
        if len(s["orphan_sections"]) > 10:
            lines.append(f"  …and {len(s['orphan_sections']) - 10} more")
        lines.append("")

    def section(title: str) -> None:
        lines.append("─" * 72)
        lines.append(title)
        lines.append("─" * 72)

    def fix_line(text: str) -> None:
        if show_fix:
            for ln in text.split("\n"):
                lines.append(f"      → {ln}" if not ln.startswith("      ") else ln)

    chk = report["checks"]

    section("CHECK 1 — Object injectivity (collapse candidates)")
    if not chk["collisions"]:
        lines.append("  ✓ No structural collapses found.")
    for item in chk["collisions"]:
        lines.append(f"  ✗ Collapse: {' ≡ '.join(item['concepts'])}")
        fix_line(item["fix"])
    lines.append(f"  → {len(chk['collisions'])} collapse cluster(s)")
    lines.append("")

    section("CHECK 2 — Faithfulness on edges (unwitnessed structural elements)")
    if not chk["unwitnessed_edges"]:
        lines.append("  ✓ All concepts witnessed.")
    for item in chk["unwitnessed_edges"]:
        lines.append(f"  ✗ {item['concept']:40s} ({item['meta']:11s}) "
                     f"missing {item['kind']:8s} {item['edge_type']}")
        fix_line(item["fix"])
    lines.append(f"  → {len(chk['unwitnessed_edges'])} unwitnessed required edge(s)")
    lines.append("")

    section("CHECK 3 — Fullness (concepts with zero or low test coverage)")
    for item in chk["fullness_zero"]:
        lines.append(f"  ✗ {item['concept']:40s} ({item['meta']}) — 0 tests")
        fix_line(item["fix"])
    for item in chk["fullness_low"]:
        lines.append(f"  ! {item['concept']:40s} ({item['meta']}) "
                     f"— {item['tests']} tests (low for type)")
        fix_line(item["fix"])
    lines.append(f"  → {len(chk['fullness_zero'])} unwitnessed, "
                 f"{len(chk['fullness_low'])} under-tested")
    lines.append("")

    section("CHECK 4 — M6-pattern detection (residue-bait clusters)")
    if not chk["m6_clusters"]:
        lines.append("  ✓ No M6 clusters detected.")
    for item in chk["m6_clusters"]:
        srcs = item["sources"]
        head = ", ".join(srcs[:6]) + ("..." if len(srcs) > 6 else "")
        lines.append(f"  ✗ {item['target']} ←[{item['edge_type']}]— "
                     f"{len(srcs)} unrelated: {head}")
        fix_line(item["fix"])
    lines.append(f"  → {len(chk['m6_clusters'])} M6-pattern cluster(s)")
    lines.append("")

    section("CHECK 5 — Cardinality lower bound")
    card = chk["cardinality"]
    for k, v in card["breakdown"].items():
        lines.append(f"  {k:25s} {v:>5d}")
    lines.append(f"  {'─' * 35}")
    lines.append(f"  {'Theoretical |T|_min':25s} {card['theoretical_min']:>5d}")
    lines.append(f"  {'Actual TEST-SPEC count':25s} {card['actual']:>5d}")
    lines.append(f"  {'Shortfall':25s} {card['shortfall']:>5d}")
    ratio = (card['actual'] / card['theoretical_min'] * 100
             if card['theoretical_min'] else 0)
    lines.append(f"  Faithfulness ratio: {ratio:.1f}%")
    if show_fix:
        fix_line(card["fix"])
    lines.append("")

    section("CHECK 6 — Perturbation invariance (redundant edge directions)")
    if not chk["redundant_directions"]:
        lines.append("  ✓ No redundant edge bundles detected.")
    for item in chk["redundant_directions"]:
        lines.append(f"  ! {item['target']:40s} has {item['incoming_count']} "
                     f"incoming '{item['edge_type']}' edges")
        fix_line(item["fix"])
    lines.append(f"  → {len(chk['redundant_directions'])} non-injective direction(s)")
    lines.append("")

    lines.append("=" * 72)
    lines.append("VERDICT")
    lines.append("=" * 72)
    lines.append(f"  Severity score: {s['severity_score']}")
    lines.append(f"  Verdict:        {s['verdict']}")
    lines.append("")
    return "\n".join(lines)


def emit_lean(report: dict, out_path: Path, namespace: str) -> None:
    """
    Generate a Lean 4 source file that imports the LeanCodeValidator v3 library
    and constructs a typed Spec. Running `#eval gradeFor spec` prints a
    CodegenReadinessReport (P1 closure + P5 acyclicity graded for real;
    P3/P4 stubbed until Layer 2).
    """
    concepts: dict[str, Concept] = report["_concepts"]
    # Reconstruct the typed edge list from concept in/out edges (deduped).
    typed_set: set[tuple[str, str, str]] = set()
    for c in concepts.values():
        for et, tgt in c.out_edges:
            if et != "?":
                typed_set.add((c.name, et, tgt))
    typed_edges = sorted(typed_set)

    # Profile: read from report['profile'] if the parser surfaced a
    # `profile:` frontmatter key; otherwise default to paperBaseline (D6).
    profile_val = (report.get("profile") or "paperBaseline").strip()
    if profile_val not in ("paperBaseline", "compositionExtension"):
        profile_val = "paperBaseline"

    # Unresolved references: any edge target that isn't a declared concept.
    declared_names = set(concepts.keys())
    unresolved = sorted({
        tgt for _, _, tgt in typed_edges if tgt not in declared_names
    } | {
        src for src, _, _ in typed_edges if src not in declared_names
    })

    # Keep only edges where both endpoints are declared — the well-typed
    # EdgeRow can't be constructed otherwise.
    in_graph_edges = [(s, et, t) for s, et, t in typed_edges
                      if s in declared_names and t in declared_names]

    def lean_concept_name(s: str) -> str:
        # Identifier-safe: replace spaces and non-alphanumerics with underscores;
        # ensure starts with uppercase.
        s = re.sub(r"[^A-Za-z0-9]", "_", s)
        if not s or not s[0].isalpha():
            s = "C_" + s
        return s[0].upper() + s[1:]

    name_map = {n: lean_concept_name(n) for n in concepts}

    # Provenance is not yet tracked per-edge in the parser; default to .declared.
    # When the parser starts emitting provenance, swap this lookup for a per-edge
    # value pulled from the report.
    def provenance_for(_src: str, _et: str, _tgt: str) -> str:
        return "declared"

    out: list[str] = []
    out.append(f"-- {out_path.name}")
    out.append(f"-- Auto-generated by audit_richness.py from {report['spec_dir']}.")
    out.append("-- v3 format: imports LeanCodeValidator.Report; #eval gradeFor spec")
    out.append("-- prints a CodegenReadinessReport.")
    out.append("--")
    out.append(f"-- Concepts: {len(concepts)}   Typed edges (in-graph): {len(in_graph_edges)}"
               f"   Unresolved refs: {len(unresolved)}   Profile: {profile_val}")
    out.append("")
    out.append("import LeanCodeValidator.Report")
    out.append("")
    out.append(f"namespace {namespace}")
    out.append("open LeanCodeValidator")
    out.append("")

    # --- Concept enum ---
    out.append("inductive Concept where")
    for cname in sorted(name_map.values()):
        out.append(f"  | {cname}")
    out.append("  deriving DecidableEq, BEq, Repr")
    out.append("")

    # --- metaOf (Concept → Meta from the library) ---
    out.append("def metaOf : Concept → Meta")
    for orig_name in sorted(concepts):
        c = concepts[orig_name]
        out.append(f"  | .{name_map[orig_name]} => .{c.meta}")
    out.append("")

    # --- ConceptSpace ---
    out.append("def conceptSpace : ConceptSpace where")
    out.append("  Concept  := Concept")
    out.append("  decEq    := inferInstance")
    out.append("  beq      := inferInstance")
    out.append("  concepts := [")
    sorted_concepts = sorted(name_map.values())
    for i, cname in enumerate(sorted_concepts):
        sep = "," if i < len(sorted_concepts) - 1 else ""
        out.append(f"    .{cname}{sep}")
    out.append("  ]")
    out.append("  metaOf   := metaOf")
    out.append("")

    # --- edges : List (EdgeRow profile conceptSpace) ---
    out.append(f"def edges : List (EdgeRow .{profile_val} conceptSpace) := [")
    for i, (src, et, tgt) in enumerate(in_graph_edges):
        sep = "," if i < len(in_graph_edges) - 1 else ""
        prov = provenance_for(src, et, tgt)
        out.append(
            f"  {{ src := .{name_map[src]}, edge := .{et}, "
            f"tgt := .{name_map[tgt]},"
        )
        out.append(
            f"    provenance := .{prov}, wellTyped := rfl }}{sep}"
        )
    out.append("]")
    out.append("")

    # --- Spec ---
    out.append("def spec : Spec where")
    out.append(f"  profile        := .{profile_val}")
    out.append("  conceptSpace   := conceptSpace")
    out.append("  edges          := edges")
    if unresolved:
        out.append("  unresolvedRefs := [")
        for i, name in enumerate(unresolved):
            sep = "," if i < len(unresolved) - 1 else ""
            # quote-safe: replace internal double quotes with escapes
            safe = name.replace("\\", "\\\\").replace('"', '\\"')
            out.append(f'    "{safe}"{sep}')
        out.append("  ]")
    else:
        out.append("  unresolvedRefs := []")
    out.append(f"  conceptCount   := {len(concepts)}")
    out.append("")

    # --- Verification entry point ---
    out.append("#eval gradeFor spec")
    out.append("")
    out.append(f"end {namespace}")
    out.append("")

    out_path.write_text("\n".join(out))


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        prog="audit_richness.py",
        description="DomainSpec L1 spec-richness audit.")
    parser.add_argument("spec_dir", type=Path,
                        help="Path to L1 spec directory (containing SPEC.md).")
    parser.add_argument("--json", action="store_true",
                        help="Emit structured JSON instead of text report.")
    parser.add_argument("--fix", action="store_true",
                        help="Include prescriptive fix text per finding.")
    parser.add_argument("--emit-lean", type=Path, default=None,
                        help="Generate a Lean 4 source file with machine-checked "
                             "structural theorems at the given path.")
    parser.add_argument("--lean-namespace", type=str, default=None,
                        help="Lean namespace for the generated module "
                             "(default: derived from spec dir name).")
    parser.add_argument("--permissive", action="store_true",
                        help="Disable strict σ-fallback. Restores legacy "
                             "behaviour: incidental links on negated lines and "
                             "inside Error-State subsections are promoted to "
                             "typed edges.")
    parser.add_argument("--test-spec", type=str, default="TEST-SPEC.md",
                        help="Filename of the test specification inside "
                             "spec_dir (default: TEST-SPEC.md). Use to point "
                             "at STORIES.md or a plan file when the spec "
                             "doesn't follow the canonical TEST-SPEC layout.")
    args = parser.parse_args(argv)

    report = run_audit(args.spec_dir.resolve(),
                       strict=not args.permissive,
                       test_spec_name=args.test_spec)
    if report is None:
        return 1

    if args.emit_lean is not None:
        ns = args.lean_namespace or "".join(
            w.capitalize() for w in re.split(r"[^A-Za-z0-9]", args.spec_dir.name) if w
        )
        emit_lean(report, args.emit_lean, ns)
        print(f"Wrote {args.emit_lean} (namespace: {ns})", file=sys.stderr)

    # Strip non-JSON-serializable internals
    json_report = {k: v for k, v in report.items() if not k.startswith("_")}

    if args.json:
        if not args.fix:
            # Drop the `fix` keys for a cleaner machine-readable form
            for check in json_report["checks"].values():
                if isinstance(check, list):
                    for item in check:
                        item.pop("fix", None)
                elif isinstance(check, dict):
                    check.pop("fix", None)
        print(json.dumps(json_report, indent=2, default=str))
    else:
        print(render_text(report, show_fix=args.fix))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
