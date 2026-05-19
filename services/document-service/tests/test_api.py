"""
Integration tests for the FastAPI routes using the test client.
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_summarise_valid_content() -> None:
    response = client.post(
        "/summarise",
        json={"content": "The quick brown fox. It jumped over the lazy dog. This is a test."},
    )
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "word_count" in data
    assert data["word_count"] > 0
    assert "reading_time_minutes" in data


def test_summarise_empty_content_rejected() -> None:
    response = client.post("/summarise", json={"content": ""})
    assert response.status_code == 422


def test_keywords_valid_content() -> None:
    response = client.post(
        "/keywords",
        json={"content": "Machine learning models are trained on large datasets."},
    )
    assert response.status_code == 200
    data = response.json()
    assert "keywords" in data
    assert isinstance(data["keywords"], list)


def test_keywords_empty_content_rejected() -> None:
    response = client.post("/keywords", json={"content": ""})
    assert response.status_code == 422
