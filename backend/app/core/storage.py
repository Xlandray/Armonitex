import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import get_settings

_CHUNK = 1024 * 1024


def _root() -> Path:
    root = Path(get_settings().storage_dir).resolve()
    root.mkdir(parents=True, exist_ok=True)
    return root


async def save_upload(file: UploadFile) -> tuple[str, int]:
    """Store an upload under a UUID name. Returns (relative_path, size_bytes)."""
    root = _root()
    suffix = Path(file.filename or "").suffix
    rel_name = f"{uuid.uuid4().hex}{suffix}"
    dest = root / rel_name
    size = 0
    with dest.open("wb") as out:
        while chunk := await file.read(_CHUNK):
            size += out.write(chunk)
    return rel_name, size


def resolve_path(stored_path: str) -> Path:
    """Resolve a stored relative path, rejecting traversal outside the root."""
    root = _root()
    full = (root / stored_path).resolve()
    if not full.is_relative_to(root):
        raise ValueError("Resolved path escapes the storage root.")
    return full


def delete_file(stored_path: str) -> None:
    resolve_path(stored_path).unlink(missing_ok=True)
