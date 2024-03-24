import { ClassValue, clsx } from 'clsx'
import { lowerCase, startCase } from 'lodash'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const titleCase = (string: string) => startCase(lowerCase(string))
