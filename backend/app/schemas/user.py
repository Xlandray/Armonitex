import uuid
from datetime import datetime
from typing import Literal

from pydantic import EmailStr, Field

from app.schemas.base import Schema

# Sort keys accepted by GET /admin/users. Every key here must have a matching
# column in UserRepository.SORT_COLUMNS.
UserSort = Literal["created_at", "-created_at", "email", "-email"]


class UserCreate(Schema):
    email: EmailStr
    full_name: str | None = Field(default=None, min_length=1, max_length=150)
    password: str = Field(min_length=12, max_length=128)


class UserUpdate(Schema):
    full_name: str | None = Field(default=None, min_length=1, max_length=150)
    is_active: bool | None = None


class AdminUserCreate(Schema):
    email: EmailStr
    full_name: str | None = Field(default=None, min_length=1, max_length=150)
    password: str = Field(min_length=12, max_length=128)
    is_customer: bool = True


class AdminUserUpdate(Schema):
    full_name: str | None = Field(default=None, min_length=1, max_length=150)
    is_active: bool | None = None
    is_superuser: bool | None = None
    is_customer: bool | None = None
    password: str | None = Field(default=None, min_length=12, max_length=128)


class UserRead(Schema):
    id: uuid.UUID
    email: EmailStr
    full_name: str | None
    is_active: bool
    is_superuser: bool
    is_customer: bool
    created_at: datetime
    updated_at: datetime


class UserBrief(Schema):
    """Just enough of a user to label and link to it from another resource."""

    id: uuid.UUID
    email: EmailStr
    full_name: str | None
