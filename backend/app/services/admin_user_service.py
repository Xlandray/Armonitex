import uuid

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.domain.exceptions import EmailAlreadyRegisteredError, ResourceNotFoundError
from app.models import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import AdminUserCreate, AdminUserUpdate


class AdminUserService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._users = UserRepository(session)

    async def list(
        self,
        page: int,
        page_size: int,
        *,
        q: str | None = None,
        is_customer: bool | None = None,
        is_superuser: bool | None = None,
        is_active: bool | None = None,
        sort: str = "-created_at",
    ) -> tuple[list[User], int]:
        return await self._users.list(
            (page - 1) * page_size,
            page_size,
            q=q,
            is_customer=is_customer,
            is_superuser=is_superuser,
            is_active=is_active,
            sort=sort,
        )

    async def create(self, user_in: AdminUserCreate) -> User:
        user = User(
            email=str(user_in.email).casefold(),
            full_name=user_in.full_name,
            hashed_password=hash_password(user_in.password),
            is_customer=user_in.is_customer,
        )
        self._users.add(user)
        try:
            await self._session.commit()
        except IntegrityError as error:
            await self._session.rollback()
            raise EmailAlreadyRegisteredError(
                "A user with this email already exists."
            ) from error
        await self._session.refresh(user)
        return user

    async def get(self, user_id: uuid.UUID) -> User:
        user = await self._users.get_by_id(user_id)
        if user is None:
            raise ResourceNotFoundError("User was not found.")
        return user

    async def update(self, user_id: uuid.UUID, user_in: AdminUserUpdate) -> User:
        user = await self.get(user_id)
        data = user_in.model_dump(exclude_unset=True)
        password = data.pop("password", None)
        for field, value in data.items():
            setattr(user, field, value)
        if password is not None:
            user.hashed_password = hash_password(password)
        await self._session.commit()
        await self._session.refresh(user)
        return user
