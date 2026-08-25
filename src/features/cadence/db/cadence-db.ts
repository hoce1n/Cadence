import Dexie, { type EntityTable } from "dexie";
import type {
  CheckIn,
  MetaRecord,
  Practice,
  ReturnPlan,
  Season,
  WeeklyReview,
} from "../domain/types.ts";

export const CADENCE_DATABASE_NAME = "cadence";

/**
 * The local system of record for Cadence. Every durable write must go through
 * a repository so validation, transactions, and later sync-change recording
 * share the same boundary.
 */
export class CadenceDatabase extends Dexie {
  practices!: EntityTable<Practice, "id">;
  checkIns!: EntityTable<CheckIn, "id">;
  returnPlans!: EntityTable<ReturnPlan, "id">;
  seasons!: EntityTable<Season, "id">;
  weeklyReviews!: EntityTable<WeeklyReview, "id">;
  meta!: EntityTable<MetaRecord, "key">;

  constructor(name = CADENCE_DATABASE_NAME) {
    super(name);

    this.version(1).stores({
      practices: "id, lifecycle, createdOn, createdAt, updatedAt, deletedAt",
      checkIns:
        "id, practiceId, [practiceId+occurredOn], occurredOn, returnPlanId, updatedAt, deletedAt",
      returnPlans: "id, practiceId, [practiceId+status], startOn, endOn, updatedAt, deletedAt",
      seasons: "id, startOn, endOn, updatedAt, deletedAt",
      weeklyReviews: "id, weekStartOn, createdAt, updatedAt, deletedAt",
      meta: "key, updatedAt, deletedAt",
    });
  }
}

export function createCadenceDatabase(name?: string): CadenceDatabase {
  return new CadenceDatabase(name);
}

/**
 * Application singleton. Constructing a Dexie instance is SSR-safe; browser
 * IndexedDB is first touched by a repository call after client hydration.
 */
export const cadenceDb = createCadenceDatabase();
