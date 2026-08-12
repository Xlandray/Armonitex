import uuid

from fastapi import UploadFile
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import storage
from app.domain.exceptions import ResourceConflictError, ResourceNotFoundError
from app.models import Document
from app.repositories.document_repository import DocumentRepository


class DocumentService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._documents = DocumentRepository(session)

    async def get(self, document_id: uuid.UUID) -> Document:
        document = await self._documents.get_by_id(document_id)
        if document is None:
            raise ResourceNotFoundError("Document was not found.")
        return document

    async def list_for_project(
        self, project_id: uuid.UUID, page: int, page_size: int
    ) -> tuple[list[Document], int]:
        return await self._documents.list_for_project(
            project_id, (page - 1) * page_size, page_size
        )

    async def create(
        self, project_id: uuid.UUID, file: UploadFile, uploaded_by: uuid.UUID
    ) -> Document:
        stored_path, size = await storage.save_upload(file)
        document = Document(
            project_id=project_id,
            original_filename=file.filename or stored_path,
            stored_path=stored_path,
            content_type=file.content_type or "application/octet-stream",
            size_bytes=size,
            uploaded_by=uploaded_by,
        )
        self._documents.add(document)
        try:
            await self._session.commit()
        except IntegrityError as error:
            await self._session.rollback()
            storage.delete_file(stored_path)
            raise ResourceConflictError("Document references a missing project.") from error
        await self._session.refresh(document)
        return document

    async def delete(self, document_id: uuid.UUID) -> None:
        document = await self.get(document_id)
        stored_path = document.stored_path
        await self._documents.delete(document)
        await self._session.commit()
        storage.delete_file(stored_path)
