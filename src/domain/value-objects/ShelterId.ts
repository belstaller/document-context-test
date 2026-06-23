/**
 * ShelterId — value object representing the identity of a Shelter.
 * Used as a foreign key reference inside PetListing without coupling
 * to a Shelter entity.
 *
 * LAYER: domain — zero external dependencies.
 */

export class ShelterId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!ShelterId.isValid(value)) {
      throw new Error(`Invalid ShelterId: "${value}" is not a valid UUID.`);
    }
    this._value = value;
  }

  static of(value: string): ShelterId {
    return new ShelterId(value);
  }

  static generate(): ShelterId {
    return new ShelterId(crypto.randomUUID());
  }

  private static isValid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: ShelterId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
