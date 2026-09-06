from fastapi import APIRouter, HTTPException, status

from app.auth.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
)

from app.auth.service import authenticate_user

from app.models.auth import (
    LoginRequest,
    RefreshRequest,
    TokenResponse,
)


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["auth"],
)

@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    request: LoginRequest,
) -> TokenResponse:

    authenticated = authenticate_user(
        request.username,
        request.password,
    )

    if not authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    return TokenResponse(
        access_token=create_access_token(
            request.username
        ),
        refresh_token=create_refresh_token(
            request.username
        ),
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh(
    request: RefreshRequest,
) -> TokenResponse:

    try:
        payload = decode_token(
            request.refresh_token
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token.",
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type.",
        )

    username = payload.get("sub")

    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token.",
        )

    return TokenResponse(
        access_token=create_access_token(
            username
        ),
        refresh_token=create_refresh_token(
            username
        ),
    )