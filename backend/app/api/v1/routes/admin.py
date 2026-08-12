import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status

from app.api.deps import CurrentSuperuser, SessionDep, get_current_superuser
from app.domain.exceptions import (
    EmailAlreadyRegisteredError,
    ResourceConflictError,
    ResourceNotFoundError,
)
from app.schemas import (
    AdminUserCreate,
    AdminUserUpdate,
    ContentCreate,
    ContentRead,
    ContentUpdate,
    DocumentRead,
    FinancialRecordCreate,
    FinancialRecordRead,
    FinancialRecordUpdate,
    Page,
    ProjectCreate,
    ProjectRead,
    ProjectUpdate,
    SettingCreate,
    SettingRead,
    SettingUpdate,
    UserRead,
)
from app.services.admin_user_service import AdminUserService
from app.services.content_service import ContentService
from app.services.document_service import DocumentService
from app.services.financial_record_service import FinancialRecordService
from app.services.project_service import ProjectService
from app.services.setting_service import SettingService

router = APIRouter(dependencies=[Depends(get_current_superuser)])
PageNumber = Annotated[int, Query(ge=1)]
PageSize = Annotated[int, Query(ge=1, le=100)]


def not_found(error: ResourceNotFoundError) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


def conflict(error: ResourceConflictError) -> HTTPException:
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error))


@router.get("/users", response_model=Page[UserRead])
async def list_users(
    session: SessionDep, page: PageNumber = 1, page_size: PageSize = 25
) -> Page[UserRead]:
    data, total = await AdminUserService(session).list(page, page_size)
    return Page(data=[UserRead.model_validate(u) for u in data], total=total)


@router.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: AdminUserCreate, session: SessionDep) -> UserRead:
    try:
        user = await AdminUserService(session).create(user_in)
        return UserRead.model_validate(user)
    except EmailAlreadyRegisteredError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error


@router.patch("/users/{user_id}", response_model=UserRead)
async def update_user(
    user_id: uuid.UUID, user_in: AdminUserUpdate, session: SessionDep
) -> UserRead:
    try:
        user = await AdminUserService(session).update(user_id, user_in)
        return UserRead.model_validate(user)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.get("/users/{user_id}", response_model=UserRead)
async def get_user(user_id: uuid.UUID, session: SessionDep) -> UserRead:
    try:
        user = await AdminUserService(session).get(user_id)
        return UserRead.model_validate(user)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.get("/contents", response_model=Page[ContentRead])
async def list_contents(
    session: SessionDep, page: PageNumber = 1, page_size: PageSize = 25
) -> Page[ContentRead]:
    data, total = await ContentService(session).list(page, page_size)
    return Page(data=[ContentRead.model_validate(c) for c in data], total=total)


@router.post("/contents", response_model=ContentRead, status_code=status.HTTP_201_CREATED)
async def create_content(
    content_in: ContentCreate, session: SessionDep, current_user: CurrentSuperuser
) -> ContentRead:
    try:
        content = await ContentService(session).create(content_in, current_user.id)
        return ContentRead.model_validate(content)
    except ResourceConflictError as error:
        raise conflict(error) from error


@router.get("/contents/{content_id}", response_model=ContentRead)
async def get_content(content_id: uuid.UUID, session: SessionDep) -> ContentRead:
    try:
        content = await ContentService(session).get(content_id)
        return ContentRead.model_validate(content)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.patch("/contents/{content_id}", response_model=ContentRead)
async def update_content(
    content_id: uuid.UUID, content_in: ContentUpdate, session: SessionDep
) -> ContentRead:
    try:
        content = await ContentService(session).update(content_id, content_in)
        return ContentRead.model_validate(content)
    except ResourceNotFoundError as error:
        raise not_found(error) from error
    except ResourceConflictError as error:
        raise conflict(error) from error


@router.delete("/contents/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_content(content_id: uuid.UUID, session: SessionDep) -> None:
    try:
        await ContentService(session).delete(content_id)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.get("/settings", response_model=Page[SettingRead])
async def list_settings(
    session: SessionDep, page: PageNumber = 1, page_size: PageSize = 25
) -> Page[SettingRead]:
    data, total = await SettingService(session).list(page, page_size)
    return Page(data=[SettingRead.model_validate(s) for s in data], total=total)


@router.post("/settings", response_model=SettingRead, status_code=status.HTTP_201_CREATED)
async def create_setting(setting_in: SettingCreate, session: SessionDep) -> SettingRead:
    try:
        setting = await SettingService(session).create(setting_in)
        return SettingRead.model_validate(setting)
    except ResourceConflictError as error:
        raise conflict(error) from error


@router.get("/settings/{setting_id}", response_model=SettingRead)
async def get_setting(setting_id: uuid.UUID, session: SessionDep) -> SettingRead:
    try:
        setting = await SettingService(session).get(setting_id)
        return SettingRead.model_validate(setting)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.patch("/settings/{setting_id}", response_model=SettingRead)
async def update_setting(
    setting_id: uuid.UUID, setting_in: SettingUpdate, session: SessionDep
) -> SettingRead:
    try:
        setting = await SettingService(session).update(setting_id, setting_in)
        return SettingRead.model_validate(setting)
    except ResourceNotFoundError as error:
        raise not_found(error) from error
    except ResourceConflictError as error:
        raise conflict(error) from error


@router.delete("/settings/{setting_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_setting(setting_id: uuid.UUID, session: SessionDep) -> None:
    try:
        await SettingService(session).delete(setting_id)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.get("/projects", response_model=Page[ProjectRead])
async def list_projects(
    session: SessionDep, page: PageNumber = 1, page_size: PageSize = 25
) -> Page[ProjectRead]:
    data, total = await ProjectService(session).list(page, page_size)
    return Page(data=[ProjectRead.model_validate(p) for p in data], total=total)


@router.post("/projects", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project(project_in: ProjectCreate, session: SessionDep) -> ProjectRead:
    try:
        project = await ProjectService(session).create(project_in)
        return ProjectRead.model_validate(project)
    except ResourceConflictError as error:
        raise conflict(error) from error


@router.get("/projects/{project_id}", response_model=ProjectRead)
async def get_project(project_id: uuid.UUID, session: SessionDep) -> ProjectRead:
    try:
        project = await ProjectService(session).get(project_id)
        return ProjectRead.model_validate(project)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.patch("/projects/{project_id}", response_model=ProjectRead)
async def update_project(
    project_id: uuid.UUID, project_in: ProjectUpdate, session: SessionDep
) -> ProjectRead:
    try:
        project = await ProjectService(session).update(project_id, project_in)
        return ProjectRead.model_validate(project)
    except ResourceNotFoundError as error:
        raise not_found(error) from error
    except ResourceConflictError as error:
        raise conflict(error) from error


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: uuid.UUID, session: SessionDep) -> None:
    try:
        await ProjectService(session).delete(project_id)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.get("/financial-records", response_model=Page[FinancialRecordRead])
async def list_financial_records(
    session: SessionDep, page: PageNumber = 1, page_size: PageSize = 25
) -> Page[FinancialRecordRead]:
    data, total = await FinancialRecordService(session).list(page, page_size)
    return Page(data=[FinancialRecordRead.model_validate(r) for r in data], total=total)


@router.post(
    "/financial-records", response_model=FinancialRecordRead, status_code=status.HTTP_201_CREATED
)
async def create_financial_record(
    record_in: FinancialRecordCreate, session: SessionDep
) -> FinancialRecordRead:
    try:
        record = await FinancialRecordService(session).create(record_in)
        return FinancialRecordRead.model_validate(record)
    except ResourceConflictError as error:
        raise conflict(error) from error


@router.get("/financial-records/{record_id}", response_model=FinancialRecordRead)
async def get_financial_record(record_id: uuid.UUID, session: SessionDep) -> FinancialRecordRead:
    try:
        record = await FinancialRecordService(session).get(record_id)
        return FinancialRecordRead.model_validate(record)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.patch("/financial-records/{record_id}", response_model=FinancialRecordRead)
async def update_financial_record(
    record_id: uuid.UUID, record_in: FinancialRecordUpdate, session: SessionDep
) -> FinancialRecordRead:
    try:
        record = await FinancialRecordService(session).update(record_id, record_in)
        return FinancialRecordRead.model_validate(record)
    except ResourceNotFoundError as error:
        raise not_found(error) from error
    except ResourceConflictError as error:
        raise conflict(error) from error


@router.delete("/financial-records/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_financial_record(record_id: uuid.UUID, session: SessionDep) -> None:
    try:
        await FinancialRecordService(session).delete(record_id)
    except ResourceNotFoundError as error:
        raise not_found(error) from error


@router.get("/documents", response_model=Page[DocumentRead])
async def list_documents(
    session: SessionDep,
    project_id: uuid.UUID,
    page: PageNumber = 1,
    page_size: PageSize = 25,
) -> Page[DocumentRead]:
    data, total = await DocumentService(session).list_for_project(project_id, page, page_size)
    return Page(data=[DocumentRead.model_validate(d) for d in data], total=total)


@router.post("/documents", response_model=DocumentRead, status_code=status.HTTP_201_CREATED)
async def upload_document(
    session: SessionDep,
    current_user: CurrentSuperuser,
    project_id: Annotated[uuid.UUID, Form()],
    file: Annotated[UploadFile, File()],
) -> DocumentRead:
    try:
        document = await DocumentService(session).create(project_id, file, current_user.id)
        return DocumentRead.model_validate(document)
    except ResourceConflictError as error:
        raise conflict(error) from error


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(document_id: uuid.UUID, session: SessionDep) -> None:
    try:
        await DocumentService(session).delete(document_id)
    except ResourceNotFoundError as error:
        raise not_found(error) from error
