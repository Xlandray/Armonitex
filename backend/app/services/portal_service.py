import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.exceptions import ResourceNotFoundError
from app.models import Document, FinancialRecord, Project
from app.repositories.document_repository import DocumentRepository
from app.repositories.financial_record_repository import FinancialRecordRepository
from app.repositories.project_repository import ProjectRepository


class PortalService:
    """Read-only access for a logged-in customer; every query is ownership-scoped."""

    def __init__(self, session: AsyncSession) -> None:
        self._projects = ProjectRepository(session)
        self._records = FinancialRecordRepository(session)
        self._documents = DocumentRepository(session)

    async def list_projects(
        self, customer_id: uuid.UUID, page: int, page_size: int
    ) -> tuple[list[Project], int]:
        return await self._projects.list_for_customer(
            customer_id, (page - 1) * page_size, page_size
        )

    async def get_project(self, customer_id: uuid.UUID, project_id: uuid.UUID) -> Project:
        project = await self._projects.get_by_id(project_id)
        if project is None or project.customer_id != customer_id:
            raise ResourceNotFoundError("Project was not found.")
        return project

    async def list_financial_records(
        self, customer_id: uuid.UUID, project_id: uuid.UUID, page: int, page_size: int
    ) -> tuple[list[FinancialRecord], int]:
        await self.get_project(customer_id, project_id)  # ownership gate
        return await self._records.list_for_project(project_id, (page - 1) * page_size, page_size)

    async def list_documents(
        self, customer_id: uuid.UUID, project_id: uuid.UUID, page: int, page_size: int
    ) -> tuple[list[Document], int]:
        await self.get_project(customer_id, project_id)  # ownership gate
        return await self._documents.list_for_project(
            project_id, (page - 1) * page_size, page_size
        )

    async def get_document_for_download(
        self, customer_id: uuid.UUID, document_id: uuid.UUID
    ) -> Document:
        document = await self._documents.get_by_id(document_id)
        if document is None:
            raise ResourceNotFoundError("Document was not found.")
        await self.get_project(customer_id, document.project_id)  # ownership gate
        return document
