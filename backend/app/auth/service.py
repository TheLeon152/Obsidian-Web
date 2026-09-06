from app.auth.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
)
from app.config import settings


def authenticate_user(
    username: str,
    password: str,
) -> bool:

    if username != settings.auth_username:
        return False

    return verify_password(
        password,
        settings.auth_password_hash,
    )


def create_tokens(
    username: str,
) -> dict[str, str]:

    return {
        "access_token": create_access_token(
            username
        ),
        "refresh_token": create_refresh_token(
            username
        ),
    }