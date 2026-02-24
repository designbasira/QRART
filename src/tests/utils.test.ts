import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('deduplicates tailwind classes', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8')
  })

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })
})

describe('formatDate', () => {
  it('formats a date string in French', () => {
    const result = formatDate('2024-06-15')
    expect(result).toContain('juin')
    expect(result).toContain('2024')
  })

  it('formats a Date object', () => {
    const result = formatDate(new Date('2024-01-01'))
    expect(result).toContain('janvier')
    expect(result).toContain('2024')
  })
})
