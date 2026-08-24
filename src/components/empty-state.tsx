import { Button } from "@/components/ui/button";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <section className="rounded-2xl bg-card px-6 py-14 text-center shadow-[var(--shadow-border)]">
      <div className="mx-auto mb-6 grid w-40 grid-cols-7 gap-1" aria-hidden="true">
        {Array.from({ length: 21 }, (_, index) => (
          <span
            key={index}
            className="aspect-square rounded-sm bg-secondary"
            style={{
              backgroundColor:
                index % 5 === 0 || index % 7 === 2
                  ? "var(--color-primary)"
                  : undefined,
              opacity: index % 5 === 0 || index % 7 === 2 ? 0.85 : 1,
            }}
          />
        ))}
      </div>
      <h2 className="font-display text-2xl font-medium tracking-tight">Start a cadence</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Add something you want to keep showing up for. Checks, streaks, and the month live on this device.
      </p>
      <Button className="mt-6" onClick={onAdd}>
        Add a habit
      </Button>
    </section>
  );
}
