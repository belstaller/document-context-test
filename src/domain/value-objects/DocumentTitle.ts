/**
 * DocumentTitle — value object enforcing title constraints.
 * Immutable; equality by value.
 *
 * LAYER: domain — zero external dependencies.
 */

const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

export class DocumentTitle {
  private readonly _value: string;

  private constructor(value: string) {
    const trimmed = value.trim();
    if (trimmed.length < MIN_LENGTH) {
      throw new Error('Document title cannot be empty.');
    }
    if (trimmed.length > MAX_LENGTH) {
      throw new Error(`Document title cannot exceed ${MAX_LENGTH} characters.`);
    }
    this._value = trimmed;
  }

  static of(value: string): DocumentTitle {
    return new DocumentTitle(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: DocumentTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
