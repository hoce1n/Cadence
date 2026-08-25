import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assessQuietness,
  getExpectedOccurrences,
  isSeasonApplicableToPractice,
  resolvePracticeJourney,
} from "./cadence-engine.ts";
import type {
  CadenceRule,
  CheckIn,
  EntityId,
  ISODate,
  Practice,
  ReturnPlan,
  Season,
} from "./types.ts";

const PRACTICE_ID = "00000000-0000-4000-8000-000000000001" as EntityId;
const SECOND_PRACTICE_ID = "00000000-0000-4000-8000-000000000002" as EntityId;
const RETURN_PLAN_ID = "00000000-0000-4000-8000-000000000003" as EntityId;
const SEASON_ID = "00000000-0000-4000-8000-000000000004" as EntityId;
const INSTANT = "2026-08-01T09:00:00.000Z";

function practice(overrides: Partial<Practice> = {}): Practice {
  return {
    id: PRACTICE_ID,
    schemaVersion: 1,
    name: "Read",
    color: "sage",
    cadence: { kind: "daily", everyDays: 1 },
    minimumVersion: null,
    lifecycle: "active",
    createdOn: "2026-08-01",
    createdAt: INSTANT,
    updatedAt: INSTANT,
    deletedAt: null,
    ...overrides,
  };
}

function checkIn(occurredOn: ISODate, overrides: Partial<CheckIn> = {}): CheckIn {
  return {
    id: "00000000-0000-4000-8000-000000000010" as EntityId,
    schemaVersion: 1,
    practiceId: PRACTICE_ID,
    occurredOn,
    completedAt: INSTANT,
    returnPlanId: null,
    note: null,
    createdAt: INSTANT,
    updatedAt: INSTANT,
    deletedAt: null,
    ...overrides,
  };
}

function returnPlan(overrides: Partial<ReturnPlan> = {}): ReturnPlan {
  return {
    id: RETURN_PLAN_ID,
    schemaVersion: 1,
    practiceId: PRACTICE_ID,
    source: "quiet_invitation",
    kind: "one_return",
    commitmentText: "Read one page",
    targetCheckIns: 1,
    startOn: "2026-08-01",
    endOn: "2026-08-07",
    anchor: null,
    reminder: null,
    status: "active",
    completedAt: null,
    createdAt: INSTANT,
    updatedAt: INSTANT,
    deletedAt: null,
    ...overrides,
  };
}

function pauseSeason(overrides: Partial<Season> = {}): Season {
  return {
    id: SEASON_ID,
    schemaVersion: 1,
    label: "Recovery",
    kind: "pause",
    scope: { kind: "all_practices" },
    startOn: "2026-08-01",
    endOn: null,
    suppressQuietPrompts: true,
    createdAt: INSTANT,
    updatedAt: INSTANT,
    deletedAt: null,
    ...overrides,
  };
}

function occurrenceKeys(cadence: CadenceRule, anchorOn: ISODate, startOn: ISODate, endOn: ISODate) {
  return getExpectedOccurrences({
    cadence,
    anchorOn,
    rangeStartOn: startOn,
    rangeEndOn: endOn,
  }).map((occurrence) => `${occurrence.key}:${occurrence.targetCount}`);
}

describe("getExpectedOccurrences", () => {
  const cases: Array<{
    name: string;
    cadence: CadenceRule;
    anchorOn: ISODate;
    startOn: ISODate;
    endOn: ISODate;
    expected: string[];
  }> = [
    {
      name: "returns every second daily occurrence from the practice anchor",
      cadence: { kind: "daily", everyDays: 2 },
      anchorOn: "2026-08-01",
      startOn: "2026-08-01",
      endOn: "2026-08-07",
      expected: ["2026-08-01:1", "2026-08-03:1", "2026-08-05:1", "2026-08-07:1"],
    },
    {
      name: "returns only selected weekdays for a weekly pattern",
      cadence: { kind: "weekly_pattern", weekdays: [1, 4] },
      anchorOn: "2026-08-01",
      startOn: "2026-08-03",
      endOn: "2026-08-09",
      expected: ["2026-08-03:1", "2026-08-06:1"],
    },
    {
      name: "represents weekly targets as one count-bearing period per intersecting week",
      cadence: { kind: "weekly_target", targetCount: 3 },
      anchorOn: "2026-08-01",
      startOn: "2026-08-05",
      endOn: "2026-08-20",
      expected: ["2026-08-03:3", "2026-08-10:3", "2026-08-17:3"],
    },
  ];

  for (const testCase of cases) {
    it(testCase.name, () => {
      assert.deepEqual(
        occurrenceKeys(testCase.cadence, testCase.anchorOn, testCase.startOn, testCase.endOn),
        testCase.expected,
      );
    });
  }
});

describe("assessQuietness", () => {
  const cases: Array<{
    name: string;
    value: Practice;
    checkIns: CheckIn[];
    today: ISODate;
    expected: Pick<
      ReturnType<typeof assessQuietness>,
      "isQuiet" | "missedExpectedOccurrences" | "intervalElapsed"
    >;
  }> = [
    {
      name: "keeps a single missed daily occurrence normal",
      value: practice(),
      checkIns: [],
      today: "2026-08-02",
      expected: { isQuiet: false, missedExpectedOccurrences: 1, intervalElapsed: false },
    },
    {
      name: "becomes quiet after two missed daily occurrences",
      value: practice(),
      checkIns: [],
      today: "2026-08-03",
      expected: { isQuiet: true, missedExpectedOccurrences: 2, intervalElapsed: true },
    },
    {
      name: "becomes quiet at 1.5 selected cadence intervals even with one missed occurrence",
      value: practice({ cadence: { kind: "daily", everyDays: 2 } }),
      checkIns: [checkIn("2026-08-01")],
      today: "2026-08-04",
      expected: { isQuiet: true, missedExpectedOccurrences: 1, intervalElapsed: true },
    },
  ];

  for (const testCase of cases) {
    it(testCase.name, () => {
      const assessment = assessQuietness({
        practice: testCase.value,
        checkIns: testCase.checkIns,
        today: testCase.today,
      });
      assert.deepEqual(
        {
          isQuiet: assessment.isQuiet,
          missedExpectedOccurrences: assessment.missedExpectedOccurrences,
          intervalElapsed: assessment.intervalElapsed,
        },
        testCase.expected,
      );
    });
  }
});

describe("season applicability", () => {
  const cases: Array<{ name: string; season: Season; practiceId: EntityId; expected: boolean }> = [
    {
      name: "matches a live global pause",
      season: pauseSeason(),
      practiceId: PRACTICE_ID,
      expected: true,
    },
    {
      name: "matches a selected-practice pause for its selected practice",
      season: pauseSeason({ scope: { kind: "selected_practices", practiceIds: [PRACTICE_ID] } }),
      practiceId: PRACTICE_ID,
      expected: true,
    },
    {
      name: "does not match a selected-practice pause for another practice",
      season: pauseSeason({
        scope: { kind: "selected_practices", practiceIds: [SECOND_PRACTICE_ID] },
      }),
      practiceId: PRACTICE_ID,
      expected: false,
    },
  ];

  for (const testCase of cases) {
    it(testCase.name, () => {
      assert.equal(
        isSeasonApplicableToPractice({
          season: testCase.season,
          practiceId: testCase.practiceId,
          today: "2026-08-10",
        }),
        testCase.expected,
      );
    });
  }
});

describe("resolvePracticeJourney", () => {
  const quietPractice = practice();
  const quietToday = "2026-08-03" as ISODate;

  const cases: Array<{
    name: string;
    input: Omit<Parameters<typeof resolvePracticeJourney>[0], "practice" | "today">;
    expected: ReturnType<typeof resolvePracticeJourney>["kind"];
  }> = [
    {
      name: "gives an intentional pause precedence over an otherwise active Return Plan and quietness",
      input: {
        checkIns: [],
        returnPlans: [returnPlan()],
        seasons: [pauseSeason()],
        dismissedQuietPromptUntil: null,
      },
      expected: "intentional_pause",
    },
    {
      name: "returns an active Return Plan before quietness",
      input: {
        checkIns: [],
        returnPlans: [returnPlan()],
        seasons: [],
        dismissedQuietPromptUntil: null,
      },
      expected: "return_plan_active",
    },
    {
      name: "shows a returned acknowledgement only for a completed plan in the active session",
      input: {
        checkIns: [checkIn("2026-08-03", { returnPlanId: RETURN_PLAN_ID })],
        returnPlans: [returnPlan({ status: "completed", completedAt: "2026-08-03T12:00:00.000Z" })],
        seasons: [],
        dismissedQuietPromptUntil: null,
        completedReturnPlanIdInSession: RETURN_PLAN_ID,
      },
      expected: "returned",
    },
    {
      name: "suppresses quiet state through the inclusive dismissal date",
      input: {
        checkIns: [],
        returnPlans: [],
        seasons: [],
        dismissedQuietPromptUntil: quietToday,
      },
      expected: "normal",
    },
    {
      name: "restores quiet state once the dismissal window has elapsed",
      input: {
        checkIns: [],
        returnPlans: [],
        seasons: [],
        dismissedQuietPromptUntil: "2026-08-02",
      },
      expected: "quiet",
    },
  ];

  for (const testCase of cases) {
    it(testCase.name, () => {
      const state = resolvePracticeJourney({
        practice: quietPractice,
        today: quietToday,
        ...testCase.input,
      });
      assert.equal(state.kind, testCase.expected);
    });
  }
});
