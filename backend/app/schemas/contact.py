from pydantic import EmailStr, Field

from app.schemas.base import Schema


class ContactCreate(Schema):
    full_name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    message: str = Field(min_length=1)


class ContactResponse(Schema):
    status: str
    message: str
