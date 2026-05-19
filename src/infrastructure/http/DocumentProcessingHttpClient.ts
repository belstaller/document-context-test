/**
 * DocumentProcessingHttpClient — HTTP adapter for the Python FastAPI
 * document processing microservice.
 *
 * Implements the `IDocumentProcessingService` port defined in application/.
 * Infrastructure errors are caught and re-thrown as application-level errors.
 *
 * LAYER: infrastructure
 */

import type {
  DocumentSummary,
  IDocumentProcessingService,
} from '../../application/ports/IDocumentProcessingService.js';

interface SummariseResponse {
  summary: string;
  word_count: number;
  reading_time_minutes: number;
}

interface KeywordsResponse {
  keywords: string[];
}

export class DocumentProcessingHttpClient implements IDocumentProcessingService {
  private readonly baseUrl: string;

  constructor() {
    const url = process.env['DOCUMENT_SERVICE_URL'];
    if (!url) {
      throw new Error('Environment variable DOCUMENT_SERVICE_URL is not set.');
    }
    this.baseUrl = url;
  }

  async summarise(content: string): Promise<DocumentSummary> {
    try {
      const response = await fetch(`${this.baseUrl}/summarise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Document service responded with status ${response.status}.`);
      }

      const data = (await response.json()) as SummariseResponse;

      return {
        summary: data.summary,
        wordCount: data.word_count,
        readingTimeMinutes: data.reading_time_minutes,
      };
    } catch (err) {
      throw new Error(
        `Failed to reach document processing service: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async extractKeywords(content: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Document service responded with status ${response.status}.`);
      }

      const data = (await response.json()) as KeywordsResponse;
      return data.keywords;
    } catch (err) {
      throw new Error(
        `Failed to reach document processing service: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
