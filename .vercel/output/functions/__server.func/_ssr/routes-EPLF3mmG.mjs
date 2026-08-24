import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as Slot, N as require_jsx_runtime, a as Overlay2, c as Title2, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, i as Description2, l as Dialog$1, m as DialogPortal$1, n as Cancel, o as Portal2, p as DialogOverlay$1, r as Content2, s as Root2, t as Action, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as Pencil, c as ChevronLeft, i as Plus, l as Check, o as Ellipsis, r as Trash2, s as ChevronRight, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as startOfMonth, c as isSameDay, d as addMonths, f as addDays, i as endOfWeek, l as differenceInCalendarDays, n as isSameMonth, o as eachDayOfInterval, r as format, s as endOfMonth, t as subDays, u as startOfWeek } from "../_libs/date-fns.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as Separator2, i as Root2$1, n as Item2, o as Trigger, r as Portal2$1, t as Content2$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { i as Trigger$1, n as List, r as Root2$2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-EPLF3mmG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,box-shadow,transform,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline: "border border-border bg-card text-foreground hover:bg-accent",
			secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function EmptyState({ onAdd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card px-6 py-14 text-center shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-6 grid w-40 grid-cols-7 gap-1",
				"aria-hidden": "true",
				children: Array.from({ length: 21 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "aspect-square rounded-sm bg-secondary",
					style: {
						backgroundColor: index % 5 === 0 || index % 7 === 2 ? "var(--color-primary)" : void 0,
						opacity: index % 5 === 0 || index % 7 === 2 ? .85 : 1
					}
				}, index))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-medium tracking-tight",
				children: "Start a cadence"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
				children: "Add something you want to keep showing up for. Checks, streaks, and the month live on this device."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				onClick: onAdd,
				children: "Add a habit"
			})
		]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl bg-card p-6 text-card-foreground shadow-[var(--shadow-border)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-4 right-4 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-6 text-left", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("font-display text-xl font-medium tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-input bg-card px-3 text-base text-foreground shadow-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
	...props
}));
Label.displayName = Root.displayName;
var HABIT_COLORS = [
	"sage",
	"teal",
	"slate",
	"clay",
	"rose",
	"olive",
	"ink"
];
var COLOR_LABELS = {
	sage: "Sage",
	teal: "Teal",
	slate: "Slate",
	clay: "Clay",
	rose: "Rose",
	olive: "Olive",
	ink: "Ink"
};
function HabitDialog({ open, onOpenChange, habit, onSave }) {
	const [name, setName] = (0, import_react.useState)("");
	const [color, setColor] = (0, import_react.useState)("sage");
	(0, import_react.useEffect)(() => {
		if (open) {
			setName(habit?.name ?? "");
			setColor(habit?.color ?? "sage");
		}
	}, [open, habit]);
	function handleSubmit(event) {
		event.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) return;
		onSave(trimmed, color);
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "grid gap-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: habit ? "Edit habit" : "New habit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: habit ? "Rename it or pick a new color. History stays put." : "Give it a short name you will still want next month." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "habit-name",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "habit-name",
						value: name,
						maxLength: 40,
						autoFocus: true,
						placeholder: "Morning walk",
						onChange: (event) => setName(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Color" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: HABIT_COLORS.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-habit": value,
							"aria-label": COLOR_LABELS[value],
							"aria-pressed": color === value,
							onClick: () => setColor(value),
							className: cn("flex size-11 items-center justify-center rounded-full transition-[box-shadow] duration-150", color === value && "ring-2 ring-ring ring-offset-2 ring-offset-card"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "habit-swatch size-7 rounded-full" })
						}, value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: !name.trim(),
					children: habit ? "Save" : "Add habit"
				})] })
			]
		}) })
	});
}
function dateKey(date) {
	return format(date, "yyyy-MM-dd");
}
function parseDateKey(key) {
	const [year, month, day] = key.split("-").map(Number);
	return new Date(year, month - 1, day);
}
function todayKey(now = /* @__PURE__ */ new Date()) {
	return dateKey(now);
}
function isFutureDay(date, now = /* @__PURE__ */ new Date()) {
	return dateKey(date) > todayKey(now);
}
function isFutureKey(key, now = /* @__PURE__ */ new Date()) {
	return key > todayKey(now);
}
function weekStart(date) {
	return startOfWeek(date, { weekStartsOn: 1 });
}
function weekDays(start) {
	return eachDayOfInterval({
		start,
		end: addDays(start, 6)
	});
}
function monthGrid(month) {
	const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
	const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
	return eachDayOfInterval({
		start,
		end
	});
}
function formatWeekRange(start) {
	const end = addDays(start, 6);
	if (start.getMonth() === end.getMonth()) return `${format(start, "d")}–${format(end, "d MMM")}`;
	return `${format(start, "d MMM")} – ${format(end, "d MMM")}`;
}
function weekdayLabel(date) {
	return format(date, "EEEEEE");
}
function completionSet(completions, habitId) {
	return new Set(completions[habitId] ?? []);
}
function isComplete(completions, habitId, key) {
	return (completions[habitId] ?? []).includes(key);
}
function currentStreak(dates, now = /* @__PURE__ */ new Date()) {
	const set = dates instanceof Set ? dates : new Set(dates);
	const today = todayKey(now);
	let cursor = set.has(today) ? today : dateKey(subDays(now, 1));
	let streak = 0;
	while (set.has(cursor)) {
		streak += 1;
		cursor = dateKey(subDays(parseDateKey(cursor), 1));
	}
	return streak;
}
function longestStreak(dates) {
	const sorted = [...new Set(dates)].sort();
	if (sorted.length === 0) return 0;
	let best = 1;
	let run = 1;
	for (let i = 1; i < sorted.length; i += 1) {
		const prev = parseDateKey(sorted[i - 1]);
		const next = parseDateKey(sorted[i]);
		if (differenceInCalendarDays(next, prev) === 1) {
			run += 1;
			if (run > best) best = run;
		} else run = 1;
	}
	return best;
}
function countInRange(dates, startKey, endKey) {
	let count = 0;
	for (const key of dates) if (key >= startKey && key <= endKey) count += 1;
	return count;
}
function rateInDays(dates, days, now = /* @__PURE__ */ new Date()) {
	const end = todayKey(now);
	const done = countInRange(dates, dateKey(subDays(now, days - 1)), end);
	return {
		done,
		total: days,
		rate: days === 0 ? 0 : done / days
	};
}
function todayProgress(habits, completions, now = /* @__PURE__ */ new Date()) {
	const key = todayKey(now);
	return {
		done: habits.filter((habit) => isComplete(completions, habit.id, key)).length,
		total: habits.length
	};
}
function weekRate(habits, completions, week, now = /* @__PURE__ */ new Date()) {
	const today = todayKey(now);
	let possible = 0;
	let done = 0;
	for (const habit of habits) for (const day of week) {
		const key = dateKey(day);
		if (key > today) continue;
		possible += 1;
		if (isComplete(completions, habit.id, key)) done += 1;
	}
	return possible === 0 ? 0 : done / possible;
}
function bestCurrentStreak(habits, completions, now = /* @__PURE__ */ new Date()) {
	return habits.reduce((best, habit) => {
		const streak = currentStreak(completionSet(completions, habit.id), now);
		return Math.max(best, streak);
	}, 0);
}
function bestEverStreak(habits, completions) {
	return habits.reduce((best, habit) => {
		return Math.max(best, longestStreak(completionSet(completions, habit.id)));
	}, 0);
}
function dayCompletionCount(habits, completions, key) {
	return habits.filter((habit) => isComplete(completions, habit.id, key)).length;
}
function buildDemo(now = /* @__PURE__ */ new Date()) {
	const start = subDays(now, 41);
	const createdAt = dateKey(start);
	const today = dateKey(now);
	const days = eachDayOfInterval({
		start,
		end: now
	});
	const habits = [
		{
			id: "seed-walk",
			name: "Morning walk",
			color: "sage",
			createdAt
		},
		{
			id: "seed-read",
			name: "Read 20 pages",
			color: "slate",
			createdAt
		},
		{
			id: "seed-stretch",
			name: "Stretch",
			color: "clay",
			createdAt
		},
		{
			id: "seed-screens",
			name: "No screens late",
			color: "ink",
			createdAt
		}
	];
	const completions = {
		"seed-walk": [],
		"seed-read": [],
		"seed-stretch": [],
		"seed-screens": []
	};
	days.forEach((day, index) => {
		const key = dateKey(day);
		const fromEnd = days.length - 1 - index;
		const isToday = key === today;
		if (fromEnd <= 10 || index % 9 !== 3) completions["seed-walk"].push(key);
		if (!isToday && index % 5 !== 1) completions["seed-read"].push(key);
		if (fromEnd <= 3 || !isToday && index % 4 !== 2) completions["seed-stretch"].push(key);
		if (!isToday && fromEnd > 1 && index % 3 === 0) completions["seed-screens"].push(key);
	});
	return {
		habits,
		completions
	};
}
var MAX_HABITS = 12;
var useHabitStore = create()(persist((set, get) => ({
	habits: [],
	completions: {},
	hasOnboarded: false,
	ensureSeeded: () => {
		if (get().hasOnboarded) return;
		const demo = buildDemo();
		set({
			hasOnboarded: true,
			habits: demo.habits,
			completions: demo.completions
		});
	},
	addHabit: (name, color) => {
		const trimmed = name.trim();
		if (!trimmed) return "";
		if (get().habits.length >= MAX_HABITS) return "";
		const id = crypto.randomUUID();
		const habit = {
			id,
			name: trimmed.slice(0, 40),
			color,
			createdAt: dateKey(/* @__PURE__ */ new Date())
		};
		set((state) => ({
			habits: [...state.habits, habit],
			completions: {
				...state.completions,
				[id]: []
			}
		}));
		return id;
	},
	updateHabit: (id, patch) => {
		set((state) => ({ habits: state.habits.map((habit) => habit.id === id ? {
			...habit,
			name: patch.name !== void 0 ? patch.name.trim().slice(0, 40) || habit.name : habit.name,
			color: patch.color ?? habit.color
		} : habit) }));
	},
	deleteHabit: (id) => {
		set((state) => {
			const { [id]: _removed, ...rest } = state.completions;
			return {
				habits: state.habits.filter((habit) => habit.id !== id),
				completions: rest
			};
		});
	},
	toggleCompletion: (habitId, date) => {
		if (isFutureKey(date)) return;
		set((state) => {
			const current = state.completions[habitId] ?? [];
			const has = current.includes(date);
			return { completions: {
				...state.completions,
				[habitId]: has ? current.filter((key) => key !== date) : [...current, date]
			} };
		});
	}
}), {
	name: "cadence-habits-v1",
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	skipHydration: true,
	partialize: (state) => ({
		habits: state.habits,
		completions: state.completions,
		hasOnboarded: state.hasOnboarded
	})
}));
function MonthView({ month, now, onPrev, onNext }) {
	const habits = useHabitStore((state) => state.habits);
	const completions = useHabitStore((state) => state.completions);
	const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
	const [selected, setSelected] = (0, import_react.useState)(() => isSameMonth(now, month) ? now : startOfMonth(month));
	(0, import_react.useEffect)(() => {
		setSelected(isSameMonth(now, month) ? now : startOfMonth(month));
	}, [month, now]);
	const days = (0, import_react.useMemo)(() => monthGrid(month), [month]);
	const weekHead = days.slice(0, 7);
	const canGoForward = startOfMonth(month).getTime() < startOfMonth(now).getTime();
	const selectedKey = dateKey(selected);
	const selectedFuture = isFutureDay(selected, now);
	const selectedCount = dayCompletionCount(habits, completions, selectedKey);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium tracking-tight",
					children: format(month, "MMMM yyyy")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: onPrev,
						"aria-label": "Previous month",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: onNext,
						disabled: !canGoForward,
						"aria-label": "Next month",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-7 gap-1.5",
					children: [weekHead.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pb-1 text-center text-xs font-medium text-muted-foreground",
						children: weekdayLabel(day)
					}, `head-${dateKey(day)}`)), days.map((day) => {
						const key = dateKey(day);
						const inMonth = isSameMonth(day, month);
						const count = inMonth ? dayCompletionCount(habits, completions, key) : 0;
						const heat = habits.length === 0 ? 0 : Math.round(count / habits.length * 100);
						const isSelected = isSameDay(day, selected);
						const isToday = isSameDay(day, now);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !inMonth,
							onClick: () => setSelected(day),
							"aria-pressed": isSelected,
							"aria-label": `${format(day, "EEEE d MMMM")}, ${count} of ${habits.length} kept`,
							className: cn("day-heat relative flex min-h-11 flex-col items-center justify-center rounded-md px-0.5 py-1 text-sm tabular-nums transition-[box-shadow,transform] duration-150", inMonth ? "text-foreground" : "text-subtle opacity-40", isSelected && "ring-2 ring-ring ring-offset-2 ring-offset-card", isToday && !isSelected && "ring-1 ring-ring/40", "active:not-disabled:scale-[0.96]"),
							style: { ["--heat"]: inMonth ? `${Math.max(heat, count > 0 ? 22 : 0)}%` : "0%" },
							children: [format(day, "d"), inMonth && habits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 flex h-1.5 items-center justify-center gap-0.5",
								children: habits.slice(0, 4).map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"data-habit": habit.color,
									className: cn("size-1 rounded-full", isComplete(completions, habit.id, key) ? "habit-swatch" : "bg-border")
								}, habit.id))
							})]
						}, key);
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-medium tracking-tight",
						children: format(selected, "EEEE d MMMM")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground tabular-nums",
						children: selectedFuture ? "Upcoming" : `${selectedCount}/${habits.length} kept`
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-1",
					children: habits.map((habit) => {
						const done = isComplete(completions, habit.id, selectedKey);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-habit": habit.color,
							disabled: selectedFuture,
							onClick: () => toggleCompletion(habit.id, selectedKey),
							className: "flex min-h-11 w-full items-center gap-3 rounded-xl px-2 text-left transition-colors duration-150 hover:bg-secondary disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("habit-cell size-7 shrink-0", done && "text-card"),
								"data-on": done ? "true" : "false",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 stroke-[2.5]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 truncate text-sm font-medium",
								children: habit.name
							})]
						}) }, habit.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-3",
				children: habits.map((habit) => {
					const dates = completionSet(completions, habit.id);
					const streak = currentStreak(dates, now);
					const best = longestStreak(dates);
					const monthStats = rateInDays(dates, 30, now);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						"data-habit": habit.color,
						className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 flex items-start justify-between gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "habit-swatch size-2.5 shrink-0 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "truncate font-display text-base font-medium tracking-tight",
										children: habit.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground tabular-nums",
									children: [
										streak > 0 ? `${streak}-day streak` : "No current streak",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-subtle",
											children: " · "
										}),
										Math.round(monthStats.rate * 100),
										"% last 30 days",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-subtle",
											children: " · "
										}),
										"Best ",
										best
									]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-7 gap-1",
							children: days.map((day) => {
								const inMonth = isSameMonth(day, month);
								const key = dateKey(day);
								if (!inMonth) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "aspect-square min-h-3" }, key);
								const on = isComplete(completions, habit.id, key);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"data-habit": habit.color,
									"data-on": on ? "true" : "false",
									title: `${format(day, "d MMM")}${on ? " · kept" : ""}`,
									className: "habit-heat aspect-square min-h-3"
								}, key);
							})
						})]
					}, habit.id);
				})
			})
		]
	});
}
function shiftMonth(month, delta, now) {
	const next = startOfMonth(addMonths(month, delta));
	const latest = startOfMonth(now);
	return next.getTime() > latest.getTime() ? latest : next;
}
function Ring({ value, total }) {
	const pct = total === 0 ? 0 : value / total;
	const radius = 22;
	const circ = 2 * Math.PI * radius;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 56 56",
		className: "size-16 -rotate-90",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "28",
			cy: "28",
			r: radius,
			className: "fill-none stroke-secondary",
			strokeWidth: "5"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "28",
			cy: "28",
			r: radius,
			className: "fill-none stroke-primary",
			strokeWidth: "5",
			strokeLinecap: "round",
			strokeDasharray: circ,
			strokeDashoffset: circ * (1 - pct)
		})]
	});
}
function todayCopy(done, total) {
	if (total === 0) return "Add a habit to begin.";
	if (done === 0) return "A single check starts the day.";
	if (done === total) return "All kept for today.";
	const left = total - done;
	return left === 1 ? "One habit still open." : `${left} habits still open.`;
}
function TodaySummary({ now, week }) {
	const habits = useHabitStore((state) => state.habits);
	const completions = useHabitStore((state) => state.completions);
	const { done, total } = todayProgress(habits, completions, now);
	const weekPct = Math.round(weekRate(habits, completions, week, now) * 100);
	const currentBest = bestCurrentStreak(habits, completions, now);
	const everBest = bestEverStreak(habits, completions);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
					value: done,
					total
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums",
					children: total === 0 ? "—" : `${done}/${total}`
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: "Today"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl font-medium tracking-tight",
					"aria-live": "polite",
					children: todayCopy(done, total)
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs font-medium text-muted-foreground",
					children: "Best now"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
					className: "mt-1 font-display text-xl font-medium tabular-nums tracking-tight",
					children: [currentBest, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 text-sm font-sans font-medium text-muted-foreground",
						children: currentBest === 1 ? "day" : "days"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs font-medium text-muted-foreground",
					children: "This week"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
					className: "mt-1 font-display text-xl font-medium tabular-nums tracking-tight",
					children: [weekPct, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 text-sm font-sans font-medium text-muted-foreground",
						children: "%"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs font-medium text-muted-foreground",
					children: "Longest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
					className: "mt-1 font-display text-xl font-medium tabular-nums tracking-tight",
					children: [everBest, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 text-sm font-sans font-medium text-muted-foreground",
						children: everBest === 1 ? "day" : "days"
					})]
				})] })
			]
		})]
	});
}
var Tabs = Root2$2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-11 items-center justify-center rounded-xl bg-secondary p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-border)]", className),
	...props
}));
TabsTrigger.displayName = Trigger$1.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-5 focus-visible:outline-none", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function HabitCell({ color, date, done, disabled, today, onToggle, className }) {
	const label = `${format(date, "EEEE d MMMM")}${done ? ", complete" : ", not complete"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-habit": color,
		"data-on": done ? "true" : "false",
		"data-today": today ? "true" : "false",
		"aria-pressed": done,
		"aria-label": label,
		disabled,
		onClick: onToggle,
		className: cn("habit-cell aspect-square min-h-11 w-full", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("size-4 stroke-[2.5] transition-[opacity,transform] duration-150", done ? "scale-100 opacity-100" : "scale-50 opacity-0") })
	});
}
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl bg-card p-6 text-card-foreground shadow-[var(--shadow-border)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 text-left", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("font-display text-xl font-medium tracking-tight", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
var DropdownMenu = Root2$1;
var DropdownMenuTrigger = Trigger;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
	ref,
	sideOffset,
	className: cn("z-50 min-w-40 overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground shadow-[var(--shadow-border)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, variant = "default", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none select-none focus:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4", variant === "destructive" && "text-destructive focus:bg-destructive/10", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-border", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
function HabitCard({ habit, days, now, onEdit }) {
	const completions = useHabitStore((state) => state.completions);
	const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
	const deleteHabit = useHabitStore((state) => state.deleteHabit);
	const [confirmOpen, setConfirmOpen] = (0, import_react.useState)(false);
	const dates = completionSet(completions, habit.id);
	const streak = currentStreak(dates, now);
	const best = longestStreak(dates);
	const month = rateInDays(dates, 30, now);
	const monthPct = Math.round(month.rate * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		"data-habit": habit.color,
		className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "habit-swatch size-2.5 shrink-0 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate font-display text-lg font-medium tracking-tight",
							children: habit.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground tabular-nums",
						children: [
							streak > 0 ? `${streak}-day streak` : "No current streak",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: " · "
							}),
							monthPct,
							"% last 30 days",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: " · "
							}),
							"Best ",
							best
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "size-11 shrink-0 text-muted-foreground",
						"aria-label": `Options for ${habit.name}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onSelect: () => onEdit(habit),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {}), "Edit"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							variant: "destructive",
							onSelect: () => setConfirmOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Delete"]
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-7 gap-1.5",
				children: [days.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center text-xs font-medium text-muted-foreground",
					children: weekdayLabel(day)
				}, dateKey(day))), days.map((day) => {
					const key = dateKey(day);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitCell, {
						color: habit.color,
						date: day,
						done: isComplete(completions, habit.id, key),
						today: isSameDay(day, now),
						disabled: isFutureDay(day, now),
						onToggle: () => toggleCompletion(habit.id, key)
					}, key);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "sr-only",
				children: [
					"Week of ",
					format(days[0], "d MMM"),
					" to ",
					format(days[6], "d MMM")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: confirmOpen,
				onOpenChange: setConfirmOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Delete ",
					habit.name,
					"?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This removes the habit and its history from this device. It cannot be undone." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Keep it" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					onClick: () => deleteHabit(habit.id),
					children: "Delete"
				})] })] })
			})
		]
	});
}
function WeekView({ days, now, onEdit, onPrev, onNext }) {
	const habits = useHabitStore((state) => state.habits);
	const thisWeek = weekStart(now);
	const canGoForward = days[0].getTime() < thisWeek.getTime();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-medium tracking-tight",
				children: formatWeekRange(days[0])
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onPrev,
					"aria-label": "Previous week",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onNext,
					disabled: !canGoForward,
					"aria-label": "Next week",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
				})]
			})]
		}), habits.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitCard, {
			habit,
			days,
			now,
			onEdit
		}, habit.id))]
	});
}
function shiftWeek(start, delta, now) {
	const next = addDays(start, delta * 7);
	const latest = weekStart(now);
	return next.getTime() > latest.getTime() ? latest : next;
}
function Home() {
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [now] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [weekCursor, setWeekCursor] = (0, import_react.useState)(() => weekStart(now));
	const [monthCursor, setMonthCursor] = (0, import_react.useState)(() => new Date(now.getFullYear(), now.getMonth(), 1));
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const habits = useHabitStore((state) => state.habits);
	const addHabit = useHabitStore((state) => state.addHabit);
	const updateHabit = useHabitStore((state) => state.updateHabit);
	(0, import_react.useEffect)(() => {
		const finish = () => {
			useHabitStore.getState().ensureSeeded();
			setHydrated(true);
		};
		const unsub = useHabitStore.persist.onFinishHydration(finish);
		useHabitStore.persist.rehydrate();
		if (useHabitStore.persist.hasHydrated()) finish();
		return unsub;
	}, []);
	const week = (0, import_react.useMemo)(() => weekDays(weekCursor), [weekCursor]);
	const currentWeek = (0, import_react.useMemo)(() => weekDays(weekStart(now)), [now]);
	function openNew() {
		setEditing(null);
		setDialogOpen(true);
	}
	function openEdit(habit) {
		setEditing(habit);
		setDialogOpen(true);
	}
	function handleSave(name, color) {
		if (editing) {
			updateHabit(editing.id, {
				name,
				color
			});
			toast("Habit updated");
			return;
		}
		if (!addHabit(name, color)) {
			toast("You can keep up to 12 habits.");
			return;
		}
		toast("Habit added");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh w-full max-w-2xl px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-16 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-6 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					suppressHydrationWarning: true,
					className: "text-sm font-medium text-muted-foreground",
					children: format(now, "EEEE d MMMM")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-medium tracking-tight italic",
					children: "Cadence"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openNew,
					className: "shrink-0",
					"aria-label": "Add habit",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Add"]
				})]
			}),
			!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 rounded-2xl bg-card shadow-[var(--shadow-border)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 rounded-2xl bg-card shadow-[var(--shadow-border)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 rounded-2xl bg-card shadow-[var(--shadow-border)]" })
				]
			}) : habits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { onAdd: openNew }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodaySummary, {
				now,
				week: currentWeek
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "week",
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "week",
							className: "flex-1 sm:flex-none",
							children: "Week"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "month",
							className: "flex-1 sm:flex-none",
							children: "Month"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "week",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekView, {
							days: week,
							now,
							onEdit: openEdit,
							onPrev: () => setWeekCursor((current) => shiftWeek(current, -1, now)),
							onNext: () => setWeekCursor((current) => shiftWeek(current, 1, now))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "month",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthView, {
							month: monthCursor,
							now,
							onPrev: () => setMonthCursor((current) => shiftMonth(current, -1, now)),
							onNext: () => setMonthCursor((current) => shiftMonth(current, 1, now))
						})
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-center text-xs text-subtle",
				children: "Kept on this device"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitDialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				habit: editing,
				onSave: handleSave
			})
		]
	});
}
//#endregion
export { Home as component };
