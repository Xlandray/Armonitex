import uuid
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import FileResponse

from app.api.deps import CurrentCustomer, SessionDep
from app.core import storage
from app.domain.exceptions import ResourceNotFoundError
from app.schemas import (
    DocumentRead,
    FinancialRecordRead,
    Page,
    ProjectRead,
    UserRead,
)
from app.services.portal_service import PortalService

router = APIRouter()
PageNumber = Annotated[int, Query(ge=1)]
PageSize = Annotated[int, Query(ge=1, le=100)]


def _not_found(error: ResourceNotFoundError) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


@router.get("/me", response_model=UserRead)
async def read_me(current_customer: CurrentCustomer) -> UserRead:
    return UserRead.model_validate(current_customer)


@router.get("/projects", response_model=Page[ProjectRead])
async def list_projects(
    session: SessionDep,
    current_customer: CurrentCustomer,
    page: PageNumber = 1,
    page_size: PageSize = 25,
) -> Page[ProjectRead]:
    data, total = await PortalService(session).list_projects(current_customer.id, page, page_size)
    return Page(data=[ProjectRead.model_validate(p) for p in data], total=total)


@router.get("/projects/{project_id}", response_model=ProjectRead)
async def get_project(
    project_id: uuid.UUID, session: SessionDep, current_customer: CurrentCustomer
) -> ProjectRead:
    try:
        project = await PortalService(session).get_project(current_customer.id, project_id)
        return ProjectRead.model_validate(project)
    except ResourceNotFoundError as error:
        raise _not_found(error) from error


@router.get("/financial-records", response_model=Page[FinancialRecordRead])
async def list_financial_records(
    session: SessionDep,
    current_customer: CurrentCustomer,
    project_id: uuid.UUID,
    page: PageNumber = 1,
    page_size: PageSize = 25,
) -> Page[FinancialRecordRead]:
    try:
        data, total = await PortalService(session).list_financial_records(
            current_customer.id, project_id, page, page_size
        )
    except ResourceNotFoundError as error:
        raise _not_found(error) from error
    return Page(data=[FinancialRecordRead.model_validate(r) for r in data], total=total)


@router.get("/documents", response_model=Page[DocumentRead])
async def list_documents(
    session: SessionDep,
    current_customer: CurrentCustomer,
    project_id: uuid.UUID,
    page: PageNumber = 1,
    page_size: PageSize = 25,
) -> Page[DocumentRead]:
    try:
        data, total = await PortalService(session).list_documents(
            current_customer.id, project_id, page, page_size
        )
    except ResourceNotFoundError as error:
        raise _not_found(error) from error
    return Page(data=[DocumentRead.model_validate(d) for d in data], total=total)


@router.get("/documents/{document_id}/download")
async def download_document(
    document_id: uuid.UUID, session: SessionDep, current_customer: CurrentCustomer
) -> FileResponse:
    try:
        document = await PortalService(session).get_document_for_download(
            current_customer.id, document_id
        )
    except ResourceNotFoundError as error:
        raise _not_found(error) from error
    return FileResponse(
        path=storage.resolve_path(document.stored_path),
        media_type=document.content_type,
        filename=document.original_filename,
    )
