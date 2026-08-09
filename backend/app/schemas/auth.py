from pydantic import Field

from app.schemas.base import Schema


class Token(Schema):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(Schema):
    subject: str = Field(min_length=1)
