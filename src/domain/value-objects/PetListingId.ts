/**
 * PetListingId — value object wrapping a UUID string that identifies a pet listing.
 * Immutable; equality by value.
 *
 * LAYER: domain — zero external dependencies.
 */

export class PetListingId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!PetListingId.isValid(value)) {
      throw new Error(`Invalid PetListingId: "${value}" is not a valid UUID.`);
    }
    this._value = value;
  }

  static of(value: string): PetListingId {
    return new PetListingId(value);
  }

  static generate(): PetListingId {
    return new PetListingId(crypto.randomUUID());
  }

  private static isValid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PetListingId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
