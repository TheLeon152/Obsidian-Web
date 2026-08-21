from pathlib import Path

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


class Settings(BaseSettings):

    vault_path: Path
    google_calendar_url: str
    inbox_folder: str = "00_Inbox"
    tasks_folder: str = "10_Tasks"

    cors_origins: list[str] = [
        "http://localhost:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

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