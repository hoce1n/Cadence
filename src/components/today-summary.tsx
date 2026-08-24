import { bestCurrentStreak, bestEverStreak, todayProgress, weekRate } from "@/lib/stats";
import { useHabitStore } from "@/lib/store";

type TodaySummaryProps = {
  now: Date;
  week: Date[];
};

function Ring({ value, total }: { value: number; total: number }) {
  const pct = total === 0 ? 0 : value / total;
  const radius = 22;
  const circ = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 56 56" className="size-16 -rotate-90" aria-hidden="true">
      <circle
        cx="28"
        cy="28"
        r={radius}
        className="fill-none stroke-secondary"
        strokeWidth="5"
      />
      <circle
        cx="28"
        cy="28"
        r={radius}
        className="fill-none stroke-primary"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
      />
    </svg>
  );
}

function todayCopy(done: number, total: number): string {
  if (total === 0) return "Add a habit to begin.";
  if (done === 0) return "A single check starts the day.";
  if (done === total) return "All kept for today.";
  const left = total - done;
  return left === 1 ? "One habit still open." : `${left} habits still open.`;
}

export function TodaySummary({ now, week }: TodaySummaryProps) {
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);
  const { done, total } = todayProgress(habits, completions, now);
  const weekPct = Math.round(weekRate(habits, completions, week, now) * 100);
  const currentBest = bestCurrentStreak(habits, completions, now);
  const everBest = bestEverStreak(habits, completions);

  return (
    <section className="rounded-2xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-6">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Ring value={done} total={total} />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums">
            {total === 0 ? "—" : `${done}/${total}`}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">Today</p>
          <p className="font-display text-2xl font-medium tracking-tight" aria-live="polite">
            {todayCopy(done, total)}
          </p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Best now</dt>
          <dd className="mt-1 font-display text-xl font-medium tabular-nums tracking-tight">
            {currentBest}
            <span className="ml-1 text-sm font-sans font-medium text-muted-foreground">
              {currentBest === 1 ? "day" : "days"}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">This week</dt>
          <dd className="mt-1 font-display text-xl font-medium tabular-nums tracking-tight">
            {weekPct}
            <span className="ml-1 text-sm font-sans font-medium text-muted-foreground">%</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground">Longest</dt>
          <dd className="mt-1 font-display text-xl font-medium tabular-nums tracking-tight">
            {everBest}
            <span className="ml-1 text-sm font-sans font-medium text-muted-foreground">
              {everBest === 1 ? "day" : "days"}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
