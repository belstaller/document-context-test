/**
 * PetAge — value object representing a pet's age in whole months.
 * Must be a non-negative integer.
 * Immutable; equality by value.
 *
 * LAYER: domain — zero external dependencies.
 */

export class PetAge {
  private readonly _months: number;

  private constructor(months: number) {
    if (!Number.isInteger(months) || months < 0) {
      throw new Error(`Invalid PetAge: "${months}" must be a non-negative integer (months).`);
    }
    this._months = months;
  }

  static of(months: number): PetAge {
    return new PetAge(months);
  }

  get months(): number {
    return this._months;
  }

  equals(other: PetAge): boolean {
    return this._months === other._months;
  }

  toString(): string {
    return `${this._months} month(s)`;
  }
}
