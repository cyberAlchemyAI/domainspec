"""Frontmatter schema. The single source of truth.

Per `vault/constitution/frontmatter-ownership-constitution.md`, this module
owns the Pydantic models for every vault node type. Subsystems validate
against these models — they do not extend them privately.
"""

from datetime import date
from typing import Any, Literal

import yaml
from pydantic import BaseModel, ConfigDict, Field

NodeType = Literal[
    "premise", "constitution", "axiom",
    "conceptual", "discovery", "session",
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


class PremiseFrontmatter(NodeFrontmatter):
    node_type: Literal["premise"] = "premise"
    veracidade: str | None = None
    convicção: str | None = Field(default=None, alias="convicção")


class ConstitutionFrontmatter(NodeFrontmatter):
    node_type: Literal["constitution"] = "constitution"


class AxiomFrontmatter(NodeFrontmatter):
    node_type: Literal["axiom"] = "axiom"
    veracidade: str | None = None
    convicção: str | None = Field(default=None, alias="convicção")


class ConceptualFrontmatter(NodeFrontmatter):
    node_type: Literal["conceptual"] = "conceptual"


class DiscoveryFrontmatter(NodeFrontmatter):
    node_type: Literal["discovery"] = "discovery"
    veracidade: str | None = None
    convicção: str | None = Field(default=None, alias="convicção")


class SessionFrontmatter(NodeFrontmatter):
    node_type: Literal["discovery"] = "discovery"  # sessions are discovery + is_session
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


_FRONTMATTER_BY_TYPE: dict[str, type[BaseModel]] = {
    "premise": PremiseFrontmatter,
    "constitution": ConstitutionFrontmatter,
    "axiom": AxiomFrontmatter,
    "conceptual": ConceptualFrontmatter,
    "discovery": DiscoveryFrontmatter,
    "session": SessionFrontmatter,
}


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
    except yaml.YAMLError:
        return None, text


def validate_node(fm: dict[str, Any]) -> BaseModel:
    """Dispatch on node_type and return the validated model.

    Raises pydantic.ValidationError on schema violation.
    """
    node_type = fm.get("node_type")
    is_session = bool(fm.get("is_session"))
    if is_session:
        return SessionFrontmatter.model_validate(fm)
    cls = _FRONTMATTER_BY_TYPE.get(str(node_type), NodeFrontmatter)
    return cls.model_validate(fm)
