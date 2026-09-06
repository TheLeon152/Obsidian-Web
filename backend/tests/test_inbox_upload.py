import io
from pathlib import Path

from fastapi.testclient import TestClient

from app.auth.security import create_access_token
from app.main import app


client = TestClient(app)


def test_upload_png(tmp_path: Path, monkeypatch):

    vault = tmp_path / "vault"
    inbox = vault / "00_Inbox"

    inbox.mkdir(parents=True)

    monkeypatch.setattr(
        "app.config.settings.vault_path",
        vault,
    )

    token = create_access_token(
        "testuser"
    )

    response = client.post(
        "/api/v1/inbox/upload",
        headers={
            "Authorization": f"Bearer {token}"
        },
        files={
            "file": (
                "test.png",
                io.BytesIO(
                    b"\x89PNG\r\n\x1a\n"
                    b"fake image data"
                ),
                "image/png",
            )
        },
    )

    assert response.status_code == 200, response.json()

    data = response.json()

    assert data["name"] == "test.png"
    assert data["path"] == "00_Inbox/test.png"
    assert data["file_type"] == "image"

    uploaded_file = inbox / "test.png"

    assert uploaded_file.exists()

    assert uploaded_file.read_bytes() == (
        b"\x89PNG\r\n\x1a\n"
        b"fake image data"
    )