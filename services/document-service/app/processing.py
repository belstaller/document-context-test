"""
Document processing logic.

This module is intentionally free of HTTP concerns — it is pure Python
and can be unit-tested without spinning up a web server.
"""

import re
from collections import Counter


def count_words(text: str) -> int:
    """Return the number of words in the given text."""
    return len(text.split())


def estimate_reading_time(word_count: int, words_per_minute: int = 200) -> float:
    """Estimate reading time in minutes, rounded to one decimal place."""
    return round(word_count / words_per_minute, 1)


def summarise(content: str, max_sentences: int = 3) -> str:
    """
    Produce a lightweight extractive summary by selecting the first
    `max_sentences` sentences.

    In production you would call an LLM or a dedicated NLP library here.
    """
    sentences = re.split(r"(?<=[.!?])\s+", content.strip())
    selected = sentences[:max_sentences]
    return " ".join(selected)


def extract_keywords(content: str, top_n: int = 10) -> list[str]:
    """
    Extract the top-N most frequent non-stop-words from the content.

    In production replace this with spaCy, KeyBERT, or an LLM call.
    """
    stop_words = {
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
        "being", "have", "has", "had", "do", "does", "did", "will", "would",
        "could", "should", "may", "might", "shall", "can", "that", "this",
        "it", "its", "as", "if", "so", "not", "no", "nor",
    }
    words = re.findall(r"\b[a-zA-Z]{3,}\b", content.lower())
    filtered = [w for w in words if w not in stop_words]
    most_common = Counter(filtered).most_common(top_n)
    return [word for word, _ in most_common]
