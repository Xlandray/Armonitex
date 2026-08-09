import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Content


class ContentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, content_id: uuid.UUID) -> Content | None:
        return await self._session.get(Content, content_id)

    async def list(self, offset: int, limit: int) -> tuple[list[Content], int]:
        result = await self._session.execute(
            select(Content).order_by(Content.created_at.desc()).offset(offset).limit(limit)
        )
        total = await self._session.scalar(select(func.count()).select_from(Content))
        return list(result.scalars()), total or 0

    def add(self, content: Content) -> None:
        self._session.add(content)

    async def delete(self, content: Content) -> None:
        await self._session.delete(content)
