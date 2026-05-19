/**
 * DocumentId — value object wrapping a UUID string.
 * Immutable; equality by value.
 *
 * LAYER: domain — zero external dependencies.
 */

export class DocumentId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!DocumentId.isValid(value)) {
      throw new Error(`Invalid DocumentId: "${value}" is not a valid UUID.`);
    }
    this._value = value;
  }

  static of(value: string): DocumentId {
    return new DocumentId(value);
  }

  /** Generate a new random DocumentId using the platform crypto API. */
  static generate(): DocumentId {
    // Relies only on the runtime's built-in crypto — no third-party dependency.
    const uuid = crypto.randomUUID();
    return new DocumentId(uuid);
  }

  private static isValid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: DocumentId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
