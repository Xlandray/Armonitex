from __future__ import annotations

import uuid

from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy.sql.elements import ColumnElement

from app.models import Setting
from app.repositories._paging import paginate, sort_clause

SORT_COLUMNS: dict[str, InstrumentedAttribute] = {
    "key": Setting.key,
    "created_at": Setting.created_at,
}


class SettingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, setting_id: uuid.UUID) -> Setting | None:
        return await self._session.get(Setting, setting_id)

    async def list(
        self,
        offset: int,
        limit: int,
        *,
        q: str | None = None,
        sort: str = "key",
    ) -> tuple[list[Setting], int]:
        conditions: list[ColumnElement[bool]] = []
        if q:
            like = f"%{q}%"
            conditions.append(or_(Setting.key.ilike(like), Setting.description.ilike(like)))
        return await paginate(
            self._session,
            Setting,
            conditions=conditions,
            order_by=sort_clause(SORT_COLUMNS, sort),
            offset=offset,
            limit=limit,
        )

    def add(self, setting: Setting) -> None:
        self._session.add(setting)

    async def delete(self, setting: Setting) -> None:
        await self._session.delete(setting)
