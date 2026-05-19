/**
 * Unit tests for the Document entity.
 * Pure domain logic — no infrastructure or framework dependencies.
 */

import { Document } from '../Document.js';
import { DocumentId } from '../../value-objects/DocumentId.js';
import { DocumentTitle } from '../../value-objects/DocumentTitle.js';
import { OwnerId } from '../../value-objects/OwnerId.js';

const makeDocument = (overrides: Partial<{ status: 'draft' | 'published' | 'archived' }> = {}) => {
  const doc = Document.create({
    id: DocumentId.generate(),
    title: DocumentTitle.of('Test Document'),
    content: 'Some content here.',
    ownerId: OwnerId.generate(),
  });

  if (overrides.status === 'published') doc.publish();
  if (overrides.status === 'archived') {
    doc.publish();
    doc.archive();
  }

  return doc;
};

describe('Document entity', () => {
  it('creates a document with draft status', () => {
    const doc = makeDocument();
    expect(doc.status).toBe('draft');
  });

  it('publishes a draft document', () => {
    const doc = makeDocument();
    doc.publish();
    expect(doc.status).toBe('published');
  });

  it('throws when publishing an already-published document', () => {
    const doc = makeDocument({ status: 'published' });
    expect(() => doc.publish()).toThrow('already published');
  });

  it('archives a document', () => {
    const doc = makeDocument({ status: 'published' });
    doc.archive();
    expect(doc.status).toBe('archived');
  });

  it('throws when modifying an archived document', () => {
    const doc = makeDocument({ status: 'archived' });
    expect(() => doc.updateContent('new content')).toThrow('archived');
  });

  it('updates title successfully', () => {
    const doc = makeDocument();
    doc.updateTitle(DocumentTitle.of('New Title'));
    expect(doc.title.value).toBe('New Title');
  });

  it('updates updatedAt when content changes', () => {
    const doc = makeDocument();
    const before = doc.updatedAt;
    // Ensure at least 1 ms passes
    jest.useFakeTimers();
    jest.setSystemTime(Date.now() + 1000);
    doc.updateContent('Updated content.');
    expect(doc.updatedAt.getTime()).toBeGreaterThan(before.getTime());
    jest.useRealTimers();
  });
});
