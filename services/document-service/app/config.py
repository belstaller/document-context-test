"""
Application configuration — reads from environment variables.
"""

import os


class Settings:
    app_name: str = "document-service"
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8001"))
