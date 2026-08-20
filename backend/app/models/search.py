from pydantic import BaseModel, Field


class SearchResult(BaseModel):
    name: str
    path: str
    tags: list[str] = Field(
        default_factory=list
    )


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult] = Field(
        default_factory=list
    )
