"""Frontmatter schema. The single source of truth.

Per `vault/constitution/frontmatter-ownership-constitution.md`, this module
owns the Pydantic models for every vault node type. Subsystems validate
against these models — they do not extend them privately.

The 16 canonical `node_type` values are sourced from
`vault/ontology-conventions.md` (Appendix B, line 56 of the YAML schema
block). Per OQ-A/OQ-B, the kernel hard-rejects unknown `node_type` values
rather than silently falling back to the base `NodeFrontmatter`.
"""

from datetime import date
from typing import Any, Literal

import yaml
from pydantic import BaseModel, ConfigDict, Field

# Canonical 16 node_type values — source of truth: vault/ontology-conventions.md.
# Order matches the conventions doc YAML enumeration.
NodeType = Literal[
    "axiom",
    "premise",
    "constitution",
    "discovery",
    "implementation-plan",
    "spec",
    "audit",
    "conceptual",
    "test",
    "backlog",
    "readme",
    "research",
    "domainspec-subagents-strategy",
    "subagents-research",
    "subagents-findings",
    "discussion",
]

Status = Literal[
    "draft", "exploratory", "active", "consolidated", "evergreen", "retracted",
]

VerificationKind = Literal["local-files-read", "web-fetched", "model-recall"]

EDGE_FIELDS = (
    "derives-from", "cites", "contradicts", "supersedes",
    "governs", "lenses", "codified-as", "operationalized-by",
    "validates", "part-of", "creates", "modifies",
)


class NodeFrontmatter(BaseModel):
    """Universal base. Every vault node has these fields."""

    model_config = ConfigDict(
        populate_by_name=True,
        extra="allow",  # warn-not-reject during soft rollout
        arbitrary_types_allowed=True,
    )

    schema_version: int = 1
    node_type: NodeType
    layer: str
    nature: str | list[str]
    status: Status
    version: str | None = None
    last_updated: date | str | None = None
    tags: list[str] = Field(default_factory=list)
    is_session: bool = False


# --- Per-type subclasses -----------------------------------------------------
#
# Per constitution Rule 2, each `node_type` has its own subclass. Subclasses
# may be empty initially; the dispatch table itself is the load-bearing
# mechanism (it ensures `validate_node` hard-rejects unknown types). Per-type
# field tightening lands incrementally as ontology conventions specify it.


class AxiomFrontmatter(NodeFrontmatter):
    node_type: Literal["axiom"] = "axiom"
    veracidade: str | None = None
    convicção: str | None = Field(default=None, alias="convicção")


class PremiseFrontmatter(NodeFrontmatter):
    node_type: Literal["premise"] = "premise"
    veracidade: str | None = None
    convicção: str | None = Field(default=None, alias="convicção")


class ConstitutionFrontmatter(NodeFrontmatter):
    node_type: Literal["constitution"] = "constitution"


class DiscoveryFrontmatter(NodeFrontmatter):
    node_type: Literal["discovery"] = "discovery"
    veracidade: str | None = None
    convicção: str | None = Field(default=None, alias="convicção")


class ImplementationPlanFrontmatter(NodeFrontmatter):
    node_type: Literal["implementation-plan"] = "implementation-plan"


class SpecFrontmatter(NodeFrontmatter):
    node_type: Literal["spec"] = "spec"


class AuditFrontmatter(NodeFrontmatter):
    node_type: Literal["audit"] = "audit"
    veracidade: str | None = None
    convicção: str | None = Field(default=None, alias="convicção")


class ConceptualFrontmatter(NodeFrontmatter):
    node_type: Literal["conceptual"] = "conceptual"


class TestFrontmatter(NodeFrontmatter):
    node_type: Literal["test"] = "test"


class BacklogFrontmatter(NodeFrontmatter):
    node_type: Literal["backlog"] = "backlog"


class ReadmeFrontmatter(NodeFrontmatter):
    node_type: Literal["readme"] = "readme"


class ResearchFrontmatter(NodeFrontmatter):
    node_type: Literal["research"] = "research"


class DomainspecSubagentsStrategyFrontmatter(NodeFrontmatter):
    node_type: Literal["domainspec-subagents-strategy"] = "domainspec-subagents-strategy"


class SubagentsResearchFrontmatter(NodeFrontmatter):
    node_type: Literal["subagents-research"] = "subagents-research"


class SubagentsFindingsFrontmatter(NodeFrontmatter):
    node_type: Literal["subagents-findings"] = "subagents-findings"


class DiscussionFrontmatter(NodeFrontmatter):
    node_type: Literal["discussion"] = "discussion"


class SessionFrontmatter(NodeFrontmatter):
    """Session-shaped node. `is_session: true` is the discriminator; the
    underlying `node_type` reflects what the session's output plays (per
    ontology-conventions §node_type, "Why session is not a node_type")."""

    # Allow any of the canonical node_types — sessions are not a single type.
    is_session: Literal[True] = True
    timestamp: str | None = None
    conversation_id: str | None = None
    expected_importance: int | None = None


class LensFrontmatter(BaseModel):
    """Lens files have their own frontmatter shape (not a NodeFrontmatter)."""

    model_config = ConfigDict(extra="allow", arbitrary_types_allowed=True)

    lens: str
    date: date | str
    dispatched_by: str
    addresses: str
    sources: list[str] = Field(default_factory=list)
    verification: list[VerificationKind] = Field(default_factory=list)


_FRONTMATTER_BY_TYPE: dict[str, type[NodeFrontmatter]] = {
    "axiom": AxiomFrontmatter,
    "premise": PremiseFrontmatter,
    "constitution": ConstitutionFrontmatter,
    "discovery": DiscoveryFrontmatter,
    "implementation-plan": ImplementationPlanFrontmatter,
    "spec": SpecFrontmatter,
    "audit": AuditFrontmatter,
    "conceptual": ConceptualFrontmatter,
    "test": TestFrontmatter,
    "backlog": BacklogFrontmatter,
    "readme": ReadmeFrontmatter,
    "research": ResearchFrontmatter,
    "domainspec-subagents-strategy": DomainspecSubagentsStrategyFrontmatter,
    "subagents-research": SubagentsResearchFrontmatter,
    "subagents-findings": SubagentsFindingsFrontmatter,
    "discussion": DiscussionFrontmatter,
}


# Public constant: the canonical 16-value set, as a frozenset for fast
# membership checks (e.g. `vault_ctl.validate` Tier-1 enum check).
KNOWN_NODE_TYPES: frozenset[str] = frozenset(_FRONTMATTER_BY_TYPE.keys())


class UnknownNodeTypeError(ValueError):
    """Raised by `validate_node` when `node_type` is missing or off-catalog.

    Per OQ-B, the kernel hard-rejects unknown `node_type` values rather than
    silently falling back to the base `NodeFrontmatter`. This is the
    executable form of constitution Rule 1.
    """


def parse_frontmatter(text: str) -> tuple[dict[str, Any] | None, str]:
    """Split a markdown file into (frontmatter_dict, body)."""
    if not text.startswith("---"):
        return None, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None, text
    try:
        fm = yaml.safe_load(parts[1])
        if not isinstance(fm, dict):
            return None, parts[2]
        return fm, parts[2]
    except (yaml.YAMLError, ValueError):
        # ValueError covers PyYAML's datetime construction failures
        # (e.g. malformed `24:00:00`) which bypass yaml.YAMLError.
        return None, text


def validate_node(
    fm: dict[str, Any],
    *,
    source_path: str | None = None,
) -> BaseModel:
    """Dispatch on node_type and return the validated model.

    Raises:
        UnknownNodeTypeError: when `node_type` is missing or not one of the
            16 canonical values from `ontology-conventions.md`. Per OQ-B,
            this is a hard reject (no silent fallback to base).
        pydantic.ValidationError: on schema violation of the dispatched
            subclass.

    The optional `source_path` is included in error messages to make the
    rejection actionable for `vault_ctl validate` consumers.
    """
    node_type = fm.get("node_type")
    is_session = bool(fm.get("is_session"))

    # Session route: `is_session: true` files use the SessionFrontmatter
    # carrier regardless of their underlying node_type (sessions are not a
    # node_type per conventions). We still require node_type to be a known
    # value — sessions cannot opt out of the catalog.
    if is_session:
        if node_type is not None and str(node_type) not in KNOWN_NODE_TYPES:
            loc = f" (in {source_path})" if source_path else ""
            raise UnknownNodeTypeError(
                f"unknown node_type {node_type!r} on session document{loc}; "
                f"must be one of the {len(KNOWN_NODE_TYPES)} canonical types "
                f"defined in vault/ontology-conventions.md"
            )
        return SessionFrontmatter.model_validate(fm)

    if node_type is None:
        loc = f" (in {source_path})" if source_path else ""
        raise UnknownNodeTypeError(
            f"missing required field 'node_type'{loc}; "
            f"every non-session vault node must declare one of the "
            f"{len(KNOWN_NODE_TYPES)} canonical node_type values"
        )

    cls = _FRONTMATTER_BY_TYPE.get(str(node_type))
    if cls is None:
        loc = f" (in {source_path})" if source_path else ""
        raise UnknownNodeTypeError(
            f"unknown node_type {node_type!r}{loc}; "
            f"must be one of the {len(KNOWN_NODE_TYPES)} canonical types "
            f"defined in vault/ontology-conventions.md"
        )
    return cls.model_validate(fm)
