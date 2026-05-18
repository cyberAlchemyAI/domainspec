"""vault_common — the shared kernel.

All subsystems depend on this. Nothing in this package depends on a subsystem.
Per `vault/constitution/frontmatter-ownership-constitution.md`, the frontmatter
Pydantic models in `vault_common.frontmatter` are the *only* authoritative schema
for vault nodes.
"""

from .config import Config, DEFAULT_CONFIG
from .walker import VaultDoc, walk_vault, parse_doc
from .frontmatter import (
    NodeFrontmatter, PremiseFrontmatter, ConstitutionFrontmatter,
    AxiomFrontmatter, ConceptualFrontmatter, DiscoveryFrontmatter,
    ImplementationPlanFrontmatter, SpecFrontmatter, AuditFrontmatter,
    TestFrontmatter, BacklogFrontmatter, ReadmeFrontmatter,
    ResearchFrontmatter, DomainspecSubagentsStrategyFrontmatter,
    SubagentsResearchFrontmatter, SubagentsFindingsFrontmatter,
    DiscussionFrontmatter,
    SessionFrontmatter, LensFrontmatter,
    KNOWN_NODE_TYPES, UnknownNodeTypeError,
    parse_frontmatter, validate_node,
)
from .edges import Edge, EDGE_TYPES, extract_edges
from .sqlite import open_db
from .embedder import Embedder
from .events import EventSink

__all__ = [
    "Config", "DEFAULT_CONFIG",
    "VaultDoc", "walk_vault", "parse_doc",
    "NodeFrontmatter", "PremiseFrontmatter", "ConstitutionFrontmatter",
    "AxiomFrontmatter", "ConceptualFrontmatter", "DiscoveryFrontmatter",
    "ImplementationPlanFrontmatter", "SpecFrontmatter", "AuditFrontmatter",
    "TestFrontmatter", "BacklogFrontmatter", "ReadmeFrontmatter",
    "ResearchFrontmatter", "DomainspecSubagentsStrategyFrontmatter",
    "SubagentsResearchFrontmatter", "SubagentsFindingsFrontmatter",
    "DiscussionFrontmatter",
    "SessionFrontmatter", "LensFrontmatter",
    "KNOWN_NODE_TYPES", "UnknownNodeTypeError",
    "parse_frontmatter", "validate_node",
    "Edge", "EDGE_TYPES", "extract_edges",
    "open_db",
    "Embedder",
    "EventSink",
]

__version__ = "0.1.0"
