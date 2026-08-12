from __future__ import annotations

import uuid

from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy.sql.elements import ColumnElement

from app.models import Content
from app.repositories._paging import paginate, sort_clause

SORT_COLUMNS: dict[str, InstrumentedAttribute] = {
    "created_at": Content.created_at,
    "updated_at": Content.updated_at,
    "title": Content.title,
}


class ContentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, content_id: uuid.UUID) -> Content | None:
        return await self._session.get(Content, content_id)

    async def list(
        self,
        offset: int,
        limit: int,
        *,
        q: str | None = None,
        is_published: bool | None = None,
        sort: str = "-created_at",
    ) -> tuple[list[Content], int]:
        conditions: list[ColumnElement[bool]] = []
        if q:
            like = f"%{q}%"
            conditions.append(or_(Content.title.ilike(like), Content.slug.ilike(like)))
        if is_published is not None:
            conditions.append(Content.is_published.is_(is_published))
        return await paginate(
            self._session,
            Content,
            conditions=conditions,
            order_by=sort_clause(SORT_COLUMNS, sort),
            offset=offset,
            limit=limit,
        )

    def add(self, content: Content) -> None:
        self._session.add(content)

    async def delete(self, content: Content) -> None:
        await self._session.delete(content)
