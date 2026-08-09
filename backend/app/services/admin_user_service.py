import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.exceptions import ResourceNotFoundError
from app.models import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import AdminUserUpdate


class AdminUserService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._users = UserRepository(session)

    async def list(self, page: int, page_size: int) -> tuple[list[User], int]:
        return await self._users.list((page - 1) * page_size, page_size)

    async def get(self, user_id: uuid.UUID) -> User:
        user = await self._users.get_by_id(user_id)
        if user is None:
            raise ResourceNotFoundError("User was not found.")
        return user

    async def update(self, user_id: uuid.UUID, user_in: AdminUserUpdate) -> User:
        user = await self.get(user_id)
        for field, value in user_in.model_dump(exclude_unset=True).items():
            setattr(user, field, value)
        await self._session.commit()
        await self._session.refresh(user)
        return user
