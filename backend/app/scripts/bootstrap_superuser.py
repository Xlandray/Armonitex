import asyncio
import os

from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import AsyncSessionLocal
from app.models import User


async def create_superuser() -> None:
    email_input = os.environ.get("ADMIN_EMAIL", "admin@armonitex.com.tr").strip()
    password = os.environ.get("ADMIN_PASSWORD", "Armonitex12345!")
    if not email_input or not password:
        message = "ADMIN_EMAIL and ADMIN_PASSWORD must be set."
        raise RuntimeError(message)
    if len(password) < 8:
        message = "ADMIN_PASSWORD must contain at least 8 characters."
        raise RuntimeError(message)

    try:
        email = str(TypeAdapter(EmailStr).validate_python(email_input)).casefold()
    except ValidationError as error:
        message = "ADMIN_EMAIL must be a valid email address."
        raise RuntimeError(message) from error

    async with AsyncSessionLocal() as session:
        existing = await session.scalar(select(User).where(User.email == email))
        if existing is not None:
            existing.hashed_password = hash_password(password)
            existing.is_active = True
            existing.is_superuser = True
            await session.commit()
            print(f"Superuser password updated: {email}")
            return

        session.add(
            User(
                email=email,
                hashed_password=hash_password(password),
                is_active=True,
                is_superuser=True,
            )
        )
        await session.commit()
        print(f"Superuser created: {email}")


if __name__ == "__main__":
    asyncio.run(create_superuser())
