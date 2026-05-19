"""
Unit tests for the document processing module.
"""

from app.processing import count_words, estimate_reading_time, extract_keywords, summarise


def test_count_words_basic() -> None:
    assert count_words("Hello world foo bar") == 4


def test_count_words_empty() -> None:
    assert count_words("") == 0


def test_estimate_reading_time() -> None:
    # 200 words at 200 wpm → 1.0 minute
    assert estimate_reading_time(200) == 1.0


def test_estimate_reading_time_rounds() -> None:
    assert estimate_reading_time(50) == 0.2


def test_summarise_returns_first_sentences() -> None:
    content = "First sentence. Second sentence. Third sentence. Fourth sentence."
    result = summarise(content, max_sentences=2)
    assert "First sentence" in result
    assert "Second sentence" in result
    assert "Fourth sentence" not in result


def test_summarise_short_content() -> None:
    content = "Only one sentence."
    assert summarise(content, max_sentences=3) == "Only one sentence."


def test_extract_keywords_returns_list() -> None:
    content = "Python Python Python FastAPI PostgreSQL PostgreSQL"
    keywords = extract_keywords(content, top_n=2)
    assert "python" in keywords
    assert "postgresql" in keywords


def test_extract_keywords_excludes_stop_words() -> None:
    content = "the quick brown fox jumps over the lazy dog"
    keywords = extract_keywords(content, top_n=10)
    assert "the" not in keywords
    assert "over" not in keywords
