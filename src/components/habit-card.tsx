import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { HabitCell } from "@/components/habit-cell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dateKey, format, isFutureDay, isSameDay, weekdayLabel } from "@/lib/dates";
import {
  completionSet,
  currentStreak,
  isComplete,
  longestStreak,
  rateInDays,
} from "@/lib/stats";
import { useHabitStore } from "@/lib/store";
import type { Habit } from "@/lib/types";

type HabitCardProps = {
  habit: Habit;
  days: Date[];
  now: Date;
  onEdit: (habit: Habit) => void;
};

export function HabitCard({ habit, days, now, onEdit }: HabitCardProps) {
  const completions = useHabitStore((state) => state.completions);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dates = completionSet(completions, habit.id);
  const streak = currentStreak(dates, now);
  const best = longestStreak(dates);
  const month = rateInDays(dates, 30, now);
  const monthPct = Math.round(month.rate * 100);

  return (
    <article
      data-habit={habit.color}
      className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="habit-swatch size-2.5 shrink-0 rounded-full" />
            <h3 className="truncate font-display text-lg font-medium tracking-tight">
              {habit.name}
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">
            {streak > 0 ? `${streak}-day streak` : "No current streak"}
            <span className="text-subtle"> · </span>
            {monthPct}% last 30 days
            <span className="text-subtle"> · </span>
            Best {best}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-11 shrink-0 text-muted-foreground"
              aria-label={`Options for ${habit.name}`}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(habit)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <div key={dateKey(day)} className="text-center text-xs font-medium text-muted-foreground">
            {weekdayLabel(day)}
          </div>
        ))}
        {days.map((day) => {
          const key = dateKey(day);
          return (
            <HabitCell
              key={key}
              color={habit.color}
              date={day}
              done={isComplete(completions, habit.id, key)}
              today={isSameDay(day, now)}
              disabled={isFutureDay(day, now)}
              onToggle={() => toggleCompletion(habit.id, key)}
            />
          );
        })}
      </div>
      <p className="sr-only">
        Week of {format(days[0], "d MMM")} to {format(days[6], "d MMM")}
      </p>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {habit.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the habit and its history from this device. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteHabit(habit.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
