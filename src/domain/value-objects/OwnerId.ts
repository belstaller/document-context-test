/**
 * OwnerId — value object representing the identity of a User.
 * Used as a foreign key reference inside Document without coupling to User entity.
 *
 * LAYER: domain — zero external dependencies.
 */

export class OwnerId {
  private readonly _value: string;

  private constructor(value: string) {
    if (!OwnerId.isValid(value)) {
      throw new Error(`Invalid OwnerId: "${value}" is not a valid UUID.`);
    }
    this._value = value;
  }

  static of(value: string): OwnerId {
    return new OwnerId(value);
  }

  static generate(): OwnerId {
    return new OwnerId(crypto.randomUUID());
  }

  private static isValid(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: OwnerId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
