import type { CadenceDatabase } from "../cadence-db.ts";
import { checkInSchema } from "../../domain/schemas.ts";
import type { CheckIn, EntityId, ISODate, ISOInstant } from "../../domain/types.ts";
import {
  createEntityId,
  EntityConflictError,
  EntityNotFoundError,
  nowInstant,
  type Clock,
  type IdFactory,
  systemClock,
} from "./repository-utils.ts";

export interface RecordCheckInCommand {
  practiceId: EntityId;
  occurredOn: ISODate;
  returnPlanId?: EntityId | null;
  note?: string | null;
  completedAt?: ISOInstant;
}

export class CheckInRepository {
  private readonly db: CadenceDatabase;
  private readonly dependencies: { clock?: Clock; idFactory?: IdFactory };

  constructor(db: CadenceDatabase, dependencies: { clock?: Clock; idFactory?: IdFactory } = {}) {
    this.db = db;
    this.dependencies = dependencies;
  }

  async listForPracticeRange(
    practiceId: EntityId,
    startOn: ISODate,
    endOn: ISODate,
  ): Promise<CheckIn[]> {
    const records = await this.db.checkIns
      .where("[practiceId+occurredOn]")
      .between([practiceId, startOn], [practiceId, endOn], true, true)
      .toArray();
    return records.filter((record) => record.deletedAt === null);
  }

  async record(command: RecordCheckInCommand): Promise<CheckIn> {
    return this.db.transaction(
      "rw",
      this.db.practices,
      this.db.checkIns,
      this.db.returnPlans,
      async () => {
        const practice = await this.db.practices.get(command.practiceId);
        if (!practice || practice.deletedAt !== null || practice.lifecycle !== "active") {
          throw new EntityNotFoundError("Active practice", command.practiceId);
        }

        if (command.returnPlanId) {
          const plan = await this.db.returnPlans.get(command.returnPlanId);
          if (!plan || plan.deletedAt !== null || plan.practiceId !== command.practiceId) {
            throw new EntityNotFoundError("Return Plan", command.returnPlanId);
          }
          if (plan.status !== "active") {
            throw new EntityConflictError(
              "A check-in can only be linked to an active Return Plan.",
            );
          }
        }

        const existing = await this.db.checkIns
          .where("[practiceId+occurredOn]")
          .equals([command.practiceId, command.occurredOn])
          .first();
        if (existing?.deletedAt === null) return existing;

        const instant = this.now();
        const record = checkInSchema.parse({
          id: existing?.id ?? this.idFactory()(),
          schemaVersion: 1,
          practiceId: command.practiceId,
          occurredOn: command.occurredOn,
          completedAt: command.completedAt ?? instant,
          returnPlanId: command.returnPlanId ?? null,
          note: command.note ?? null,
          createdAt: existing?.createdAt ?? instant,
          updatedAt: instant,
          deletedAt: null,
        });
        await this.db.checkIns.put(record);
        return record;
      },
    );
  }

  async remove(practiceId: EntityId, occurredOn: ISODate): Promise<CheckIn | undefined> {
    return this.db.transaction("rw", this.db.checkIns, async () => {
      const existing = await this.db.checkIns
        .where("[practiceId+occurredOn]")
        .equals([practiceId, occurredOn])
        .first();
      if (!existing || existing.deletedAt !== null) return undefined;

      const deleted = checkInSchema.parse({
        ...existing,
        updatedAt: this.now(),
        deletedAt: this.now(),
      });
      await this.db.checkIns.put(deleted);
      return deleted;
    });
  }

  async toggle(command: RecordCheckInCommand): Promise<CheckIn | undefined> {
    const existing = await this.db.checkIns
      .where("[practiceId+occurredOn]")
      .equals([command.practiceId, command.occurredOn])
      .first();
    if (existing?.deletedAt === null) {
      return this.remove(command.practiceId, command.occurredOn);
    }
    return this.record(command);
  }

  async insertImported(records: CheckIn[]): Promise<void> {
    const parsed = records.map((record) => checkInSchema.parse(record));
    await this.db.transaction("rw", this.db.checkIns, async () => {
      await this.db.checkIns.bulkPut(parsed);
    });
  }

  private now(): ISOInstant {
    return nowInstant(this.dependencies.clock ?? systemClock);
  }

  private idFactory(): IdFactory {
    return this.dependencies.idFactory ?? createEntityId;
  }
}
