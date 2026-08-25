import type { z } from "zod";
import type {
  cadenceExportDocumentSchema,
  cadenceRuleSchema,
  checkInSchema,
  entityIdSchema,
  isoDateSchema,
  isoInstantSchema,
  metaRecordSchema,
  practiceColorSchema,
  practiceSchema,
  returnPlanSchema,
  seasonSchema,
  weekdaySchema,
  weeklyReviewSchema,
} from "./schemas.ts";

export type EntityId = z.infer<typeof entityIdSchema>;
export type ISODate = z.infer<typeof isoDateSchema>;
export type ISOInstant = z.infer<typeof isoInstantSchema>;
export type Weekday = z.infer<typeof weekdaySchema>;
export type PracticeColor = z.infer<typeof practiceColorSchema>;
export type CadenceRule = z.infer<typeof cadenceRuleSchema>;

export type Practice = z.infer<typeof practiceSchema>;
export type CheckIn = z.infer<typeof checkInSchema>;
export type ReturnPlan = z.infer<typeof returnPlanSchema>;
export type Season = z.infer<typeof seasonSchema>;
export type WeeklyReview = z.infer<typeof weeklyReviewSchema>;
export type MetaRecord = z.infer<typeof metaRecordSchema>;
export type CadenceExportDocument = z.infer<typeof cadenceExportDocumentSchema>;

export type ReturnPlanStatus = ReturnPlan["status"];
export type ReturnPlanSource = ReturnPlan["source"];
export type ReturnPlanKind = ReturnPlan["kind"];
export type SeasonKind = Season["kind"];
export type SeasonScope = Season["scope"];
