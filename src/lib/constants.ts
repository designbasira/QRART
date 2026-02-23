export const APP_NAME = 'Silhouette QR Live'
export const APP_DESCRIPTION = 'Transformez vos silhouettes en QR Codes artistiques dynamiques'

export const ADMIN_INVITE_CODE = 'QRART-ADMIN-2024'

export const QR_BASE_URL = process.env.NEXT_PUBLIC_QR_BASE_URL || 'http://localhost:3000/api/v1/scan'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const STORAGE_BUCKETS = {
  originals: 'originals',
  silhouettes: 'silhouettes',
  qrcodes: 'qrcodes',
  composites: 'composites',
  userMedia: 'user-media',
} as const

export const CONTENT_TYPES = {
  text: 'text',
  image: 'image',
  link: 'link',
} as const

export const PROVIDERS = {
  google_drive: 'Google Drive',
  dropbox: 'Dropbox',
  onedrive: 'OneDrive',
} as const
