import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Document


class DocumentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, document_id: uuid.UUID) -> Document | None:
        return await self._session.get(Document, document_id)

    async def list_for_project(
        self, project_id: uuid.UUID, offset: int, limit: int
    ) -> tuple[list[Document], int]:
        base = select(Document).where(Document.project_id == project_id)
        result = await self._session.execute(
            base.order_by(Document.created_at.desc()).offset(offset).limit(limit)
        )
        total = await self._session.scalar(select(func.count()).select_from(base.subquery()))
        return list(result.scalars()), total or 0

    def add(self, document: Document) -> None:
        self._session.add(document)

    async def delete(self, document: Document) -> None:
        await self._session.delete(document)
