import type { CadenceDatabase } from "../cadence-db.ts";
import { metaRecordSchema } from "../../domain/schemas.ts";
import type { ISOInstant, MetaRecord } from "../../domain/types.ts";
import { nowInstant, type Clock, systemClock } from "./repository-utils.ts";

export class MetaRepository {
  private readonly db: CadenceDatabase;
  private readonly dependencies: { clock?: Clock };

  constructor(db: CadenceDatabase, dependencies: { clock?: Clock } = {}) {
    this.db = db;
    this.dependencies = dependencies;
  }

  async get(key: string): Promise<MetaRecord | undefined> {
    const record = await this.db.meta.get(key);
    return record?.deletedAt === null ? record : undefined;
  }

  async has(key: string): Promise<boolean> {
    return Boolean(await this.get(key));
  }

  async set(key: string, value: string): Promise<MetaRecord> {
    return this.db.transaction("rw", this.db.meta, async () => {
      const existing = await this.db.meta.get(key);
      const instant = this.now();
      const record = metaRecordSchema.parse({
        key,
        value,
        schemaVersion: 1,
        createdAt: existing?.createdAt ?? instant,
        updatedAt: instant,
        deletedAt: null,
      });
      await this.db.meta.put(record);
      return record;
    });
  }

  async softDelete(key: string): Promise<MetaRecord | undefined> {
    return this.db.transaction("rw", this.db.meta, async () => {
      const existing = await this.get(key);
      if (!existing) return undefined;
      const deleted = metaRecordSchema.parse({
        ...existing,
        updatedAt: this.now(),
        deletedAt: this.now(),
      });
      await this.db.meta.put(deleted);
      return deleted;
    });
  }

  private now(): ISOInstant {
    return nowInstant(this.dependencies.clock ?? systemClock);
  }
}
