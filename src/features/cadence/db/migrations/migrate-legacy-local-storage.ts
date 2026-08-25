import { z } from "zod";
import type { CadenceDatabase } from "../cadence-db.ts";
import { checkInSchema, practiceColorSchema, practiceSchema } from "../../domain/schemas.ts";
import type { EntityId, ISODate, ISOInstant } from "../../domain/types.ts";
import {
  createEntityId,
  nowInstant,
  type Clock,
  type IdFactory,
  systemClock,
} from "../repositories/repository-utils.ts";

export const LEGACY_LOCAL_STORAGE_KEY = "cadence-habits-v1";
export const LEGACY_MIGRATION_META_KEY = "legacy_local_storage_migrated";

const legacyHabitSchema = z.object({
  id: z.string().trim().min(1).max(200),
  name: z.string().trim().min(1).max(40),
  color: practiceColorSchema,
  createdAt: z.string(),
});

const legacyPayloadSchema = z.object({
  state: z.object({
    habits: z.array(legacyHabitSchema).default([]),
    completions: z.record(z.string(), z.array(z.string())).default({}),
    hasOnboarded: z.boolean().optional(),
  }),
  version: z.number().optional(),
});

export type LegacyMigrationStatus =
  "already_migrated" | "no_legacy_data" | "migrated" | "invalid_payload" | "storage_unavailable";

export interface LegacyMigrationResult {
  status: LegacyMigrationStatus;
  practicesInserted: number;
  checkInsInserted: number;
}

export interface LegacyMigrationOptions {
  storage?: Pick<Storage, "getItem"> | null;
  clock?: Clock;
  idFactory?: IdFactory;
}

function resolveStorage(
  storage: LegacyMigrationOptions["storage"],
): Pick<Storage, "getItem"> | null {
  if (storage !== undefined) return storage;
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function isCanonicalIsoDate(value: string): value is ISODate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function migrationMarker(status: "no_legacy_data" | "migrated", instant: ISOInstant): string {
  return JSON.stringify({ version: 1, status, migratedAt: instant });
}

/**
 * Moves the persisted Zustand v1 habit map into normalized Dexie records.
 * It intentionally leaves localStorage untouched during Phase 1; the marker
 * makes the operation idempotent, while retaining the original payload as a
 * recovery source until the UI has fully moved to the new repositories.
 */
export async function migrateLegacyLocalStorage(
  db: CadenceDatabase,
  options: LegacyMigrationOptions = {},
): Promise<LegacyMigrationResult> {
  const clock = options.clock ?? systemClock;
  const idFactory = options.idFactory ?? createEntityId;
  const instant = nowInstant(clock);

  return db.transaction("rw", db.practices, db.checkIns, db.meta, async () => {
    const priorMigration = await db.meta.get(LEGACY_MIGRATION_META_KEY);
    if (priorMigration?.deletedAt === null) {
      return { status: "already_migrated", practicesInserted: 0, checkInsInserted: 0 };
    }

    const storage = resolveStorage(options.storage);
    if (!storage) {
      return { status: "storage_unavailable", practicesInserted: 0, checkInsInserted: 0 };
    }

    let raw: string | null;
    try {
      raw = storage.getItem(LEGACY_LOCAL_STORAGE_KEY);
    } catch {
      return { status: "storage_unavailable", practicesInserted: 0, checkInsInserted: 0 };
    }

    if (raw === null) {
      await db.meta.put({
        key: LEGACY_MIGRATION_META_KEY,
        value: migrationMarker("no_legacy_data", instant),
        schemaVersion: 1,
        createdAt: instant,
        updatedAt: instant,
        deletedAt: null,
      });
      return { status: "no_legacy_data", practicesInserted: 0, checkInsInserted: 0 };
    }

    let parsedPayload: unknown;
    try {
      parsedPayload = JSON.parse(raw);
    } catch {
      return { status: "invalid_payload", practicesInserted: 0, checkInsInserted: 0 };
    }

    const parsedLegacy = legacyPayloadSchema.safeParse(parsedPayload);
    if (!parsedLegacy.success) {
      return { status: "invalid_payload", practicesInserted: 0, checkInsInserted: 0 };
    }

    const legacyIdToPracticeId = new Map<string, EntityId>();
    const practices = [];
    for (const legacyHabit of parsedLegacy.data.state.habits) {
      if (legacyIdToPracticeId.has(legacyHabit.id)) continue;
      const createdOn = isCanonicalIsoDate(legacyHabit.createdAt)
        ? legacyHabit.createdAt
        : (instant.slice(0, 10) as ISODate);
      const practiceId = idFactory();
      legacyIdToPracticeId.set(legacyHabit.id, practiceId);
      practices.push(
        practiceSchema.parse({
          id: practiceId,
          schemaVersion: 1,
          name: legacyHabit.name,
          color: legacyHabit.color,
          cadence: { kind: "daily", everyDays: 1 },
          minimumVersion: null,
          lifecycle: "active",
          createdOn,
          createdAt: instant,
          updatedAt: instant,
          deletedAt: null,
        }),
      );
    }

    const checkIns = [];
    const seenPracticeDays = new Set<string>();
    for (const [legacyHabitId, dates] of Object.entries(parsedLegacy.data.state.completions)) {
      const practiceId = legacyIdToPracticeId.get(legacyHabitId);
      if (!practiceId) continue;
      for (const occurredOn of dates) {
        if (!isCanonicalIsoDate(occurredOn)) continue;
        const key = `${practiceId}:${occurredOn}`;
        if (seenPracticeDays.has(key)) continue;
        seenPracticeDays.add(key);
        checkIns.push(
          checkInSchema.parse({
            id: idFactory(),
            schemaVersion: 1,
            practiceId,
            occurredOn,
            completedAt: instant,
            returnPlanId: null,
            note: null,
            createdAt: instant,
            updatedAt: instant,
            deletedAt: null,
          }),
        );
      }
    }

    await db.practices.bulkPut(practices);
    await db.checkIns.bulkPut(checkIns);
    await db.meta.put({
      key: LEGACY_MIGRATION_META_KEY,
      value: migrationMarker("migrated", instant),
      schemaVersion: 1,
      createdAt: instant,
      updatedAt: instant,
      deletedAt: null,
    });

    return {
      status: "migrated",
      practicesInserted: practices.length,
      checkInsInserted: checkIns.length,
    };
  });
}
