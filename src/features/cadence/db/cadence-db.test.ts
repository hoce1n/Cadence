import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { CadenceDatabase } from "./cadence-db.ts";
import { CheckInRepository } from "./repositories/check-in-repository.ts";
import { PracticeRepository } from "./repositories/practice-repository.ts";

let testDatabaseCount = 0;
const databases: CadenceDatabase[] = [];

function createTestDatabase(): CadenceDatabase {
  testDatabaseCount += 1;
  const database = new CadenceDatabase(`cadence-test-db-${testDatabaseCount}`);
  databases.push(database);
  return database;
}

afterEach(async () => {
  await Promise.all(
    databases.splice(0).map(async (database) => {
      database.close();
      await database.delete();
    }),
  );
});

describe("CadenceDatabase", () => {
  it("initializes every local-first table and serves indexed timeline queries", async () => {
    const db = createTestDatabase();
    await db.open();

    assert.deepEqual(db.tables.map((table) => table.name).sort(), [
      "checkIns",
      "meta",
      "practices",
      "returnPlans",
      "seasons",
      "weeklyReviews",
    ]);

    const fixedClock = () => new Date("2026-08-25T09:30:00.000Z");
    const practiceRepository = new PracticeRepository(db, { clock: fixedClock });
    const checkInRepository = new CheckInRepository(db, { clock: fixedClock });

    const practice = await practiceRepository.create({
      name: "Read slowly",
      color: "sage",
      cadence: { kind: "weekly_target", targetCount: 3 },
      createdOn: "2026-08-25",
      minimumVersion: "Read one page",
    });

    const checkIn = await checkInRepository.record({
      practiceId: practice.id,
      occurredOn: "2026-08-25",
    });

    const timelineRecords = await checkInRepository.listForPracticeRange(
      practice.id,
      "2026-08-01",
      "2026-08-31",
    );

    assert.equal(practice.schemaVersion, 1);
    assert.equal(checkIn.practiceId, practice.id);
    assert.equal(checkIn.deletedAt, null);
    assert.deepEqual(timelineRecords, [checkIn]);
  });
});
