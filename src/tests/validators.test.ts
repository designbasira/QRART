import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  signupSchema,
  designUpdateContentSchema,
  integrationSchema,
} from '@/lib/validators'

describe('loginSchema', () => {
  it('accepts valid input', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('signupSchema', () => {
  it('accepts valid input with defaults', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      full_name: 'John Doe',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.role).toBe('user')
    }
  })

  it('accepts admin role', () => {
    const result = signupSchema.safeParse({
      email: 'admin@example.com',
      password: 'password123',
      full_name: 'Admin User',
      role: 'admin',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short full_name', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      full_name: 'A',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid role', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      full_name: 'John Doe',
      role: 'superadmin',
    })
    expect(result.success).toBe(false)
  })
})

describe('designUpdateContentSchema', () => {
  it('accepts empty object', () => {
    const result = designUpdateContentSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts valid text content', () => {
    const result = designUpdateContentSchema.safeParse({
      current_message: 'Hello world',
      content_type: 'text',
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid image content', () => {
    const result = designUpdateContentSchema.safeParse({
      current_media_url: 'https://example.com/image.png',
      content_type: 'image',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid URL', () => {
    const result = designUpdateContentSchema.safeParse({
      current_media_url: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid content_type', () => {
    const result = designUpdateContentSchema.safeParse({
      content_type: 'video',
    })
    expect(result.success).toBe(false)
  })

  it('rejects message over 5000 chars', () => {
    const result = designUpdateContentSchema.safeParse({
      current_message: 'a'.repeat(5001),
    })
    expect(result.success).toBe(false)
  })
})

describe('integrationSchema', () => {
  it('accepts valid google drive integration', () => {
    const result = integrationSchema.safeParse({
      provider: 'google_drive',
      share_link: 'https://drive.google.com/file/d/abc123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects unknown provider', () => {
    const result = integrationSchema.safeParse({
      provider: 'icloud',
      share_link: 'https://icloud.com/link',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid share_link', () => {
    const result = integrationSchema.safeParse({
      provider: 'dropbox',
      share_link: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })
})
