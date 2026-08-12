import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

from app.models import Document
from app.repositories._paging import paginate, sort_clause

SORT_COLUMNS: dict[str, InstrumentedAttribute] = {
    "created_at": Document.created_at,
    "original_filename": Document.original_filename,
    "size_bytes": Document.size_bytes,
}


class DocumentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, document_id: uuid.UUID) -> Document | None:
        return await self._session.get(Document, document_id)

    async def list_for_project(
        self,
        project_id: uuid.UUID,
        offset: int,
        limit: int,
        *,
        sort: str = "-created_at",
    ) -> tuple[list[Document], int]:
        # Shared with the customer portal, unlike the other repositories' list().
        # The default sort reproduces the portal's previous ORDER BY exactly, so
        # only the admin route — which passes an explicit key — sees a change.
        return await paginate(
            self._session,
            Document,
            conditions=(Document.project_id == project_id,),
            order_by=sort_clause(SORT_COLUMNS, sort),
            offset=offset,
            limit=limit,
        )

    def add(self, document: Document) -> None:
        self._session.add(document)

    async def delete(self, document: Document) -> None:
        await self._session.delete(document)
