import uuid
from datetime import datetime

from app.schemas.base import Schema


class DocumentRead(Schema):
    id: uuid.UUID
    project_id: uuid.UUID
    original_filename: str
    content_type: str
    size_bytes: int
    created_at: datetime
