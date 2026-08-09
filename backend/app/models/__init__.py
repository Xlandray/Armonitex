"""Import all models so Alembic can discover their metadata."""

from app.models.content import Content
from app.models.setting import Setting
from app.models.user import User

__all__ = ["Content", "Setting", "User"]
