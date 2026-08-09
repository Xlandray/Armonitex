from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr

from app.api.deps import SessionDep
from app.core.email import send_email
from app.core.security import create_access_token
from app.domain.exceptions import InvalidCredentialsError
from app.schemas.auth import Token
from app.schemas.base import Schema
from app.services.user_service import UserService

router = APIRouter()


class ForgotPasswordRequest(Schema):
    email: EmailStr


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep,
) -> Token:
    """Exchange valid credentials for a short-lived OAuth2 bearer token."""

    try:
        user = await UserService(session).authenticate(form_data.username, form_data.password)
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error

    return Token(access_token=create_access_token(str(user.id)))


@router.post("/forgot-password")
async def request_password_reset(
    request_in: ForgotPasswordRequest,
    session: SessionDep,
) -> dict[str, str]:
    """Sends a password reset link to user's email if registered."""
    try:
        user = await UserService(session).get_by_email(request_in.email)
        if user:
            reset_token = create_access_token(str(user.id))
            reset_url = f"https://armonitex.com.tr/auth/reset-password?token={reset_token}"
            subject = "Armonitex Şifre Sıfırlama Talebi"
            body = (
                f"Merhaba {user.full_name},\n\n"
                f"Hesabınız için şifre sıfırlama talebi alındı.\n"
                f"Aşağıdaki bağlantıyı kullanarak şifrenizi sıfırlayabilirsiniz:\n"
                f"{reset_url}\n\n"
                f"Bu talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayın.\n\n"
                f"Saygılarımızla,\nArmonitex Ekibi"
            )
            await send_email(to_email=user.email, subject=subject, body=body)
    except Exception:
        pass

    return {"message": "Sıfırlama talimatları e-posta adresinize gönderildi."}
