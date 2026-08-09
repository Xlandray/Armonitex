from datetime import datetime

from sqlalchemy import DateTime, FetchedValue, text
from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    """Adds database-managed creation and update timestamps to a model."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=FetchedValue(),
    )
