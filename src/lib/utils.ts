import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNowStrict, format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return format(from, "MMM d");
    } else {
      return format(from, "MMM d, yyyy"); // Corrected the incorrect recursive call
    }
  }
}
