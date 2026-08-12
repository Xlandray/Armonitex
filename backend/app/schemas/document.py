import uuid
from datetime import datetime
from typing import Literal

from app.schemas.base import Schema

# Sort keys accepted by GET /admin/documents. Every key here must have a matching
# column in DocumentRepository.SORT_COLUMNS.
DocumentSort = Literal[
    "created_at",
    "-created_at",
    "original_filename",
    "-original_filename",
    "size_bytes",
    "-size_bytes",
]


class DocumentRead(Schema):
    id: uuid.UUID
    project_id: uuid.UUID
    original_filename: str
    content_type: str
    size_bytes: int
    created_at: datetime
