"""
API router — thin HTTP layer that delegates to processing.py.
"""

from app import processing
from app.schemas import (
    KeywordsRequest,
    KeywordsResponse,
    SummariseRequest,
    SummariseResponse,
)
from fastapi import APIRouter

router = APIRouter()


@router.post("/summarise", response_model=SummariseResponse)
async def summarise_document(request: SummariseRequest) -> SummariseResponse:
    """
    Generate a summary of the provided document content.
    """
    word_count = processing.count_words(request.content)
    reading_time = processing.estimate_reading_time(word_count)
    summary = processing.summarise(request.content)

    return SummariseResponse(
        summary=summary,
        word_count=word_count,
        reading_time_minutes=reading_time,
    )


@router.post("/keywords", response_model=KeywordsResponse)
async def extract_keywords(request: KeywordsRequest) -> KeywordsResponse:
    """
    Extract the most significant keywords from the provided document content.
    """
    keywords = processing.extract_keywords(request.content)
    return KeywordsResponse(keywords=keywords)
