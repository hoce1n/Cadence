import type { CadenceDatabase } from "../cadence-db.ts";
import { returnPlanSchema } from "../../domain/schemas.ts";
import type {
  EntityId,
  ISODate,
  ISOInstant,
  ReturnPlan,
  ReturnPlanKind,
  ReturnPlanSource,
} from "../../domain/types.ts";
import {
  createEntityId,
  EntityConflictError,
  EntityNotFoundError,
  nowInstant,
  type Clock,
  type IdFactory,
  systemClock,
} from "./repository-utils.ts";

export interface StartReturnPlanCommand {
  practiceId: EntityId;
  source: ReturnPlanSource;
  kind: ReturnPlanKind;
  commitmentText: string;
  startOn: ISODate;
  endOn: ISODate;
  anchor?: ReturnPlan["anchor"];
  reminder?: ReturnPlan["reminder"];
}

export class ReturnPlanRepository {
  private readonly db: CadenceDatabase;
  private readonly dependencies: { clock?: Clock; idFactory?: IdFactory };

  constructor(db: CadenceDatabase, dependencies: { clock?: Clock; idFactory?: IdFactory } = {}) {
    this.db = db;
    this.dependencies = dependencies;
  }

  async getActiveForPractice(practiceId: EntityId): Promise<ReturnPlan | undefined> {
    const plans = await this.db.returnPlans
      .where("[practiceId+status]")
      .equals([practiceId, "active"])
      .toArray();
    return plans.find((plan) => plan.deletedAt === null);
  }

  async start(command: StartReturnPlanCommand): Promise<ReturnPlan> {
    return this.db.transaction("rw", this.db.practices, this.db.returnPlans, async () => {
      const practice = await this.db.practices.get(command.practiceId);
      if (!practice || practice.deletedAt !== null || practice.lifecycle !== "active") {
        throw new EntityNotFoundError("Active practice", command.practiceId);
      }

      const active = await this.getActiveForPractice(command.practiceId);
      if (active) {
        throw new EntityConflictError("A practice can have only one active Return Plan.");
      }

      const instant = this.now();
      const plan = returnPlanSchema.parse({
        id: this.idFactory()(),
        schemaVersion: 1,
        practiceId: command.practiceId,
        source: command.source,
        kind: command.kind,
        commitmentText: command.commitmentText,
        targetCheckIns: 1,
        startOn: command.startOn,
        endOn: command.endOn,
        anchor: command.anchor ?? null,
        reminder: command.reminder ?? null,
        status: "active",
        completedAt: null,
        createdAt: instant,
        updatedAt: instant,
        deletedAt: null,
      });
      await this.db.returnPlans.add(plan);
      return plan;
    });
  }

  async complete(id: EntityId, completedAt: ISOInstant = this.now()): Promise<ReturnPlan> {
    return this.transition(id, "completed", completedAt);
  }

  async cancel(id: EntityId): Promise<ReturnPlan> {
    return this.transition(id, "cancelled", null);
  }

  async expire(id: EntityId): Promise<ReturnPlan> {
    return this.transition(id, "expired", null);
  }

  async expireDue(today: ISODate): Promise<ReturnPlan[]> {
    return this.db.transaction("rw", this.db.returnPlans, async () => {
      const activePlans = await this.db.returnPlans.toArray();
      const due = activePlans.filter(
        (plan) => plan.status === "active" && plan.deletedAt === null && plan.endOn < today,
      );
      const updated = due.map((plan) =>
        returnPlanSchema.parse({
          ...plan,
          status: "expired",
          completedAt: null,
          updatedAt: this.now(),
        }),
      );
      await this.db.returnPlans.bulkPut(updated);
      return updated;
    });
  }

  async insertImported(records: ReturnPlan[]): Promise<void> {
    const parsed = records.map((record) => returnPlanSchema.parse(record));
    await this.db.transaction("rw", this.db.returnPlans, async () => {
      await this.db.returnPlans.bulkPut(parsed);
    });
  }

  private async transition(
    id: EntityId,
    status: Exclude<ReturnPlan["status"], "active">,
    completedAt: ISOInstant | null,
  ): Promise<ReturnPlan> {
    return this.db.transaction("rw", this.db.returnPlans, async () => {
      const plan = await this.db.returnPlans.get(id);
      if (!plan || plan.deletedAt !== null) throw new EntityNotFoundError("Return Plan", id);
      if (plan.status !== "active") {
        throw new EntityConflictError("Only an active Return Plan can change state.");
      }
      const updated = returnPlanSchema.parse({
        ...plan,
        status,
        completedAt,
        updatedAt: this.now(),
      });
      await this.db.returnPlans.put(updated);
      return updated;
    });
  }

  private now(): ISOInstant {
    return nowInstant(this.dependencies.clock ?? systemClock);
  }

  private idFactory(): IdFactory {
    return this.dependencies.idFactory ?? createEntityId;
  }
}
