/**
 * Unit tests for DocumentTitle value object.
 */

import { DocumentTitle } from '../DocumentTitle.js';

describe('DocumentTitle value object', () => {
  it('creates a valid title', () => {
    const title = DocumentTitle.of('My Document');
    expect(title.value).toBe('My Document');
  });

  it('trims whitespace', () => {
    const title = DocumentTitle.of('  Padded Title  ');
    expect(title.value).toBe('Padded Title');
  });

  it('throws for an empty string', () => {
    expect(() => DocumentTitle.of('')).toThrow();
  });

  it('throws for a title exceeding 200 characters', () => {
    expect(() => DocumentTitle.of('a'.repeat(201))).toThrow();
  });

  it('equals another title with the same value', () => {
    const a = DocumentTitle.of('Same Title');
    const b = DocumentTitle.of('Same Title');
    expect(a.equals(b)).toBe(true);
  });

  it('is not equal to a different title', () => {
    const a = DocumentTitle.of('Title A');
    const b = DocumentTitle.of('Title B');
    expect(a.equals(b)).toBe(false);
  });
});
