"""
document-service — FastAPI entry point.

Starts the application and mounts all routers.
"""

from app.api import router
from app.config import Settings
from fastapi import FastAPI

settings = Settings()

app = FastAPI(
    title="Document Processing Service",
    description="Microservice for document summarisation and keyword extraction.",
    version="0.1.0",
)

app.include_router(router, prefix="/")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "document-service"}
