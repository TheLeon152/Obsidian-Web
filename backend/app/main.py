from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.notes import router as notes_router
from app.api.vault import router as vault_router
from app.api.assets import router as assets_router
from app.api.tags import router as tags_router


app = FastAPI(
    title="Obsidian Vault API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok"
    }


app.include_router(vault_router)
app.include_router(notes_router)
app.include_router(assets_router)
app.include_router(tags_router)