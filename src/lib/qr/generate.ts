'use client'

import QRCodeStyling from 'qr-code-styling'
import { QR_BASE_URL } from '@/lib/constants'
import type { QRConfig } from './types'

export function createStyledQR(config: QRConfig): QRCodeStyling {
  return new QRCodeStyling({
    width: config.width ?? 1024,
    height: config.height ?? 1024,
    type: 'canvas',
    data: `${QR_BASE_URL}/${config.shortId}`,
    image: config.overlayImageUrl,
    dotsOptions: {
      color: config.dotsColor ?? '#000000',
      type: config.dotsType ?? 'rounded',
    },
    cornersSquareOptions: {
      color: config.cornersColor ?? '#000000',
      type: 'extra-rounded',
    },
    backgroundOptions: {
      color: config.backgroundColor === 'transparent' ? '#00000000' : (config.backgroundColor ?? '#ffffff'),
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: config.imageMargin ?? 10,
      saveAsBlob: true,
    },
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
  })
}

export async function generateQRBlob(config: QRConfig): Promise<Blob> {
  const qr = createStyledQR(config)
  const rawData = await qr.getRawData('png')
  if (!rawData) throw new Error('Failed to generate QR code')
  if (rawData instanceof Blob) return rawData
  // Buffer from server-side: convert to Uint8Array first
  return new Blob([new Uint8Array(rawData)], { type: 'image/png' })
}

export async function generateQRDataUrl(config: QRConfig): Promise<string> {
  const blob = await generateQRBlob(config)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
