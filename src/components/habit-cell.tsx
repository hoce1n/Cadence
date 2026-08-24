import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "@/lib/dates";
import type { HabitColor } from "@/lib/types";

type HabitCellProps = {
  color: HabitColor;
  date: Date;
  done: boolean;
  disabled?: boolean;
  today?: boolean;
  onToggle: () => void;
  className?: string;
};

export function HabitCell({
  color,
  date,
  done,
  disabled,
  today,
  onToggle,
  className,
}: HabitCellProps) {
  const label = `${format(date, "EEEE d MMMM")}${done ? ", complete" : ", not complete"}`;
  return (
    <button
      type="button"
      data-habit={color}
      data-on={done ? "true" : "false"}
      data-today={today ? "true" : "false"}
      aria-pressed={done}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={cn("habit-cell aspect-square min-h-11 w-full", className)}
    >
      <Check
        className={cn(
          "size-4 stroke-[2.5] transition-[opacity,transform] duration-150",
          done ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      />
    </button>
  );
}
