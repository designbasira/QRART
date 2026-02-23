import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
})

export const signupSchema = loginSchema.extend({
  full_name: z.string().min(2, 'Minimum 2 caractères'),
  role: z.enum(['admin', 'user']).default('user'),
  invite_code: z.string().optional(),
})

export const designCreateSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(100),
  owner_id: z.string().uuid().optional(),
})

export const designUpdateContentSchema = z.object({
  current_message: z.string().max(5000).optional(),
  current_media_url: z.string().url().optional(),
  content_type: z.enum(['text', 'image', 'link']).optional(),
})

export const integrationSchema = z.object({
  provider: z.enum(['google_drive', 'dropbox', 'onedrive']),
  share_link: z.string().url('Lien invalide'),
  label: z.string().max(100).optional(),
  design_id: z.string().uuid().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type DesignCreateInput = z.infer<typeof designCreateSchema>
export type DesignUpdateContentInput = z.infer<typeof designUpdateContentSchema>
export type IntegrationInput = z.infer<typeof integrationSchema>
