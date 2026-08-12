import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import Field

from app.schemas.base import Schema
from app.schemas.project import ProjectBrief

FINANCIAL_TYPES = ("quote", "invoice")

# Sort keys accepted by GET /admin/financial-records. Every key here must have a
# matching column in FinancialRecordRepository.SORT_COLUMNS.
FinancialRecordSort = Literal[
    "created_at",
    "-created_at",
    "issue_date",
    "-issue_date",
    "due_date",
    "-due_date",
    "amount",
    "-amount",
]
QUOTE_STATUSES = ("bekliyor", "onaylandi", "reddedildi")
INVOICE_STATUSES = ("bekliyor", "odendi", "gecikti")


class FinancialRecordCreate(Schema):
    project_id: uuid.UUID
    type: str
    number: str = Field(min_length=1, max_length=64)
    amount: Decimal = Field(ge=0, max_digits=12, decimal_places=2)
    currency: str = Field(default="TRY", min_length=3, max_length=3)
    status: str
    issue_date: date | None = None
    due_date: date | None = None
    document_id: uuid.UUID | None = None


class FinancialRecordUpdate(Schema):
    number: str | None = Field(default=None, min_length=1, max_length=64)
    amount: Decimal | None = Field(default=None, ge=0, max_digits=12, decimal_places=2)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    status: str | None = None
    issue_date: date | None = None
    due_date: date | None = None
    document_id: uuid.UUID | None = None


class FinancialRecordRead(Schema):
    id: uuid.UUID
    project_id: uuid.UUID
    type: str
    number: str
    amount: Decimal
    currency: str
    status: str
    issue_date: date | None
    due_date: date | None
    document_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime


class AdminFinancialRecordRead(FinancialRecordRead):
    """Admin-only view; the project relationship must be eager-loaded.

    Kept separate from FinancialRecordRead so the customer portal, which shares
    that schema, keeps returning exactly what it returned before.
    """

    project: ProjectBrief
