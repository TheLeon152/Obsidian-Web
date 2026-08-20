from fastapi import APIRouter

from app.models.search import SearchResponse
from app.services.search_service import SearchService
from app.services.vault import vault_indexer


router = APIRouter(
    prefix="/api/v1/search",
    tags=["search"],
)


search_service = SearchService(
    vault_indexer
)


@router.get(
    "",
    response_model=SearchResponse,
)
def search(
    q: str,
) -> SearchResponse:

    return SearchResponse(
        query=q,
        results=[
            result
            for result in search_service.search(q)
        ],
    )
