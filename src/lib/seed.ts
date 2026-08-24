import { eachDayOfInterval, subDays } from "date-fns";
import { dateKey } from "./dates";
import type { Completions, Habit } from "./types";

export function buildDemo(now = new Date()): {
  habits: Habit[];
  completions: Completions;
} {
  const start = subDays(now, 41);
  const createdAt = dateKey(start);
  const today = dateKey(now);
  const days = eachDayOfInterval({ start, end: now });

  const habits: Habit[] = [
    { id: "seed-walk", name: "Morning walk", color: "sage", createdAt },
    { id: "seed-read", name: "Read 20 pages", color: "slate", createdAt },
    { id: "seed-stretch", name: "Stretch", color: "clay", createdAt },
    { id: "seed-screens", name: "No screens late", color: "ink", createdAt },
  ];

  const completions: Completions = {
    "seed-walk": [],
    "seed-read": [],
    "seed-stretch": [],
    "seed-screens": [],
  };

  days.forEach((day, index) => {
    const key = dateKey(day);
    const fromEnd = days.length - 1 - index;
    const isToday = key === today;

    if (fromEnd <= 10 || index % 9 !== 3) {
      completions["seed-walk"].push(key);
    }

    if (!isToday && index % 5 !== 1) {
      completions["seed-read"].push(key);
    }

    if (fromEnd <= 3 || (!isToday && index % 4 !== 2)) {
      completions["seed-stretch"].push(key);
    }

    if (!isToday && fromEnd > 1 && index % 3 === 0) {
      completions["seed-screens"].push(key);
    }
  });

  return { habits, completions };
}
