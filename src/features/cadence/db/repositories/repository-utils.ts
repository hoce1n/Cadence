import type { EntityId, ISOInstant } from "../../domain/types.ts";

export type Clock = () => Date;
export type IdFactory = () => EntityId;

export const systemClock: Clock = () => new Date();

export function createEntityId(): EntityId {
  return crypto.randomUUID();
}

export function nowInstant(clock: Clock = systemClock): ISOInstant {
  return clock().toISOString();
}

export class CadenceRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CadenceRepositoryError";
  }
}

export class EntityNotFoundError extends CadenceRepositoryError {
  constructor(entity: string, id: string) {
    super(`${entity} ${id} was not found.`);
    this.name = "EntityNotFoundError";
  }
}

export class EntityConflictError extends CadenceRepositoryError {
  constructor(message: string) {
    super(message);
    this.name = "EntityConflictError";
  }
}
