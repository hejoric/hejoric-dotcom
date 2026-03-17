import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getHeatmapColor(count: number): string {
  if (count === 0) return "bg-accent/10";
  if (count <= 2) return "bg-accent/30";
  if (count <= 4) return "bg-accent/60";
  if (count <= 7) return "bg-accent/90";
  return "bg-accent";
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getDaysInRange(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export function getWeeksGrid(days: Date[]): (Date | null)[][] {
  const weeks: (Date | null)[][] = [];
  if (days.length === 0) return weeks;

  let currentWeek: (Date | null)[] = [];
  const firstDay = days[0].getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  for (const day of days) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }

  while (currentWeek.length < 7) {
    currentWeek.push(null);
  }
  weeks.push(currentWeek);

  return weeks;
}

export function dateToKey(date: Date): string {
  return date.toISOString().split("T")[0];
}
