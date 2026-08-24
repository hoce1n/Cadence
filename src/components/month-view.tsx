import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addMonths,
  dateKey,
  format,
  isFutureDay,
  isSameDay,
  isSameMonth,
  monthGrid,
  startOfMonth,
  weekdayLabel,
} from "@/lib/dates";
import {
  completionSet,
  currentStreak,
  dayCompletionCount,
  isComplete,
  longestStreak,
  rateInDays,
} from "@/lib/stats";
import { useHabitStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type MonthViewProps = {
  month: Date;
  now: Date;
  onPrev: () => void;
  onNext: () => void;
};

export function MonthView({ month, now, onPrev, onNext }: MonthViewProps) {
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
  const [selected, setSelected] = useState(() =>
    isSameMonth(now, month) ? now : startOfMonth(month),
  );

  useEffect(() => {
    setSelected(isSameMonth(now, month) ? now : startOfMonth(month));
  }, [month, now]);

  const days = useMemo(() => monthGrid(month), [month]);
  const weekHead = days.slice(0, 7);
  const canGoForward =
    startOfMonth(month).getTime() < startOfMonth(now).getTime();
  const selectedKey = dateKey(selected);
  const selectedFuture = isFutureDay(selected, now);
  const selectedCount = dayCompletionCount(habits, completions, selectedKey);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-medium tracking-tight">
          {format(month, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onPrev} aria-label="Previous month">
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={!canGoForward}
            aria-label="Next month"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
        <div className="grid grid-cols-7 gap-1.5">
          {weekHead.map((day) => (
            <div
              key={`head-${dateKey(day)}`}
              className="pb-1 text-center text-xs font-medium text-muted-foreground"
            >
              {weekdayLabel(day)}
            </div>
          ))}
          {days.map((day) => {
            const key = dateKey(day);
            const inMonth = isSameMonth(day, month);
            const count = inMonth ? dayCompletionCount(habits, completions, key) : 0;
            const heat = habits.length === 0 ? 0 : Math.round((count / habits.length) * 100);
            const isSelected = isSameDay(day, selected);
            const isToday = isSameDay(day, now);
            return (
              <button
                key={key}
                type="button"
                disabled={!inMonth}
                onClick={() => setSelected(day)}
                aria-pressed={isSelected}
                aria-label={`${format(day, "EEEE d MMMM")}, ${count} of ${habits.length} kept`}
                className={cn(
                  "day-heat relative flex min-h-11 flex-col items-center justify-center rounded-md px-0.5 py-1 text-sm tabular-nums transition-[box-shadow,transform] duration-150",
                  inMonth ? "text-foreground" : "text-subtle opacity-40",
                  isSelected && "ring-2 ring-ring ring-offset-2 ring-offset-card",
                  isToday && !isSelected && "ring-1 ring-ring/40",
                  "active:not-disabled:scale-[0.96]",
                )}
                style={{ ["--heat" as string]: inMonth ? `${Math.max(heat, count > 0 ? 22 : 0)}%` : "0%" }}
              >
                {format(day, "d")}
                {inMonth && habits.length > 0 && (
                  <span className="mt-0.5 flex h-1.5 items-center justify-center gap-0.5">
                    {habits.slice(0, 4).map((habit) => (
                      <span
                        key={habit.id}
                        data-habit={habit.color}
                        className={cn(
                          "size-1 rounded-full",
                          isComplete(completions, habit.id, key)
                            ? "habit-swatch"
                            : "bg-border",
                        )}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-medium tracking-tight">
            {format(selected, "EEEE d MMMM")}
          </h3>
          <p className="text-sm text-muted-foreground tabular-nums">
            {selectedFuture ? "Upcoming" : `${selectedCount}/${habits.length} kept`}
          </p>
        </div>
        <ul className="grid gap-1">
          {habits.map((habit) => {
            const done = isComplete(completions, habit.id, selectedKey);
            return (
              <li key={habit.id}>
                <button
                  type="button"
                  data-habit={habit.color}
                  disabled={selectedFuture}
                  onClick={() => toggleCompletion(habit.id, selectedKey)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl px-2 text-left transition-colors duration-150 hover:bg-secondary disabled:opacity-50"
                >
                  <span
                    className={cn(
                      "habit-cell size-7 shrink-0",
                      done && "text-card",
                    )}
                    data-on={done ? "true" : "false"}
                    aria-hidden="true"
                  >
                    <Check className="size-3.5 stroke-[2.5]" />
                  </span>
                  <span className="flex-1 truncate text-sm font-medium">{habit.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid gap-3">
        {habits.map((habit) => {
          const dates = completionSet(completions, habit.id);
          const streak = currentStreak(dates, now);
          const best = longestStreak(dates);
          const monthStats = rateInDays(dates, 30, now);
          return (
            <article
              key={habit.id}
              data-habit={habit.color}
              className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="habit-swatch size-2.5 shrink-0 rounded-full" />
                    <h3 className="truncate font-display text-base font-medium tracking-tight">
                      {habit.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                    {streak > 0 ? `${streak}-day streak` : "No current streak"}
                    <span className="text-subtle"> · </span>
                    {Math.round(monthStats.rate * 100)}% last 30 days
                    <span className="text-subtle"> · </span>
                    Best {best}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const inMonth = isSameMonth(day, month);
                  const key = dateKey(day);
                  if (!inMonth) {
                    return <span key={key} className="aspect-square min-h-3" />;
                  }
                  const on = isComplete(completions, habit.id, key);
                  return (
                    <span
                      key={key}
                      data-habit={habit.color}
                      data-on={on ? "true" : "false"}
                      title={`${format(day, "d MMM")}${on ? " · kept" : ""}`}
                      className="habit-heat aspect-square min-h-3"
                    />
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export function shiftMonth(month: Date, delta: number, now: Date): Date {
  const next = startOfMonth(addMonths(month, delta));
  const latest = startOfMonth(now);
  return next.getTime() > latest.getTime() ? latest : next;
}
