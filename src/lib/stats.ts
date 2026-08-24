import { differenceInCalendarDays, subDays } from "date-fns";
import { dateKey, parseDateKey, todayKey } from "./dates";
import type { Completions, Habit } from "./types";

export function completionSet(completions: Completions, habitId: string): Set<string> {
  return new Set(completions[habitId] ?? []);
}

export function isComplete(completions: Completions, habitId: string, key: string): boolean {
  return (completions[habitId] ?? []).includes(key);
}

export function currentStreak(
  dates: Iterable<string>,
  now = new Date(),
): number {
  const set = dates instanceof Set ? dates : new Set(dates);
  const today = todayKey(now);
  let cursor = set.has(today) ? today : dateKey(subDays(now, 1));
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = dateKey(subDays(parseDateKey(cursor), 1));
  }
  return streak;
}

export function longestStreak(dates: Iterable<string>): number {
  const sorted = [...new Set(dates)].sort();
  if (sorted.length === 0) return 0;
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = parseDateKey(sorted[i - 1]);
    const next = parseDateKey(sorted[i]);
    if (differenceInCalendarDays(next, prev) === 1) {
      run += 1;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }
  return best;
}

export function countInRange(
  dates: Iterable<string>,
  startKey: string,
  endKey: string,
): number {
  let count = 0;
  for (const key of dates) {
    if (key >= startKey && key <= endKey) count += 1;
  }
  return count;
}

export function rateInDays(
  dates: Iterable<string>,
  days: number,
  now = new Date(),
): { done: number; total: number; rate: number } {
  const end = todayKey(now);
  const start = dateKey(subDays(now, days - 1));
  const done = countInRange(dates, start, end);
  return { done, total: days, rate: days === 0 ? 0 : done / days };
}

export function todayProgress(
  habits: Habit[],
  completions: Completions,
  now = new Date(),
): { done: number; total: number } {
  const key = todayKey(now);
  const done = habits.filter((habit) => isComplete(completions, habit.id, key)).length;
  return { done, total: habits.length };
}

export function weekRate(
  habits: Habit[],
  completions: Completions,
  week: Date[],
  now = new Date(),
): number {
  const today = todayKey(now);
  let possible = 0;
  let done = 0;
  for (const habit of habits) {
    for (const day of week) {
      const key = dateKey(day);
      if (key > today) continue;
      possible += 1;
      if (isComplete(completions, habit.id, key)) done += 1;
    }
  }
  return possible === 0 ? 0 : done / possible;
}

export function bestCurrentStreak(
  habits: Habit[],
  completions: Completions,
  now = new Date(),
): number {
  return habits.reduce((best, habit) => {
    const streak = currentStreak(completionSet(completions, habit.id), now);
    return Math.max(best, streak);
  }, 0);
}

export function bestEverStreak(habits: Habit[], completions: Completions): number {
  return habits.reduce((best, habit) => {
    return Math.max(best, longestStreak(completionSet(completions, habit.id)));
  }, 0);
}

export function dayCompletionCount(
  habits: Habit[],
  completions: Completions,
  key: string,
): number {
  return habits.filter((habit) => isComplete(completions, habit.id, key)).length;
}
