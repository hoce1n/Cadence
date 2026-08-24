import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HABIT_COLORS, type Habit, type HabitColor } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLOR_LABELS: Record<HabitColor, string> = {
  sage: "Sage",
  teal: "Teal",
  slate: "Slate",
  clay: "Clay",
  rose: "Rose",
  olive: "Olive",
  ink: "Ink",
};

type HabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit | null;
  onSave: (name: string, color: HabitColor) => void;
};

export function HabitDialog({ open, onOpenChange, habit, onSave }: HabitDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<HabitColor>("sage");

  useEffect(() => {
    if (open) {
      setName(habit?.name ?? "");
      setColor(habit?.color ?? "sage");
    }
  }, [open, habit]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed, color);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle>{habit ? "Edit habit" : "New habit"}</DialogTitle>
            <DialogDescription>
              {habit
                ? "Rename it or pick a new color. History stays put."
                : "Give it a short name you will still want next month."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="habit-name">Name</Label>
            <Input
              id="habit-name"
              value={name}
              maxLength={40}
              autoFocus
              placeholder="Morning walk"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-1">
              {HABIT_COLORS.map((value) => (
                <button
                  key={value}
                  type="button"
                  data-habit={value}
                  aria-label={COLOR_LABELS[value]}
                  aria-pressed={color === value}
                  onClick={() => setColor(value)}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full transition-[box-shadow] duration-150",
                    color === value &&
                      "ring-2 ring-ring ring-offset-2 ring-offset-card",
                  )}
                >
                  <span className="habit-swatch size-7 rounded-full" />
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {habit ? "Save" : "Add habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
