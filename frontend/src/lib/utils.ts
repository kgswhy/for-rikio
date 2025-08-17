import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr: string = "dd/MM/yyyy HH:mm") {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatTime(time: string) {
  return time.substring(0, 5) // Convert "08:30:00" to "08:30"
}

export function getAttendanceTypeLabel(type: number): string {
  return type === 1 ? 'Clock In' : 'Clock Out'
}

export function getAttendanceStatusColor(isOnTime: boolean): string {
  return isOnTime ? 'text-green-600' : 'text-red-600'
}

export function getAttendanceStatusIcon(isOnTime: boolean): string {
  return isOnTime ? '✅' : '❌'
}

// CSV Download utility
export function downloadCSV(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
