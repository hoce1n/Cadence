import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { dateKey, isFutureKey } from "./dates";
import { buildDemo } from "./seed";
import type { Completions, Habit, HabitColor } from "./types";

type HabitState = {
  habits: Habit[];
  completions: Completions;
  hasOnboarded: boolean;
  ensureSeeded: () => void;
  addHabit: (name: string, color: HabitColor) => string;
  updateHabit: (id: string, patch: { name?: string; color?: HabitColor }) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
};

const MAX_HABITS = 12;

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: {},
      hasOnboarded: false,
      ensureSeeded: () => {
        if (get().hasOnboarded) return;
        const demo = buildDemo();
        set({
          hasOnboarded: true,
          habits: demo.habits,
          completions: demo.completions,
        });
      },
      addHabit: (name, color) => {
        const trimmed = name.trim();
        if (!trimmed) return "";
        if (get().habits.length >= MAX_HABITS) return "";
        const id = crypto.randomUUID();
        const habit: Habit = {
          id,
          name: trimmed.slice(0, 40),
          color,
          createdAt: dateKey(new Date()),
        };
        set((state) => ({
          habits: [...state.habits, habit],
          completions: { ...state.completions, [id]: [] },
        }));
        return id;
      },
      updateHabit: (id, patch) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  name:
                    patch.name !== undefined
                      ? patch.name.trim().slice(0, 40) || habit.name
                      : habit.name,
                  color: patch.color ?? habit.color,
                }
              : habit,
          ),
        }));
      },
      deleteHabit: (id) => {
        set((state) => {
          const { [id]: _removed, ...rest } = state.completions;
          return {
            habits: state.habits.filter((habit) => habit.id !== id),
            completions: rest,
          };
        });
      },
      toggleCompletion: (habitId, date) => {
        if (isFutureKey(date)) return;
        set((state) => {
          const current = state.completions[habitId] ?? [];
          const has = current.includes(date);
          return {
            completions: {
              ...state.completions,
              [habitId]: has
                ? current.filter((key) => key !== date)
                : [...current, date],
            },
          };
        });
      },
    }),
    {
      name: "cadence-habits-v1",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      skipHydration: true,
      partialize: (state) => ({
        habits: state.habits,
        completions: state.completions,
        hasOnboarded: state.hasOnboarded,
      }),
    },
  ),
);
