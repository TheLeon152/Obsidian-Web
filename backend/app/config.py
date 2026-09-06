from pathlib import Path

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


class Settings(BaseSettings):

    # ============================================================
    # Vault
    # ============================================================

    vault_path: Path

    # ============================================================
    # Calendar
    # ============================================================

    google_calendar_url: str

    # ============================================================
    # Vault folders
    # ============================================================

    inbox_folder: str = "00_Inbox"
    tasks_folder: str = "10_Tasks"

    # ============================================================
    # CORS
    # ============================================================

    cors_origins: list[str]

    # ============================================================
    # Authentication
    # ============================================================

    auth_username: str
    auth_password_hash: str

    jwt_secret_key: str

    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 30

    # ============================================================
    # Environment configuration
    # ============================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ============================================================
    # Validation
    # ============================================================

    def validate_vault(self) -> None:

        if not self.vault_path.exists():
            raise ValueError(
                f"Vault path does not exist: {self.vault_path}"
            )

        if not self.vault_path.is_dir():
            raise ValueError(
                f"Vault path is not a directory: {self.vault_path}"
            )


settings = Settings()
settings.validate_vault()