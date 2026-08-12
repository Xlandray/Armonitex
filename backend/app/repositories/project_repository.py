from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Project


class ProjectRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, project_id: uuid.UUID) -> Project | None:
        return await self._session.get(Project, project_id)

    async def list(self, offset: int, limit: int) -> tuple[list[Project], int]:
        result = await self._session.execute(
            select(Project).order_by(Project.created_at.desc()).offset(offset).limit(limit)
        )
        total = await self._session.scalar(select(func.count()).select_from(Project))
        return list(result.scalars()), total or 0

    async def list_for_customer(
        self, customer_id: uuid.UUID, offset: int, limit: int
    ) -> tuple[list[Project], int]:
        base = select(Project).where(Project.customer_id == customer_id)
        result = await self._session.execute(
            base.order_by(Project.created_at.desc()).offset(offset).limit(limit)
        )
        total = await self._session.scalar(select(func.count()).select_from(base.subquery()))
        return list(result.scalars()), total or 0

    def add(self, project: Project) -> None:
        self._session.add(project)

    async def delete(self, project: Project) -> None:
        await self._session.delete(project)
