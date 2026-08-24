import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { HabitDialog } from "@/components/habit-dialog";
import { MonthView, shiftMonth } from "@/components/month-view";
import { TodaySummary } from "@/components/today-summary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeekView, shiftWeek } from "@/components/week-view";
import { format, weekDays, weekStart } from "@/lib/dates";
import { useHabitStore } from "@/lib/store";
import type { Habit, HabitColor } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [now] = useState(() => new Date());
  const [weekCursor, setWeekCursor] = useState(() => weekStart(now));
  const [monthCursor, setMonthCursor] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);

  const habits = useHabitStore((state) => state.habits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);

  useEffect(() => {
    const finish = () => {
      useHabitStore.getState().ensureSeeded();
      setHydrated(true);
    };
    const unsub = useHabitStore.persist.onFinishHydration(finish);
    void useHabitStore.persist.rehydrate();
    if (useHabitStore.persist.hasHydrated()) finish();
    return unsub;
  }, []);

  const week = useMemo(() => weekDays(weekCursor), [weekCursor]);
  const currentWeek = useMemo(() => weekDays(weekStart(now)), [now]);

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(habit: Habit) {
    setEditing(habit);
    setDialogOpen(true);
  }

  function handleSave(name: string, color: HabitColor) {
    if (editing) {
      updateHabit(editing.id, { name, color });
      toast("Habit updated");
      return;
    }
    const id = addHabit(name, color);
    if (!id) {
      toast("You can keep up to 12 habits.");
      return;
    }
    toast("Habit added");
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-16 sm:px-6">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p suppressHydrationWarning className="text-sm font-medium text-muted-foreground">
            {format(now, "EEEE d MMMM")}
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight italic">Cadence</h1>
        </div>
        <Button onClick={openNew} className="shrink-0" aria-label="Add habit">
          <Plus />
          Add
        </Button>
      </header>

      {!hydrated ? (
        <div className="grid gap-4" aria-hidden="true">
          <div className="h-40 rounded-2xl bg-card shadow-[var(--shadow-border)]" />
          <div className="h-48 rounded-2xl bg-card shadow-[var(--shadow-border)]" />
          <div className="h-48 rounded-2xl bg-card shadow-[var(--shadow-border)]" />
        </div>
      ) : habits.length === 0 ? (
        <EmptyState onAdd={openNew} />
      ) : (
        <>
          <TodaySummary now={now} week={currentWeek} />
          <Tabs defaultValue="week" className="mt-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="week" className="flex-1 sm:flex-none">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="flex-1 sm:flex-none">
                Month
              </TabsTrigger>
            </TabsList>
            <TabsContent value="week">
              <WeekView
                days={week}
                now={now}
                onEdit={openEdit}
                onPrev={() => setWeekCursor((current) => shiftWeek(current, -1, now))}
                onNext={() => setWeekCursor((current) => shiftWeek(current, 1, now))}
              />
            </TabsContent>
            <TabsContent value="month">
              <MonthView
                month={monthCursor}
                now={now}
                onPrev={() => setMonthCursor((current) => shiftMonth(current, -1, now))}
                onNext={() => setMonthCursor((current) => shiftMonth(current, 1, now))}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      <p className="mt-10 text-center text-xs text-subtle">Kept on this device</p>

      <HabitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        habit={editing}
        onSave={handleSave}
      />
    </main>
  );
}
