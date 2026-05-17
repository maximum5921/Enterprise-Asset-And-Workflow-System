import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// merge Tailwind classes
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// status badge colors
export const ASSET_STATUS_STYLES = {
  available:   'bg-green-100 text-green-800 border-green-200',
  in_use:      'bg-blue-100 text-blue-800 border-blue-200',
  maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  retired:     'bg-gray-100 text-gray-600 border-gray-200',
} as const

export const WORKFLOW_STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-800',
  approved:  'bg-green-100 text-green-800',
  rejected:  'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-600',
} as const

export const PRIORITY_LABEL = {
  1: { label: 'Urgent',  style: 'bg-red-100 text-red-700' },
  2: { label: 'Normal',  style: 'bg-blue-100 text-blue-700' },
  3: { label: 'Low',     style: 'bg-gray-100 text-gray-600' },
} as const

// format bytes → readable string
export const formatBytes = (bytes: number): string => {
  const units = ['B','KB','MB','GB']
  let i = 0, size = bytes
  while (size >= 1024 && i < 3) { size /= 1024; i++ }
  return `${size.toFixed(1)} ${units[i]}`
}