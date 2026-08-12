from __future__ import annotations

import uuid

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute, selectinload
from sqlalchemy.sql.elements import ColumnElement

from app.models import Project
from app.repositories._paging import paginate, sort_clause

SORT_COLUMNS: dict[str, InstrumentedAttribute] = {
    "created_at": Project.created_at,
    "title": Project.title,
    "status": Project.status,
}


class ProjectRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, project_id: uuid.UUID) -> Project | None:
        return await self._session.get(Project, project_id)

    async def get_by_id_with_customer(self, project_id: uuid.UUID) -> Project | None:
        result = await self._session.execute(
            select(Project).where(Project.id == project_id).options(selectinload(Project.customer))
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        offset: int,
        limit: int,
        *,
        q: str | None = None,
        status: str | None = None,
        customer_id: uuid.UUID | None = None,
        sort: str = "-created_at",
    ) -> tuple[list[Project], int]:
        conditions: list[ColumnElement[bool]] = []
        if q:
            like = f"%{q}%"
            conditions.append(or_(Project.title.ilike(like), Project.reference_no.ilike(like)))
        if status:
            conditions.append(Project.status == status)
        if customer_id:
            conditions.append(Project.customer_id == customer_id)
        # Async SQLAlchemy cannot lazy-load `customer` later, so the admin list
        # eager-loads it here; the portal uses list_for_customer and is unaffected.
        return await paginate(
            self._session,
            Project,
            conditions=conditions,
            order_by=sort_clause(SORT_COLUMNS, sort),
            options=(selectinload(Project.customer),),
            offset=offset,
            limit=limit,
        )

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
