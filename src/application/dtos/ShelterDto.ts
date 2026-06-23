/**
 * Shelter-related DTOs.
 *
 * Plain data objects that cross layer boundaries.
 * Use cases accept input DTOs and return output DTOs — never raw domain entities.
 *
 * LAYER: application
 */

import type { DayOfWeek, DayHours } from '../../domain/entities/Shelter.js';

// ─── Input DTOs ──────────────────────────────────────────────────────────────

export interface CreateShelterDto {
  name: string;
  email: string;
  phone: string;
  website?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  operatingHours: Partial<Record<DayOfWeek, DayHours>>;
}

export interface GetShelterDto {
  shelterId: string;
}

// ─── Output DTOs ─────────────────────────────────────────────────────────────

export interface ShelterResponseDto {
  id: string;
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
  operatingHours: Partial<Record<DayOfWeek, DayHours>>;
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}
