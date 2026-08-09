from pydantic import BaseModel, ConfigDict


class Schema(BaseModel):
    """Strict DTO base class for requests and ORM-backed responses."""

    model_config = ConfigDict(extra="forbid", from_attributes=True, str_strip_whitespace=True)
