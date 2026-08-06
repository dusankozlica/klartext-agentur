import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** shadcn-Standardhelfer: Klassen zusammenführen, Tailwind-Konflikte lösen. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
