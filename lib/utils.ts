import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const numberFormatter = new Intl.NumberFormat("fr-FR")

export function formatNumber(n: number): string {
  return numberFormatter.format(n)
}
