/**
 * DomainException — base class for all domain-layer errors.
 * Allows infrastructure and interface layers to distinguish
 * domain violations from unexpected system errors.
 *
 * LAYER: domain — zero external dependencies.
 */

export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    // Restore prototype chain broken by extending built-in Error in TypeScript.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DocumentNotFoundException extends DomainException {
  constructor(documentId: string) {
    super(`Document with id "${documentId}" was not found.`);
    this.name = 'DocumentNotFoundException';
  }
}

export class UserNotFoundException extends DomainException {
  constructor(identifier: string) {
    super(`User "${identifier}" was not found.`);
    this.name = 'UserNotFoundException';
  }
}

export class UnauthorisedAccessException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorisedAccessException';
  }
}
