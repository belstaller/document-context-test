/**
 * User — domain entity representing an account that owns documents.
 *
 * LAYER: domain — zero external dependencies.
 */

import type { EmailAddress } from '../value-objects/EmailAddress.js';
import type { OwnerId } from '../value-objects/OwnerId.js';

export interface UserProps {
  id: OwnerId;
  email: EmailAddress;
  displayName: string;
  createdAt: Date;
}

export class User {
  private readonly _id: OwnerId;
  private _email: EmailAddress;
  private _displayName: string;
  private readonly _createdAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._email = props.email;
    this._displayName = props.displayName;
    this._createdAt = props.createdAt;
  }

  static create(props: Omit<UserProps, 'createdAt'>): User {
    return new User({ ...props, createdAt: new Date() });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  get id(): OwnerId {
    return this._id;
  }

  get email(): EmailAddress {
    return this._email;
  }

  get displayName(): string {
    return this._displayName;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  changeEmail(email: EmailAddress): void {
    this._email = email;
  }

  changeDisplayName(name: string): void {
    if (name.trim().length < 2) {
      throw new Error('Display name must be at least 2 characters.');
    }
    this._displayName = name.trim();
  }
}
