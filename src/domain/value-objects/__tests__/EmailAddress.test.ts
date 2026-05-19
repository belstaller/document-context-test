/**
 * Unit tests for EmailAddress value object.
 */

import { EmailAddress } from '../EmailAddress.js';

describe('EmailAddress value object', () => {
  it('creates a valid email', () => {
    const email = EmailAddress.of('user@example.com');
    expect(email.value).toBe('user@example.com');
  });

  it('normalises to lowercase', () => {
    const email = EmailAddress.of('User@Example.COM');
    expect(email.value).toBe('user@example.com');
  });

  it('throws for a missing @', () => {
    expect(() => EmailAddress.of('notanemail')).toThrow();
  });

  it('throws for a missing domain', () => {
    expect(() => EmailAddress.of('user@')).toThrow();
  });

  it('equals another email with the same value', () => {
    const a = EmailAddress.of('test@example.com');
    const b = EmailAddress.of('TEST@EXAMPLE.COM');
    expect(a.equals(b)).toBe(true);
  });
});
