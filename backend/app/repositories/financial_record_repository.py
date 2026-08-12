from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, selectinload
from sqlalchemy.sql.elements import ColumnElement

from app.models import FinancialRecord
from app.repositories._paging import paginate, sort_clause

SORT_COLUMNS: dict[str, InstrumentedAttribute] = {
    "created_at": FinancialRecord.created_at,
    "issue_date": FinancialRecord.issue_date,
    "due_date": FinancialRecord.due_date,
    "amount": FinancialRecord.amount,
}


class FinancialRecordRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, record_id: uuid.UUID) -> FinancialRecord | None:
        return await self._session.get(FinancialRecord, record_id)

    async def list(
        self,
        offset: int,
        limit: int,
        *,
        q: str | None = None,
        type: str | None = None,
        status: str | None = None,
        project_id: uuid.UUID | None = None,
        sort: str = "-created_at",
    ) -> tuple[list[FinancialRecord], int]:
        conditions: list[ColumnElement[bool]] = []
        if q:
            conditions.append(FinancialRecord.number.ilike(f"%{q}%"))
        if type:
            conditions.append(FinancialRecord.type == type)
        if status:
            conditions.append(FinancialRecord.status == status)
        if project_id:
            conditions.append(FinancialRecord.project_id == project_id)
        # Eager load for the same reason as ProjectRepository.list: the admin list
        # renders the project label and async SQLAlchemy cannot lazy-load it later.
        return await paginate(
            self._session,
            FinancialRecord,
            conditions=conditions,
            order_by=sort_clause(SORT_COLUMNS, sort),
            options=(selectinload(FinancialRecord.project),),
            offset=offset,
            limit=limit,
        )

    async def list_for_project(
        self, project_id: uuid.UUID, offset: int, limit: int
    ) -> tuple[list[FinancialRecord], int]:
        base = select(FinancialRecord).where(FinancialRecord.project_id == project_id)
        result = await self._session.execute(
            base.order_by(FinancialRecord.created_at.desc()).offset(offset).limit(limit)
        )
        total = await self._session.scalar(select(func.count()).select_from(base.subquery()))
        return list(result.scalars()), total or 0

    def add(self, record: FinancialRecord) -> None:
        self._session.add(record)

    async def delete(self, record: FinancialRecord) -> None:
        await self._session.delete(record)
