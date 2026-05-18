"""Amendment-log frontmatter schema.

Per `vault/constitution/schema-amendment-discipline-constitution.md`, every
schema document change is recorded as a file under `vault/amendments/` whose
frontmatter validates against `AmendmentFrontmatter` below.
"""

from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ChangeType = Literal["schema_version_bump", "document_version_bump"]
ReviewState = Literal["true", "false", "pending"]


class AmendmentTrigger(BaseModel):
    model_config = ConfigDict(extra="forbid")
    session: str | None = None
    discovery: str | None = None
    falsified_premise: str | None = None


class AmendmentReview(BaseModel):
    model_config = ConfigDict(extra="forbid")
    validator_passed: bool | Literal["pending"] = "pending"
    snapshot_tag: str | None = None


class AmendmentFrontmatter(BaseModel):
    """Frontmatter for files under `vault/amendments/YYYY-MM-DD-<slug>.md`."""

    model_config = ConfigDict(extra="allow", populate_by_name=True)

    amendment_id: str
    date: date | str
    schema_document: str = Field(
        description="Vault-relative path to the amended schema document",
    )
    change_type: ChangeType
    old_version: str
    new_version: str
    trigger: AmendmentTrigger
    dependents: list[str] = Field(default_factory=list)
    review: AmendmentReview = Field(default_factory=AmendmentReview)
    author: str

    def is_schema_bump(self) -> bool:
        return self.change_type == "schema_version_bump"
