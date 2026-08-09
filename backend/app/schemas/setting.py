import uuid
from datetime import datetime

from pydantic import Field, JsonValue

from app.schemas.base import Schema


class SettingCreate(Schema):
    key: str = Field(min_length=1, max_length=100, pattern=r"^[a-z][a-z0-9_]*$")
    value: dict[str, JsonValue]
    description: str | None = Field(default=None, min_length=1, max_length=255)


class SettingUpdate(Schema):
    value: dict[str, JsonValue] | None = None
    description: str | None = Field(default=None, min_length=1, max_length=255)


class SettingRead(Schema):
    id: uuid.UUID
    key: str
    value: dict[str, JsonValue]
    description: str | None
    created_at: datetime
    updated_at: datetime
