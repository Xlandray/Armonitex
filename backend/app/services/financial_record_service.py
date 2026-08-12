import uuid

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.exceptions import ResourceConflictError, ResourceNotFoundError
from app.models import FinancialRecord
from app.repositories.financial_record_repository import FinancialRecordRepository
from app.schemas.financial_record import (
    FINANCIAL_TYPES,
    INVOICE_STATUSES,
    QUOTE_STATUSES,
    FinancialRecordCreate,
    FinancialRecordUpdate,
)


class FinancialRecordService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._records = FinancialRecordRepository(session)

    async def list(self, page: int, page_size: int) -> tuple[list[FinancialRecord], int]:
        return await self._records.list((page - 1) * page_size, page_size)

    async def get(self, record_id: uuid.UUID) -> FinancialRecord:
        record = await self._records.get_by_id(record_id)
        if record is None:
            raise ResourceNotFoundError("Financial record was not found.")
        return record

    async def create(self, record_in: FinancialRecordCreate) -> FinancialRecord:
        if record_in.type not in FINANCIAL_TYPES:
            raise ResourceConflictError(f"Invalid financial record type: {record_in.type}.")
        self._validate_status(record_in.type, record_in.status)
        record = FinancialRecord(**record_in.model_dump())
        self._records.add(record)
        await self._commit(record)
        return record

    async def update(
        self, record_id: uuid.UUID, record_in: FinancialRecordUpdate
    ) -> FinancialRecord:
        record = await self.get(record_id)
        data = record_in.model_dump(exclude_unset=True)
        if "status" in data and data["status"] is not None:
            self._validate_status(record.type, data["status"])
        for field, value in data.items():
            setattr(record, field, value)
        await self._commit(record)
        return record

    async def delete(self, record_id: uuid.UUID) -> None:
        record = await self.get(record_id)
        await self._records.delete(record)
        await self._session.commit()

    def _validate_status(self, record_type: str, status: str) -> None:
        allowed = QUOTE_STATUSES if record_type == "quote" else INVOICE_STATUSES
        if status not in allowed:
            raise ResourceConflictError(
                f"Status '{status}' is not valid for type '{record_type}'."
            )

    async def _commit(self, record: FinancialRecord) -> None:
        try:
            await self._session.commit()
        except IntegrityError as error:
            await self._session.rollback()
            raise ResourceConflictError(
                "Record references a missing project or document."
            ) from error
        await self._session.refresh(record)
