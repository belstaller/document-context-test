/**
 * Shelter — domain entity representing an animal shelter with a public profile.
 *
 * Holds contact information, a physical address with coordinates for map display,
 * and structured operating hours for each day of the week.
 *
 * LAYER: domain — zero external dependencies.
 */

import type { ShelterId } from '../value-objects/ShelterId.js';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/** Opening and closing times in 'HH:MM' 24-hour format, or null if closed. */
export interface DayHours {
  open: string | null;
  close: string | null;
}

export type OperatingHours = Record<DayOfWeek, DayHours>;

export interface ShelterProps {
  id: ShelterId;
  name: string;
  email: string;
  phone: string;
  website: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  operatingHours: OperatingHours;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateShelterFields {
  name?: string;
  email?: string;
  phone?: string;
  website?: string | null;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  operatingHours?: Partial<OperatingHours>;
}

export class Shelter {
  private readonly _id: ShelterId;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _website: string | null;
  private _addressLine1: string;
  private _addressLine2: string | null;
  private _city: string;
  private _state: string;
  private _postcode: string;
  private _country: string;
  private _latitude: number | null;
  private _longitude: number | null;
  private _operatingHours: OperatingHours;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ShelterProps) {
    Shelter.guardName(props.name);
    Shelter.guardEmail(props.email);
    Shelter.guardPhone(props.phone);
    Shelter.guardAddress(props.addressLine1, props.city, props.state, props.postcode, props.country);

    this._id = props.id;
    this._name = props.name.trim();
    this._email = props.email.trim().toLowerCase();
    this._phone = props.phone.trim();
    this._website = props.website?.trim() ?? null;
    this._addressLine1 = props.addressLine1.trim();
    this._addressLine2 = props.addressLine2?.trim() ?? null;
    this._city = props.city.trim();
    this._state = props.state.trim();
    this._postcode = props.postcode.trim();
    this._country = props.country.trim();
    this._latitude = props.latitude ?? null;
    this._longitude = props.longitude ?? null;
    this._operatingHours = { ...props.operatingHours };
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ─── Factories ───────────────────────────────────────────────────────────────

  static create(props: Omit<ShelterProps, 'createdAt' | 'updatedAt'>): Shelter {
    const now = new Date();
    return new Shelter({ ...props, createdAt: now, updatedAt: now });
  }

  static reconstitute(props: ShelterProps): Shelter {
    return new Shelter(props);
  }

  // ─── Accessors ───────────────────────────────────────────────────────────────

  get id(): ShelterId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get website(): string | null {
    return this._website;
  }

  get addressLine1(): string {
    return this._addressLine1;
  }

  get addressLine2(): string | null {
    return this._addressLine2;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get postcode(): string {
    return this._postcode;
  }

  get country(): string {
    return this._country;
  }

  get latitude(): number | null {
    return this._latitude;
  }

  get longitude(): number | null {
    return this._longitude;
  }

  get operatingHours(): Readonly<OperatingHours> {
    return { ...this._operatingHours };
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ─── Behaviour ───────────────────────────────────────────────────────────────

  /** Update mutable shelter fields. Only non-undefined fields are changed. */
  update(fields: UpdateShelterFields): void {
    if (fields.name !== undefined) {
      Shelter.guardName(fields.name);
      this._name = fields.name.trim();
    }
    if (fields.email !== undefined) {
      Shelter.guardEmail(fields.email);
      this._email = fields.email.trim().toLowerCase();
    }
    if (fields.phone !== undefined) {
      Shelter.guardPhone(fields.phone);
      this._phone = fields.phone.trim();
    }
    if ('website' in fields) {
      this._website = fields.website?.trim() ?? null;
    }
    if (fields.addressLine1 !== undefined) {
      this._addressLine1 = fields.addressLine1.trim();
    }
    if ('addressLine2' in fields) {
      this._addressLine2 = fields.addressLine2?.trim() ?? null;
    }
    if (fields.city !== undefined) {
      this._city = fields.city.trim();
    }
    if (fields.state !== undefined) {
      this._state = fields.state.trim();
    }
    if (fields.postcode !== undefined) {
      this._postcode = fields.postcode.trim();
    }
    if (fields.country !== undefined) {
      this._country = fields.country.trim();
    }
    if ('latitude' in fields) {
      this._latitude = fields.latitude ?? null;
    }
    if ('longitude' in fields) {
      this._longitude = fields.longitude ?? null;
    }
    if (fields.operatingHours !== undefined) {
      this._operatingHours = { ...this._operatingHours, ...fields.operatingHours };
    }

    this._updatedAt = new Date();
  }

  // ─── Guards ──────────────────────────────────────────────────────────────────

  private static guardName(name: string): void {
    if (name.trim().length === 0) {
      throw new Error('Shelter name cannot be empty.');
    }
    if (name.trim().length > 150) {
      throw new Error('Shelter name cannot exceed 150 characters.');
    }
  }

  private static guardEmail(email: string): void {
    if (email.trim().length === 0) {
      throw new Error('Shelter email cannot be empty.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error(`"${email}" is not a valid email address.`);
    }
  }

  private static guardPhone(phone: string): void {
    if (phone.trim().length === 0) {
      throw new Error('Shelter phone cannot be empty.');
    }
    if (phone.trim().length > 30) {
      throw new Error('Shelter phone cannot exceed 30 characters.');
    }
  }

  private static guardAddress(
    addressLine1: string,
    city: string,
    state: string,
    postcode: string,
    country: string,
  ): void {
    if (addressLine1.trim().length === 0) throw new Error('Address line 1 cannot be empty.');
    if (city.trim().length === 0) throw new Error('City cannot be empty.');
    if (state.trim().length === 0) throw new Error('State cannot be empty.');
    if (postcode.trim().length === 0) throw new Error('Postcode cannot be empty.');
    if (country.trim().length === 0) throw new Error('Country cannot be empty.');
  }
}
