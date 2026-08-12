"""Import all models so Alembic can discover their metadata."""

from app.models.content import Content
from app.models.document import Document
from app.models.financial_record import FinancialRecord
from app.models.project import Project
from app.models.setting import Setting
from app.models.user import User

__all__ = ["Content", "Document", "FinancialRecord", "Project", "Setting", "User"]
