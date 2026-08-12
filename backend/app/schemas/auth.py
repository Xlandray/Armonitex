from pydantic import Field

from app.schemas.base import Schema


class Token(Schema):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(Schema):
    subject: str = Field(min_length=1)


class ResetPasswordRequest(Schema):
    token: str = Field(min_length=1)
    new_password: str = Field(min_length=12, max_length=128)
