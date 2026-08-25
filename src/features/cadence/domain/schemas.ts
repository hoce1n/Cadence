import { z } from "zod";

export const SCHEMA_VERSION = 1 as const;

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected an ISO calendar date (YYYY-MM-DD)");

export const isoInstantSchema = z
  .string()
  .datetime({ offset: true, message: "Expected an ISO instant with an offset" });

export const entityIdSchema = z.string().uuid("Expected a UUID entity identifier");

export const practiceColorSchema = z.enum([
  "sage",
  "teal",
  "slate",
  "clay",
  "rose",
  "olive",
  "ink",
]);

export const weekdaySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
]);

export const cadenceRuleSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("daily"),
    everyDays: z.number().int().min(1).max(14),
  }),
  z.object({
    kind: z.literal("weekly_pattern"),
    weekdays: z.array(weekdaySchema).min(1).max(7),
  }),
  z.object({
    kind: z.literal("weekly_target"),
    targetCount: z.number().int().min(1).max(7),
  }),
]);

const entityAuditSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  createdAt: isoInstantSchema,
  updatedAt: isoInstantSchema,
  deletedAt: isoInstantSchema.nullable(),
});

export const practiceSchema = entityAuditSchema.extend({
  id: entityIdSchema,
  name: z.string().trim().min(1).max(40),
  color: practiceColorSchema,
  cadence: cadenceRuleSchema,
  minimumVersion: z.string().trim().min(1).max(120).nullable(),
  lifecycle: z.enum(["active", "archived"]),
  createdOn: isoDateSchema,
});

export const checkInSchema = entityAuditSchema.extend({
  id: entityIdSchema,
  practiceId: entityIdSchema,
  occurredOn: isoDateSchema,
  completedAt: isoInstantSchema,
  returnPlanId: entityIdSchema.nullable(),
  note: z.string().trim().min(1).max(280).nullable(),
});

export const returnPlanAnchorSchema = z.object({
  kind: z.enum(["after_event", "weekday", "free_text"]),
  value: z.string().trim().min(1).max(80),
});

export const returnPlanReminderSchema = z.object({
  localTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected HH:MM"),
  timezone: z.string().trim().min(1).max(80),
});

export const returnPlanSchema = entityAuditSchema
  .extend({
    id: entityIdSchema,
    practiceId: entityIdSchema,
    source: z.enum(["manual", "quiet_invitation"]),
    kind: z.enum(["one_return", "smaller_version", "custom"]),
    commitmentText: z.string().trim().min(1).max(140),
    targetCheckIns: z.literal(1),
    startOn: isoDateSchema,
    endOn: isoDateSchema,
    anchor: returnPlanAnchorSchema.nullable(),
    reminder: returnPlanReminderSchema.nullable(),
    status: z.enum(["active", "completed", "expired", "cancelled"]),
    completedAt: isoInstantSchema.nullable(),
  })
  .superRefine((value, context) => {
    if (value.endOn < value.startOn) {
      context.addIssue({
        code: "custom",
        path: ["endOn"],
        message: "endOn must be on or after startOn",
      });
    }
    if (value.status === "completed" && value.completedAt === null) {
      context.addIssue({
        code: "custom",
        path: ["completedAt"],
        message: "Completed Return Plans require completedAt",
      });
    }
    if (value.status !== "completed" && value.completedAt !== null) {
      context.addIssue({
        code: "custom",
        path: ["completedAt"],
        message: "Only completed Return Plans may have completedAt",
      });
    }
  });

export const seasonScopeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("all_practices") }),
  z.object({
    kind: z.literal("selected_practices"),
    practiceIds: z.array(entityIdSchema).min(1).max(12),
  }),
]);

export const seasonSchema = entityAuditSchema
  .extend({
    id: entityIdSchema,
    label: z.string().trim().min(1).max(60),
    kind: z.enum(["pause", "focus", "travel", "recovery", "custom"]),
    scope: seasonScopeSchema,
    startOn: isoDateSchema,
    endOn: isoDateSchema.nullable(),
    suppressQuietPrompts: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.endOn !== null && value.endOn < value.startOn) {
      context.addIssue({
        code: "custom",
        path: ["endOn"],
        message: "endOn must be on or after startOn",
      });
    }
  });

export const weeklyReviewSchema = entityAuditSchema.extend({
  id: entityIdSchema,
  weekStartOn: isoDateSchema,
  madeReturningEasier: z.string().trim().min(1).max(500).nullable(),
  gotInTheWay: z.string().trim().min(1).max(500).nullable(),
  nextProtection: z.string().trim().min(1).max(500).nullable(),
});

export const metaRecordSchema = entityAuditSchema.extend({
  key: z.string().trim().min(1).max(120),
  value: z.string().max(10_000),
});

export const cadenceExportDocumentSchema = z.object({
  format: z.literal("cadence-export"),
  formatVersion: z.literal(SCHEMA_VERSION),
  exportedAt: isoInstantSchema,
  practices: z.array(practiceSchema),
  checkIns: z.array(checkInSchema),
  returnPlans: z.array(returnPlanSchema),
  seasons: z.array(seasonSchema),
  weeklyReviews: z.array(weeklyReviewSchema),
  meta: z.array(metaRecordSchema),
});

export type PracticeInput = z.input<typeof practiceSchema>;
export type CheckInInput = z.input<typeof checkInSchema>;
export type ReturnPlanInput = z.input<typeof returnPlanSchema>;
export type SeasonInput = z.input<typeof seasonSchema>;
export type WeeklyReviewInput = z.input<typeof weeklyReviewSchema>;
export type MetaRecordInput = z.input<typeof metaRecordSchema>;
