/**
 * User-related DTOs.
 *
 * LAYER: application
 */

// ─── Input DTOs ─────────────────────────────────────────────────────────────

export interface RegisterUserDto {
  email: string;
  displayName: string;
}

// ─── Output DTOs ─────────────────────────────────────────────────────────────

export interface UserResponseDto {
  id: string;
  email: string;
  displayName: string;
  createdAt: string; // ISO-8601
}
