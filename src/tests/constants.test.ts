import { describe, it, expect } from 'vitest'
import {
  APP_NAME,
  APP_DESCRIPTION,
  STORAGE_BUCKETS,
  CONTENT_TYPES,
  PROVIDERS,
} from '@/lib/constants'

describe('constants', () => {
  it('APP_NAME is defined', () => {
    expect(APP_NAME).toBe('Silhouette QR Live')
  })

  it('APP_DESCRIPTION is defined', () => {
    expect(typeof APP_DESCRIPTION).toBe('string')
    expect(APP_DESCRIPTION.length).toBeGreaterThan(0)
  })

  it('STORAGE_BUCKETS has all expected keys', () => {
    expect(STORAGE_BUCKETS.originals).toBe('originals')
    expect(STORAGE_BUCKETS.silhouettes).toBe('silhouettes')
    expect(STORAGE_BUCKETS.qrcodes).toBe('qrcodes')
    expect(STORAGE_BUCKETS.composites).toBe('composites')
    expect(STORAGE_BUCKETS.userMedia).toBe('user-media')
  })

  it('CONTENT_TYPES has text, image, link', () => {
    expect(CONTENT_TYPES.text).toBe('text')
    expect(CONTENT_TYPES.image).toBe('image')
    expect(CONTENT_TYPES.link).toBe('link')
  })

  it('PROVIDERS has all expected entries', () => {
    expect(PROVIDERS.google_drive).toBe('Google Drive')
    expect(PROVIDERS.dropbox).toBe('Dropbox')
    expect(PROVIDERS.onedrive).toBe('OneDrive')
  })
})
