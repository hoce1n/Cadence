export const HABIT_COLORS = [
  "sage",
  "teal",
  "slate",
  "clay",
  "rose",
  "olive",
  "ink",
] as const;

export type HabitColor = (typeof HABIT_COLORS)[number];

export type Habit = {
  id: string;
  name: string;
  color: HabitColor;
  createdAt: string;
};

export type Completions = Record<string, string[]>;
