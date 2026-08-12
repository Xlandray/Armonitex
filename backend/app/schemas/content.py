import uuid
from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.base import Schema

# Sort keys accepted by GET /admin/contents. Every key here must have a matching
# column in ContentRepository.SORT_COLUMNS.
ContentSort = Literal[
    "created_at", "-created_at", "updated_at", "-updated_at", "title", "-title"
]


class ContentCreate(Schema):
    title: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    body: str = Field(min_length=1)
    is_published: bool = False


class ContentUpdate(Schema):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    slug: str | None = Field(
        default=None, min_length=1, max_length=255, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$"
    )
    body: str | None = Field(default=None, min_length=1)
    is_published: bool | None = None


class ContentRead(Schema):
    id: uuid.UUID
    title: str
    slug: str
    body: str
    is_published: bool
    author_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
