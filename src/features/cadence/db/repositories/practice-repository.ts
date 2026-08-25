import type { CadenceDatabase } from "../cadence-db.ts";
import { practiceSchema } from "../../domain/schemas.ts";
import type {
  CadenceRule,
  EntityId,
  ISODate,
  Practice,
  PracticeColor,
} from "../../domain/types.ts";
import {
  createEntityId,
  EntityNotFoundError,
  nowInstant,
  type Clock,
  type IdFactory,
  systemClock,
} from "./repository-utils.ts";

export interface CreatePracticeCommand {
  name: string;
  color: PracticeColor;
  cadence: CadenceRule;
  createdOn: ISODate;
  minimumVersion?: string | null;
}

export interface UpdatePracticeCommand {
  name?: string;
  color?: PracticeColor;
  cadence?: CadenceRule;
  minimumVersion?: string | null;
}

export class PracticeRepository {
  private readonly db: CadenceDatabase;
  private readonly dependencies: { clock?: Clock; idFactory?: IdFactory };

  constructor(db: CadenceDatabase, dependencies: { clock?: Clock; idFactory?: IdFactory } = {}) {
    this.db = db;
    this.dependencies = dependencies;
  }

  async get(id: EntityId): Promise<Practice | undefined> {
    const practice = await this.db.practices.get(id);
    return practice?.deletedAt === null ? practice : undefined;
  }

  async listActive(): Promise<Practice[]> {
    return this.db.practices
      .where("lifecycle")
      .equals("active")
      .filter((item) => item.deletedAt === null)
      .toArray();
  }

  async create(command: CreatePracticeCommand): Promise<Practice> {
    const instant = this.now();
    const practice = practiceSchema.parse({
      id: this.idFactory()(),
      schemaVersion: 1,
      name: command.name,
      color: command.color,
      cadence: command.cadence,
      minimumVersion: command.minimumVersion ?? null,
      lifecycle: "active",
      createdOn: command.createdOn,
      createdAt: instant,
      updatedAt: instant,
      deletedAt: null,
    });

    await this.db.transaction("rw", this.db.practices, async () => {
      await this.db.practices.add(practice);
    });
    return practice;
  }

  async update(id: EntityId, command: UpdatePracticeCommand): Promise<Practice> {
    return this.db.transaction("rw", this.db.practices, async () => {
      const existing = await this.requireLive(id);
      const updated = practiceSchema.parse({
        ...existing,
        ...command,
        updatedAt: this.now(),
      });
      await this.db.practices.put(updated);
      return updated;
    });
  }

  async archive(id: EntityId): Promise<Practice> {
    return this.updateLifecycle(id, "archived");
  }

  async restore(id: EntityId): Promise<Practice> {
    return this.updateLifecycle(id, "active");
  }

  async softDelete(id: EntityId): Promise<Practice> {
    return this.db.transaction("rw", this.db.practices, async () => {
      const existing = await this.requireLive(id);
      const updated = practiceSchema.parse({
        ...existing,
        updatedAt: this.now(),
        deletedAt: this.now(),
      });
      await this.db.practices.put(updated);
      return updated;
    });
  }

  async insertImported(records: Practice[]): Promise<void> {
    const parsed = records.map((record) => practiceSchema.parse(record));
    await this.db.transaction("rw", this.db.practices, async () => {
      await this.db.practices.bulkPut(parsed);
    });
  }

  private async updateLifecycle(id: EntityId, lifecycle: Practice["lifecycle"]): Promise<Practice> {
    return this.db.transaction("rw", this.db.practices, async () => {
      const existing = await this.requireLive(id);
      const updated = practiceSchema.parse({ ...existing, lifecycle, updatedAt: this.now() });
      await this.db.practices.put(updated);
      return updated;
    });
  }

  private async requireLive(id: EntityId): Promise<Practice> {
    const practice = await this.db.practices.get(id);
    if (!practice || practice.deletedAt !== null) {
      throw new EntityNotFoundError("Practice", id);
    }
    return practice;
  }

  private now(): string {
    return nowInstant(this.dependencies.clock ?? systemClock);
  }

  private idFactory(): IdFactory {
    return this.dependencies.idFactory ?? createEntityId;
  }
}
