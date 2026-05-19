"""
Pydantic schemas (request / response models) for the document service API.
"""

from pydantic import BaseModel, Field


class SummariseRequest(BaseModel):
    content: str = Field(..., min_length=1, description="Raw document content to summarise.")


class SummariseResponse(BaseModel):
    summary: str
    word_count: int
    reading_time_minutes: float


class KeywordsRequest(BaseModel):
    content: str = Field(..., min_length=1, description="Raw document content.")


class KeywordsResponse(BaseModel):
    keywords: list[str]
