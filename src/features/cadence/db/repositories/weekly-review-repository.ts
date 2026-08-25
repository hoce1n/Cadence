import type { CadenceDatabase } from "../cadence-db.ts";
import { weeklyReviewSchema } from "../../domain/schemas.ts";
import type { ISODate, ISOInstant, WeeklyReview } from "../../domain/types.ts";
import {
  createEntityId,
  nowInstant,
  type Clock,
  type IdFactory,
  systemClock,
} from "./repository-utils.ts";

export interface SaveWeeklyReviewCommand {
  weekStartOn: ISODate;
  madeReturningEasier?: string | null;
  gotInTheWay?: string | null;
  nextProtection?: string | null;
}

export class WeeklyReviewRepository {
  private readonly db: CadenceDatabase;
  private readonly dependencies: { clock?: Clock; idFactory?: IdFactory };

  constructor(db: CadenceDatabase, dependencies: { clock?: Clock; idFactory?: IdFactory } = {}) {
    this.db = db;
    this.dependencies = dependencies;
  }

  async getForWeek(weekStartOn: ISODate): Promise<WeeklyReview | undefined> {
    const reviews = await this.db.weeklyReviews.where("weekStartOn").equals(weekStartOn).toArray();
    return reviews.find((review) => review.deletedAt === null);
  }

  async save(command: SaveWeeklyReviewCommand): Promise<WeeklyReview> {
    return this.db.transaction("rw", this.db.weeklyReviews, async () => {
      const existing = await this.getForWeek(command.weekStartOn);
      const instant = this.now();
      const review = weeklyReviewSchema.parse({
        id: existing?.id ?? this.idFactory()(),
        schemaVersion: 1,
        weekStartOn: command.weekStartOn,
        madeReturningEasier: command.madeReturningEasier ?? existing?.madeReturningEasier ?? null,
        gotInTheWay: command.gotInTheWay ?? existing?.gotInTheWay ?? null,
        nextProtection: command.nextProtection ?? existing?.nextProtection ?? null,
        createdAt: existing?.createdAt ?? instant,
        updatedAt: instant,
        deletedAt: null,
      });
      await this.db.weeklyReviews.put(review);
      return review;
    });
  }

  async softDeleteForWeek(weekStartOn: ISODate): Promise<WeeklyReview | undefined> {
    return this.db.transaction("rw", this.db.weeklyReviews, async () => {
      const existing = await this.getForWeek(weekStartOn);
      if (!existing) return undefined;
      const deleted = weeklyReviewSchema.parse({
        ...existing,
        updatedAt: this.now(),
        deletedAt: this.now(),
      });
      await this.db.weeklyReviews.put(deleted);
      return deleted;
    });
  }

  async insertImported(records: WeeklyReview[]): Promise<void> {
    const parsed = records.map((record) => weeklyReviewSchema.parse(record));
    await this.db.transaction("rw", this.db.weeklyReviews, async () => {
      await this.db.weeklyReviews.bulkPut(parsed);
    });
  }

  private now(): ISOInstant {
    return nowInstant(this.dependencies.clock ?? systemClock);
  }

  private idFactory(): IdFactory {
    return this.dependencies.idFactory ?? createEntityId;
  }
}
