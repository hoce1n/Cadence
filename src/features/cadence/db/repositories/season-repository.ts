import type { CadenceDatabase } from "../cadence-db.ts";
import { seasonSchema } from "../../domain/schemas.ts";
import type {
  EntityId,
  ISODate,
  ISOInstant,
  Season,
  SeasonKind,
  SeasonScope,
} from "../../domain/types.ts";
import {
  createEntityId,
  EntityNotFoundError,
  nowInstant,
  type Clock,
  type IdFactory,
  systemClock,
} from "./repository-utils.ts";

export interface StartSeasonCommand {
  label: string;
  kind: SeasonKind;
  scope: SeasonScope;
  startOn: ISODate;
  endOn?: ISODate | null;
  suppressQuietPrompts?: boolean;
}

export class SeasonRepository {
  private readonly db: CadenceDatabase;
  private readonly dependencies: { clock?: Clock; idFactory?: IdFactory };

  constructor(db: CadenceDatabase, dependencies: { clock?: Clock; idFactory?: IdFactory } = {}) {
    this.db = db;
    this.dependencies = dependencies;
  }

  async listIntersecting(startOn: ISODate, endOn: ISODate): Promise<Season[]> {
    const seasons = await this.db.seasons.toArray();
    return seasons.filter(
      (season) =>
        season.deletedAt === null &&
        season.startOn <= endOn &&
        (season.endOn === null || season.endOn >= startOn),
    );
  }

  async start(command: StartSeasonCommand): Promise<Season> {
    const instant = this.now();
    const season = seasonSchema.parse({
      id: this.idFactory()(),
      schemaVersion: 1,
      label: command.label,
      kind: command.kind,
      scope: command.scope,
      startOn: command.startOn,
      endOn: command.endOn ?? null,
      suppressQuietPrompts: command.suppressQuietPrompts ?? command.kind === "pause",
      createdAt: instant,
      updatedAt: instant,
      deletedAt: null,
    });
    await this.db.transaction("rw", this.db.seasons, async () => {
      await this.db.seasons.add(season);
    });
    return season;
  }

  async end(id: EntityId, endOn: ISODate): Promise<Season> {
    return this.db.transaction("rw", this.db.seasons, async () => {
      const existing = await this.requireLive(id);
      const updated = seasonSchema.parse({ ...existing, endOn, updatedAt: this.now() });
      await this.db.seasons.put(updated);
      return updated;
    });
  }

  async softDelete(id: EntityId): Promise<Season> {
    return this.db.transaction("rw", this.db.seasons, async () => {
      const existing = await this.requireLive(id);
      const updated = seasonSchema.parse({
        ...existing,
        updatedAt: this.now(),
        deletedAt: this.now(),
      });
      await this.db.seasons.put(updated);
      return updated;
    });
  }

  async insertImported(records: Season[]): Promise<void> {
    const parsed = records.map((record) => seasonSchema.parse(record));
    await this.db.transaction("rw", this.db.seasons, async () => {
      await this.db.seasons.bulkPut(parsed);
    });
  }

  private async requireLive(id: EntityId): Promise<Season> {
    const season = await this.db.seasons.get(id);
    if (!season || season.deletedAt !== null) throw new EntityNotFoundError("Season", id);
    return season;
  }

  private now(): ISOInstant {
    return nowInstant(this.dependencies.clock ?? systemClock);
  }

  private idFactory(): IdFactory {
    return this.dependencies.idFactory ?? createEntityId;
  }
}
