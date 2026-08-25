import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { CadenceDatabase } from "../cadence-db.ts";
import {
  LEGACY_LOCAL_STORAGE_KEY,
  LEGACY_MIGRATION_META_KEY,
  migrateLegacyLocalStorage,
} from "./migrate-legacy-local-storage.ts";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  constructor(initialValues: Record<string, string> = {}) {
    for (const [key, value] of Object.entries(initialValues)) this.values.set(key, value);
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }
}

let databaseNumber = 0;
const databases: CadenceDatabase[] = [];

function createTestDatabase(): CadenceDatabase {
  databaseNumber += 1;
  const database = new CadenceDatabase(`cadence-migration-test-db-${databaseNumber}`);
  databases.push(database);
  return database;
}

function predictableIds(): () => string {
  let sequence = 0;
  return () => {
    sequence += 1;
    return `00000000-0000-4000-8000-${String(sequence).padStart(12, "0")}`;
  };
}

afterEach(async () => {
  await Promise.all(
    databases.splice(0).map(async (database) => {
      database.close();
      await database.delete();
    }),
  );
});

describe("migrateLegacyLocalStorage", () => {
  it("migrates valid legacy habits and check-ins once before recording the marker", async () => {
    const db = createTestDatabase();
    const storage = new MemoryStorage({
      [LEGACY_LOCAL_STORAGE_KEY]: JSON.stringify({
        state: {
          habits: [
            { id: "walk", name: "Morning walk", color: "sage", createdAt: "2026-08-01" },
            { id: "read", name: "Read", color: "slate", createdAt: "2026-08-02" },
          ],
          completions: {
            walk: ["2026-08-03", "2026-08-04", "2026-08-04", "not-a-date"],
            read: ["2026-08-05"],
            missing: ["2026-08-06"],
          },
          hasOnboarded: true,
        },
        version: 0,
      }),
    });

    const result = await migrateLegacyLocalStorage(db, {
      storage,
      clock: () => new Date("2026-08-25T09:30:00.000Z"),
      idFactory: predictableIds(),
    });

    assert.deepEqual(result, {
      status: "migrated",
      practicesInserted: 2,
      checkInsInserted: 3,
    });

    const practices = await db.practices.toArray();
    const checkIns = await db.checkIns.orderBy("occurredOn").toArray();
    const marker = await db.meta.get(LEGACY_MIGRATION_META_KEY);

    assert.equal(practices.length, 2);
    assert.equal(practices[0]?.cadence.kind, "daily");
    assert.deepEqual(
      checkIns.map((checkIn) => checkIn.occurredOn),
      ["2026-08-03", "2026-08-04", "2026-08-05"],
    );
    assert.equal(marker?.deletedAt, null);
    assert.match(marker?.value ?? "", /"status":"migrated"/);

    const retry = await migrateLegacyLocalStorage(db, { storage });
    assert.deepEqual(retry, {
      status: "already_migrated",
      practicesInserted: 0,
      checkInsInserted: 0,
    });
    assert.equal(await db.practices.count(), 2);
    assert.equal(await db.checkIns.count(), 3);
  });

  it("leaves the database unmarked when the legacy payload is malformed", async () => {
    const db = createTestDatabase();
    const storage = new MemoryStorage({ [LEGACY_LOCAL_STORAGE_KEY]: "not json" });

    const result = await migrateLegacyLocalStorage(db, { storage });

    assert.deepEqual(result, {
      status: "invalid_payload",
      practicesInserted: 0,
      checkInsInserted: 0,
    });
    assert.equal(await db.practices.count(), 0);
    assert.equal(await db.checkIns.count(), 0);
    assert.equal(await db.meta.get(LEGACY_MIGRATION_META_KEY), undefined);
  });
});
