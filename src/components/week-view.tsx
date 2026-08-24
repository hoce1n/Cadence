import { ChevronLeft, ChevronRight } from "lucide-react";
import { HabitCard } from "@/components/habit-card";
import { Button } from "@/components/ui/button";
import { addDays, formatWeekRange, weekStart } from "@/lib/dates";
import { useHabitStore } from "@/lib/store";
import type { Habit } from "@/lib/types";

type WeekViewProps = {
  days: Date[];
  now: Date;
  onEdit: (habit: Habit) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function WeekView({ days, now, onEdit, onPrev, onNext }: WeekViewProps) {
  const habits = useHabitStore((state) => state.habits);
  const thisWeek = weekStart(now);
  const canGoForward = days[0].getTime() < thisWeek.getTime();

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-medium tracking-tight">
          {formatWeekRange(days[0])}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onPrev} aria-label="Previous week">
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={!canGoForward}
            aria-label="Next week"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} days={days} now={now} onEdit={onEdit} />
      ))}
    </div>
  );
}

export function shiftWeek(start: Date, delta: number, now: Date): Date {
  const next = addDays(start, delta * 7);
  const latest = weekStart(now);
  return next.getTime() > latest.getTime() ? latest : next;
}
