export interface QRConfig {
  shortId: string
  width?: number
  height?: number
  overlayImageUrl?: string
  dotsColor?: string
  dotsType?: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
  cornersColor?: string
  backgroundColor?: string
  imageMargin?: number
}

export interface QRGenerationResult {
  blob: Blob
  dataUrl: string
}
