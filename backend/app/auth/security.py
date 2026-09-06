import jwt

from pwdlib import PasswordHash

from app.config import settings


password_hash = PasswordHash.recommended()


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:

    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    username: str,
) -> str:

    return _create_token(
        username=username,
        token_type="access",
        expires_delta={
            "minutes":
                settings.jwt_access_token_expire_minutes
        },
    )


def create_refresh_token(
    username: str,
) -> str:

    return _create_token(
        username=username,
        token_type="refresh",
        expires_delta={
            "days":
                settings.jwt_refresh_token_expire_days
        },
    )


def _create_token(
    username: str,
    token_type: str,
    expires_delta: dict,
) -> str:

    from datetime import datetime, timedelta, timezone

    now = datetime.now(timezone.utc)

    if "minutes" in expires_delta:
        expires = now + timedelta(
            minutes=expires_delta["minutes"]
        )
    else:
        expires = now + timedelta(
            days=expires_delta["days"]
        )

    payload = {
        "sub": username,
        "type": token_type,
        "exp": expires,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm="HS256",
    )


def decode_token(
    token: str,
) -> dict:

    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=["HS256"],
    )