import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** `YYYY-MM-DD` in UTC: the shared key format for all activity data. */
export function dateToKey(date: Date): string {
  return date.toISOString().split("T")[0];
}
