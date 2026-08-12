import uuid

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.exceptions import ResourceConflictError, ResourceNotFoundError
from app.models import Project
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import PROJECT_STATUSES, ProjectCreate, ProjectUpdate


class ProjectService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._projects = ProjectRepository(session)

    async def list(self, page: int, page_size: int) -> tuple[list[Project], int]:
        return await self._projects.list((page - 1) * page_size, page_size)

    async def get(self, project_id: uuid.UUID) -> Project:
        project = await self._projects.get_by_id(project_id)
        if project is None:
            raise ResourceNotFoundError("Project was not found.")
        return project

    async def create(self, project_in: ProjectCreate) -> Project:
        self._validate_status(project_in.status)
        project = Project(**project_in.model_dump())
        self._projects.add(project)
        await self._commit(project)
        return project

    async def update(self, project_id: uuid.UUID, project_in: ProjectUpdate) -> Project:
        project = await self.get(project_id)
        data = project_in.model_dump(exclude_unset=True)
        if "status" in data and data["status"] is not None:
            self._validate_status(data["status"])
        for field, value in data.items():
            setattr(project, field, value)
        await self._commit(project)
        return project

    async def delete(self, project_id: uuid.UUID) -> None:
        project = await self.get(project_id)
        await self._projects.delete(project)
        await self._session.commit()

    def _validate_status(self, status: str) -> None:
        if status not in PROJECT_STATUSES:
            raise ResourceConflictError(f"Invalid project status: {status}.")

    async def _commit(self, project: Project) -> None:
        try:
            await self._session.commit()
        except IntegrityError as error:
            await self._session.rollback()
            raise ResourceConflictError("Project references a missing customer.") from error
        await self._session.refresh(project)
