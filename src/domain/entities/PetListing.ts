/**
 * PetListing — domain entity representing an adoptable pet at a shelter.
 *
 * Lifecycle: active → archived.
 * Supports up to MAX_PHOTOS photos.
 * Health status tracks vaccination, neutered/spayed, and microchipped flags.
 *
 * LAYER: domain — zero external dependencies.
 */

import type { PetAge } from '../value-objects/PetAge.js';
import type { PetListingId } from '../value-objects/PetListingId.js';
import type { ShelterId } from '../value-objects/ShelterId.js';

export type PetListingStatus = 'active' | 'archived';

export const MAX_PHOTOS = 10;

export interface HealthStatus {
  vaccinated: boolean;
  neuteredOrSpayed: boolean;
  microchipped: boolean;
}

export interface PetListingProps {
  id: PetListingId;
  shelterId: ShelterId;
  name: string;
  species: string;
  breed: string;
  ageMonths: PetAge;
  healthStatus: HealthStatus;
  photos: readonly string[];
  status: PetListingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePetListingFields {
  name?: string;
  species?: string;
  breed?: string;
  ageMonths?: PetAge;
  healthStatus?: Partial<HealthStatus>;
}

export class PetListing {
  private readonly _id: PetListingId;
  private readonly _shelterId: ShelterId;
  private _name: string;
  private _species: string;
  private _breed: string;
  private _ageMonths: PetAge;
  private _healthStatus: HealthStatus;
  private _photos: string[];
  private _status: PetListingStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PetListingProps) {
    PetListing.guardName(props.name);
    PetListing.guardSpecies(props.species);
    PetListing.guardBreed(props.breed);
    PetListing.guardPhotos(props.photos);

    this._id = props.id;
    this._shelterId = props.shelterId;
    this._name = props.name.trim();
    this._species = props.species.trim();
    this._breed = props.breed.trim();
    this._ageMonths = props.ageMonths;
    this._healthStatus = { ...props.healthStatus };
    this._photos = [...props.photos];
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // ─── Factories ───────────────────────────────────────────────────────────────

  static create(
    props: Omit<PetListingProps, 'status' | 'createdAt' | 'updatedAt'>,
  ): PetListing {
    const now = new Date();
    return new PetListing({
      ...props,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: PetListingProps): PetListing {
    return new PetListing(props);
  }

  // ─── Accessors ───────────────────────────────────────────────────────────────

  get id(): PetListingId {
    return this._id;
  }

  get shelterId(): ShelterId {
    return this._shelterId;
  }

  get name(): string {
    return this._name;
  }

  get species(): string {
    return this._species;
  }

  get breed(): string {
    return this._breed;
  }

  get ageMonths(): PetAge {
    return this._ageMonths;
  }

  get healthStatus(): Readonly<HealthStatus> {
    return { ...this._healthStatus };
  }

  get photos(): readonly string[] {
    return [...this._photos];
  }

  get status(): PetListingStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ─── Behaviour ───────────────────────────────────────────────────────────────

  /** Update mutable listing fields. Only non-undefined fields are changed. */
  update(fields: UpdatePetListingFields): void {
    this.guardNotArchived();

    if (fields.name !== undefined) {
      PetListing.guardName(fields.name);
      this._name = fields.name.trim();
    }
    if (fields.species !== undefined) {
      PetListing.guardSpecies(fields.species);
      this._species = fields.species.trim();
    }
    if (fields.breed !== undefined) {
      PetListing.guardBreed(fields.breed);
      this._breed = fields.breed.trim();
    }
    if (fields.ageMonths !== undefined) {
      this._ageMonths = fields.ageMonths;
    }
    if (fields.healthStatus !== undefined) {
      this._healthStatus = { ...this._healthStatus, ...fields.healthStatus };
    }

    this._updatedAt = new Date();
  }

  /** Add a photo URL. Enforces the 10-photo maximum. */
  addPhoto(url: string): void {
    this.guardNotArchived();
    const trimmed = url.trim();
    if (trimmed.length === 0) {
      throw new Error('Photo URL cannot be empty.');
    }
    if (this._photos.length >= MAX_PHOTOS) {
      throw new Error(`A pet listing cannot have more than ${MAX_PHOTOS} photos.`);
    }
    this._photos.push(trimmed);
    this._updatedAt = new Date();
  }

  /** Remove a photo by URL. Silently ignores a URL that is not present. */
  removePhoto(url: string): void {
    this.guardNotArchived();
    const before = this._photos.length;
    this._photos = this._photos.filter((p) => p !== url);
    if (this._photos.length !== before) {
      this._updatedAt = new Date();
    }
  }

  /** Archive the listing, preventing further modifications. */
  archive(): void {
    if (this._status === 'archived') {
      throw new Error('Pet listing is already archived.');
    }
    this._status = 'archived';
    this._updatedAt = new Date();
  }

  // ─── Guards ──────────────────────────────────────────────────────────────────

  private guardNotArchived(): void {
    if (this._status === 'archived') {
      throw new Error('Cannot modify an archived pet listing.');
    }
  }

  private static guardName(name: string): void {
    if (name.trim().length === 0) {
      throw new Error('Pet name cannot be empty.');
    }
    if (name.trim().length > 100) {
      throw new Error('Pet name cannot exceed 100 characters.');
    }
  }

  private static guardSpecies(species: string): void {
    if (species.trim().length === 0) {
      throw new Error('Pet species cannot be empty.');
    }
    if (species.trim().length > 100) {
      throw new Error('Pet species cannot exceed 100 characters.');
    }
  }

  private static guardBreed(breed: string): void {
    if (breed.trim().length === 0) {
      throw new Error('Pet breed cannot be empty.');
    }
    if (breed.trim().length > 100) {
      throw new Error('Pet breed cannot exceed 100 characters.');
    }
  }

  private static guardPhotos(photos: readonly string[]): void {
    if (photos.length > MAX_PHOTOS) {
      throw new Error(`A pet listing cannot have more than ${MAX_PHOTOS} photos.`);
    }
  }
}
