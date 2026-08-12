import uuid
from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.base import Schema
from app.schemas.user import UserBrief

PROJECT_STATUSES = ("teklif", "onaylandi", "uretimde", "tamamlandi", "iptal")

# Sort keys accepted by GET /admin/projects. Every key here must have a matching
# column in ProjectRepository.SORT_COLUMNS.
ProjectSort = Literal["created_at", "-created_at", "title", "-title", "status", "-status"]


class ProjectCreate(Schema):
    customer_id: uuid.UUID
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    reference_no: str | None = Field(default=None, max_length=64)
    status: str = "teklif"


class ProjectUpdate(Schema):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    reference_no: str | None = Field(default=None, max_length=64)
    status: str | None = None


class ProjectRead(Schema):
    id: uuid.UUID
    customer_id: uuid.UUID
    title: str
    description: str | None
    reference_no: str | None
    status: str
    created_at: datetime
    updated_at: datetime


class ProjectBrief(Schema):
    """Just enough of a project to label and link to it from another resource."""

    id: uuid.UUID
    title: str
    reference_no: str | None


class AdminProjectRead(ProjectRead):
    """Admin-only view; the customer relationship must be eager-loaded.

    Kept separate from ProjectRead so the customer portal, which shares that
    schema, keeps returning exactly what it returned before.
    """

    customer: UserBrief
