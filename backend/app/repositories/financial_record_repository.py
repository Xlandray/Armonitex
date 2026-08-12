from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import FinancialRecord


class FinancialRecordRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, record_id: uuid.UUID) -> FinancialRecord | None:
        return await self._session.get(FinancialRecord, record_id)

    async def list(self, offset: int, limit: int) -> tuple[list[FinancialRecord], int]:
        result = await self._session.execute(
            select(FinancialRecord)
            .order_by(FinancialRecord.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        total = await self._session.scalar(select(func.count()).select_from(FinancialRecord))
        return list(result.scalars()), total or 0

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
