from typing import Generic, TypeVar

from pydantic import Field

from app.schemas.base import Schema

ItemT = TypeVar("ItemT")


class Page(Schema, Generic[ItemT]):
    data: list[ItemT]
    total: int = Field(ge=0)
