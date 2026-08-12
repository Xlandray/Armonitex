from functools import lru_cache

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Validated runtime configuration loaded from the environment."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    jwt_secret_key: SecretStr
    jwt_access_token_expire_minutes: int = 30
    jwt_reset_token_expire_minutes: int = 30
    jwt_algorithm: str = "HS256"
    storage_dir: str = "/app/storage"
    cors_allowed_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = "noreply@armonitex.com.tr"
    smtp_password: SecretStr = SecretStr("change-me-in-production")
    emails_from_email: str = "noreply@armonitex.com.tr"
    emails_from_name: str = "Armonitex Corporate"

    @field_validator("database_url")
    @classmethod
    def validate_async_database_url(cls, value: str) -> str:
        if not value.startswith("postgresql+asyncpg://"):
            message = "DATABASE_URL must use the postgresql+asyncpg:// scheme."
            raise ValueError(message)
        return value

    @field_validator("jwt_secret_key")
    @classmethod
    def validate_jwt_secret(cls, value: SecretStr) -> SecretStr:
        if len(value.get_secret_value()) < 32:
            message = "JWT_SECRET_KEY must contain at least 32 characters."
            raise ValueError(message)
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
