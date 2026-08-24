import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayKey(now = new Date()): string {
  return dateKey(now);
}

export function isFutureDay(date: Date, now = new Date()): boolean {
  return dateKey(date) > todayKey(now);
}

export function isFutureKey(key: string, now = new Date()): boolean {
  return key > todayKey(now);
}

export function weekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function weekDays(start: Date): Date[] {
  return eachDayOfInterval({ start, end: addDays(start, 6) });
}

export function monthGrid(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function daysBack(end: Date, count: number): Date[] {
  return eachDayOfInterval({ start: subDays(end, count - 1), end });
}

export function formatWeekRange(start: Date): string {
  const end = addDays(start, 6);
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, "d")}–${format(end, "d MMM")}`;
  }
  return `${format(start, "d MMM")} – ${format(end, "d MMM")}`;
}

export function weekdayLabel(date: Date): string {
  return format(date, "EEEEEE");
}

export { addDays, addMonths, format, isSameDay, isSameMonth, isBefore, startOfMonth, endOfMonth };
