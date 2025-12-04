import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChangedFields<T extends Record<string, unknown>>(prev: T, next: T) {
  const diff: Partial<T> = {};

  (Object.keys(next) as (keyof T)[]).forEach((key) => {
    if (prev[key] !== next[key]) {
      diff[key] = next[key];
    }
  });

  return diff;
}

export function buildPatch<T extends object>(origin: T, current: T): Partial<T> {
  const patch: Partial<T> = {};

  (Object.keys(current) as (keyof T)[]).forEach((key) => {
    if (current[key] !== origin[key]) {
      patch[key] = current[key];
    }
  });

  return patch;
}
