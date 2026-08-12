from __future__ import annotations

import uuid

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy.sql.elements import ColumnElement

from app.models import User
from app.repositories._paging import paginate, sort_clause

SORT_COLUMNS: dict[str, InstrumentedAttribute] = {
    "created_at": User.created_at,
    "email": User.email,
}


class UserRepository:
    """Database access for users; it contains no HTTP or business policy."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        result = await self._session.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        return await self._session.get(User, user_id)

    async def list(
        self,
        offset: int,
        limit: int,
        *,
        q: str | None = None,
        is_customer: bool | None = None,
        is_superuser: bool | None = None,
        is_active: bool | None = None,
        sort: str = "-created_at",
    ) -> tuple[list[User], int]:
        conditions: list[ColumnElement[bool]] = []
        if q:
            like = f"%{q}%"
            conditions.append(or_(User.email.ilike(like), User.full_name.ilike(like)))
        if is_customer is not None:
            conditions.append(User.is_customer.is_(is_customer))
        if is_superuser is not None:
            conditions.append(User.is_superuser.is_(is_superuser))
        if is_active is not None:
            conditions.append(User.is_active.is_(is_active))
        return await paginate(
            self._session,
            User,
            conditions=conditions,
            order_by=sort_clause(SORT_COLUMNS, sort),
            offset=offset,
            limit=limit,
        )

    def add(self, user: User) -> None:
        self._session.add(user)
