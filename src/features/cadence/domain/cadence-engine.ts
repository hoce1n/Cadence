import type {
  CadenceRule,
  CheckIn,
  EntityId,
  ISODate,
  Practice,
  ReturnPlan,
  Season,
  Weekday,
} from "./types.ts";

export interface ExpectedOccurrence {
  /** A canonical identifier for the expected day or weekly target period. */
  key: ISODate;
  /** The first local date represented by this expectation. */
  startOn: ISODate;
  /** The last local date represented by this expectation. */
  endOn: ISODate;
  /** Daily/pattern expectations are one return; weekly targets may require more. */
  targetCount: number;
}

export interface QuietAssessment {
  isQuiet: boolean;
  eligibleSince: ISODate | null;
  missedExpectedOccurrences: number;
  intervalElapsed: boolean;
  lastCheckInOn: ISODate | null;
}

export type PracticeJourneyState =
  | { kind: "intentional_pause"; season: Season }
  | { kind: "return_plan_active"; plan: ReturnPlan }
  | { kind: "returned"; plan: ReturnPlan }
  | { kind: "quiet"; assessment: QuietAssessment }
  | { kind: "normal" };

export interface ResolvePracticeJourneyInput {
  practice: Practice;
  checkIns: readonly CheckIn[];
  returnPlans: readonly ReturnPlan[];
  seasons: readonly Season[];
  today: ISODate;
  /** The last date on which the user chose not to see the quiet invitation. */
  dismissedQuietPromptUntil: ISODate | null;
  /** A completed plan explicitly acknowledged by the current client session. */
  completedReturnPlanIdInSession?: EntityId | null;
}

interface DateParts {
  year: number;
  month: number;
  day: number;
}

function parseDate(value: ISODate): DateParts {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function formatDate(parts: DateParts): ISODate {
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}` as ISODate;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

/** Converts a Gregorian local date to a stable day number without Date APIs. */
function toDayNumber(value: ISODate): number {
  const { year, month, day } = parseDate(value);
  const adjustedYear = year - (month <= 2 ? 1 : 0);
  const era = Math.floor(adjustedYear / 400);
  const yearOfEra = adjustedYear - era * 400;
  const adjustedMonth = month + (month > 2 ? -3 : 9);
  const dayOfYear = Math.floor((153 * adjustedMonth + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * 146097 + dayOfEra;
}

export function compareIsoDates(left: ISODate, right: ISODate): number {
  return left === right ? 0 : left < right ? -1 : 1;
}

export function differenceInLocalDays(later: ISODate, earlier: ISODate): number {
  return toDayNumber(later) - toDayNumber(earlier);
}

export function addLocalDays(value: ISODate, days: number): ISODate {
  let { year, month, day } = parseDate(value);
  let remaining = days;

  while (remaining > 0) {
    const monthDays = daysInMonth(year, month);
    if (day < monthDays) {
      day += 1;
    } else if (month === 12) {
      year += 1;
      month = 1;
      day = 1;
    } else {
      month += 1;
      day = 1;
    }
    remaining -= 1;
  }

  while (remaining < 0) {
    if (day > 1) {
      day -= 1;
    } else if (month === 1) {
      year -= 1;
      month = 12;
      day = 31;
    } else {
      month -= 1;
      day = daysInMonth(year, month);
    }
    remaining += 1;
  }

  return formatDate({ year, month, day });
}

export function previousLocalDay(value: ISODate): ISODate {
  return addLocalDays(value, -1);
}

/** Monday = 1 through Sunday = 7, matching Cadence's Weekday contract. */
export function weekdayOf(value: ISODate): Weekday {
  const unixEpoch = "1970-01-01" as ISODate; // Thursday.
  return (modulo(differenceInLocalDays(value, unixEpoch) + 3, 7) + 1) as Weekday;
}

export function startOfLocalWeek(value: ISODate): ISODate {
  return addLocalDays(value, -(weekdayOf(value) - 1));
}

function endOfLocalWeek(value: ISODate): ISODate {
  return addLocalDays(startOfLocalWeek(value), 6);
}

function datesInRange(startOn: ISODate, endOn: ISODate): ISODate[] {
  if (compareIsoDates(startOn, endOn) > 0) return [];
  const dates: ISODate[] = [];
  for (
    let cursor = startOn;
    compareIsoDates(cursor, endOn) <= 0;
    cursor = addLocalDays(cursor, 1)
  ) {
    dates.push(cursor);
  }
  return dates;
}

/**
 * Calculates expected commitments in a range. Weekly targets are represented
 * once per week with targetCount, rather than inventing arbitrary weekdays.
 */
export function getExpectedOccurrences(input: {
  cadence: CadenceRule;
  anchorOn: ISODate;
  rangeStartOn: ISODate;
  rangeEndOn: ISODate;
}): ExpectedOccurrence[] {
  const rangeStart =
    compareIsoDates(input.rangeStartOn, input.anchorOn) < 0 ? input.anchorOn : input.rangeStartOn;
  if (compareIsoDates(rangeStart, input.rangeEndOn) > 0) return [];

  if (input.cadence.kind === "daily") {
    const { everyDays } = input.cadence;
    return datesInRange(rangeStart, input.rangeEndOn)
      .filter((date) => differenceInLocalDays(date, input.anchorOn) % everyDays === 0)
      .map((date) => ({ key: date, startOn: date, endOn: date, targetCount: 1 }));
  }

  if (input.cadence.kind === "weekly_pattern") {
    const weekdays = new Set(input.cadence.weekdays);
    return datesInRange(rangeStart, input.rangeEndOn)
      .filter((date) => weekdays.has(weekdayOf(date)))
      .map((date) => ({ key: date, startOn: date, endOn: date, targetCount: 1 }));
  }

  const firstWeekStart = startOfLocalWeek(rangeStart);
  const lastWeekStart = startOfLocalWeek(input.rangeEndOn);
  const occurrences: ExpectedOccurrence[] = [];
  for (
    let weekStartOn = firstWeekStart;
    compareIsoDates(weekStartOn, lastWeekStart) <= 0;
    weekStartOn = addLocalDays(weekStartOn, 7)
  ) {
    const weekEndOn = endOfLocalWeek(weekStartOn);
    if (compareIsoDates(weekEndOn, input.anchorOn) < 0) continue;
    occurrences.push({
      key: weekStartOn,
      startOn: weekStartOn,
      endOn: weekEndOn,
      targetCount: input.cadence.targetCount,
    });
  }
  return occurrences;
}

export function cadenceIntervalDays(cadence: CadenceRule): number {
  if (cadence.kind === "daily") return cadence.everyDays;
  if (cadence.kind === "weekly_pattern") return 7 / cadence.weekdays.length;
  return 7 / cadence.targetCount;
}

function liveCheckInsForPractice(
  checkIns: readonly CheckIn[],
  practiceId: EntityId,
  today: ISODate,
): CheckIn[] {
  return checkIns.filter(
    (checkIn) =>
      checkIn.practiceId === practiceId &&
      checkIn.deletedAt === null &&
      compareIsoDates(checkIn.occurredOn, today) <= 0,
  );
}

function checkInsInOccurrence(
  checkIns: readonly CheckIn[],
  occurrence: ExpectedOccurrence,
): number {
  return checkIns.filter(
    (checkIn) =>
      compareIsoDates(checkIn.occurredOn, occurrence.startOn) >= 0 &&
      compareIsoDates(checkIn.occurredOn, occurrence.endOn) <= 0,
  ).length;
}

/**
 * Counts expectations that are definitively in the past. Today is intentionally
 * excluded so an unfinished current day never becomes a premature lapse.
 */
export function missedExpectedOccurrences(input: {
  practice: Practice;
  checkIns: readonly CheckIn[];
  today: ISODate;
}): { count: number; mostRecentMissedOn: ISODate | null } {
  if (compareIsoDates(input.practice.createdOn, input.today) >= 0) {
    return { count: 0, mostRecentMissedOn: null };
  }

  const completed = liveCheckInsForPractice(input.checkIns, input.practice.id, input.today);
  const expected = getExpectedOccurrences({
    cadence: input.practice.cadence,
    anchorOn: input.practice.createdOn,
    rangeStartOn: input.practice.createdOn,
    rangeEndOn: previousLocalDay(input.today),
  });

  let count = 0;
  let mostRecentMissedOn: ISODate | null = null;
  const lastCompletedDay = previousLocalDay(input.today);
  for (const occurrence of expected) {
    if (compareIsoDates(occurrence.endOn, lastCompletedDay) > 0) continue;
    const recorded = checkInsInOccurrence(completed, occurrence);
    const missing = Math.max(0, occurrence.targetCount - recorded);
    if (missing > 0) mostRecentMissedOn = occurrence.endOn;
    count += missing;
  }
  return { count, mostRecentMissedOn };
}

export function assessQuietness(input: {
  practice: Practice;
  checkIns: readonly CheckIn[];
  today: ISODate;
}): QuietAssessment {
  const completed = liveCheckInsForPractice(input.checkIns, input.practice.id, input.today).sort(
    (left, right) => compareIsoDates(left.occurredOn, right.occurredOn),
  );
  const lastCheckInOn = completed.at(-1)?.occurredOn ?? null;
  const missed = missedExpectedOccurrences(input);
  const referenceOn = lastCheckInOn ?? input.practice.createdOn;
  const intervalElapsed =
    differenceInLocalDays(input.today, referenceOn) >=
    cadenceIntervalDays(input.practice.cadence) * 1.5;
  const isQuiet = missed.count >= 2 || intervalElapsed;

  return {
    isQuiet,
    eligibleSince: isQuiet ? (missed.mostRecentMissedOn ?? input.today) : null,
    missedExpectedOccurrences: missed.count,
    intervalElapsed,
    lastCheckInOn,
  };
}

export function isSeasonApplicableToPractice(input: {
  season: Season;
  practiceId: EntityId;
  today: ISODate;
}): boolean {
  const { season, practiceId, today } = input;
  if (season.deletedAt !== null || season.kind !== "pause") return false;
  if (compareIsoDates(season.startOn, today) > 0) return false;
  if (season.endOn !== null && compareIsoDates(season.endOn, today) < 0) return false;
  return season.scope.kind === "all_practices" || season.scope.practiceIds.includes(practiceId);
}

export function findApplicablePauseSeason(input: {
  seasons: readonly Season[];
  practiceId: EntityId;
  today: ISODate;
}): Season | undefined {
  return input.seasons
    .filter((season) =>
      isSeasonApplicableToPractice({ season, practiceId: input.practiceId, today: input.today }),
    )
    .sort((left, right) => {
      const startComparison = compareIsoDates(right.startOn, left.startOn);
      return startComparison !== 0 ? startComparison : right.id.localeCompare(left.id);
    })[0];
}

export function isQuietPromptDismissed(today: ISODate, dismissedUntil: ISODate | null): boolean {
  return dismissedUntil !== null && compareIsoDates(today, dismissedUntil) <= 0;
}

function activeReturnPlan(
  returnPlans: readonly ReturnPlan[],
  practiceId: EntityId,
): ReturnPlan | undefined {
  return returnPlans
    .filter(
      (plan) =>
        plan.practiceId === practiceId && plan.deletedAt === null && plan.status === "active",
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];
}

function completedPlanInSession(
  returnPlans: readonly ReturnPlan[],
  practiceId: EntityId,
  completedReturnPlanIdInSession: EntityId | null | undefined,
): ReturnPlan | undefined {
  if (!completedReturnPlanIdInSession) return undefined;
  return returnPlans.find(
    (plan) =>
      plan.id === completedReturnPlanIdInSession &&
      plan.practiceId === practiceId &&
      plan.deletedAt === null &&
      plan.status === "completed",
  );
}

/**
 * Resolves the UI journey state without side effects. Priority is deliberate:
 * an intentional pause wins over all recovery messaging, followed by an active
 * plan, a session-scoped returned acknowledgement, quietness, then normal.
 */
export function resolvePracticeJourney(input: ResolvePracticeJourneyInput): PracticeJourneyState {
  const pause = findApplicablePauseSeason({
    seasons: input.seasons,
    practiceId: input.practice.id,
    today: input.today,
  });
  if (pause) return { kind: "intentional_pause", season: pause };

  const plan = activeReturnPlan(input.returnPlans, input.practice.id);
  if (plan) return { kind: "return_plan_active", plan };

  const completedPlan = completedPlanInSession(
    input.returnPlans,
    input.practice.id,
    input.completedReturnPlanIdInSession,
  );
  if (completedPlan) return { kind: "returned", plan: completedPlan };

  const quiet = assessQuietness({
    practice: input.practice,
    checkIns: input.checkIns,
    today: input.today,
  });
  if (quiet.isQuiet && !isQuietPromptDismissed(input.today, input.dismissedQuietPromptUntil)) {
    return { kind: "quiet", assessment: quiet };
  }

  return { kind: "normal" };
}
