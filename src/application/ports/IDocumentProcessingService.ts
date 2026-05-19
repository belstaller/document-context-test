/**
 * IDocumentProcessingService — port interface describing what the application
 * needs from the external Python document processing microservice.
 *
 * The concrete adapter lives in infrastructure/.
 *
 * LAYER: application — imports only from domain/ and application/.
 */

export interface DocumentSummary {
  summary: string;
  wordCount: number;
  readingTimeMinutes: number;
}

export interface IDocumentProcessingService {
  /**
   * Send document content to the processing service and receive
   * a structured summary back.
   */
  summarise(content: string): Promise<DocumentSummary>;

  /**
   * Extract keywords from document content.
   */
  extractKeywords(content: string): Promise<string[]>;
}
