import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** `YYYY-MM-DD` in UTC: the shared key format for all activity data. */
export function dateToKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** `1 review` / `2 reviews`. Pass `pluralForm` when adding an "s" is wrong. */
export function plural(count: number, unit: string, pluralForm?: string): string {
  return `${count} ${count === 1 ? unit : pluralForm ?? `${unit}s`}`;
}
