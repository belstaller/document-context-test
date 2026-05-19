/**
 * EmailAddress — value object enforcing a valid e-mail format.
 * Immutable; equality by value (case-insensitive).
 *
 * LAYER: domain — zero external dependencies.
 */

export class EmailAddress {
  private readonly _value: string;

  private constructor(value: string) {
    const normalised = value.trim().toLowerCase();
    if (!EmailAddress.isValid(normalised)) {
      throw new Error(`"${value}" is not a valid email address.`);
    }
    this._value = normalised;
  }

  static of(value: string): EmailAddress {
    return new EmailAddress(value);
  }

  private static isValid(value: string): boolean {
    // Intentionally simple — full validation belongs to an email verifier service.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: EmailAddress): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
