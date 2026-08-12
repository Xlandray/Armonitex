import uuid
from datetime import datetime

from pydantic import Field

from app.schemas.base import Schema

PROJECT_STATUSES = ("teklif", "onaylandi", "uretimde", "tamamlandi", "iptal")


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
