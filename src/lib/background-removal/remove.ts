'use client'

import { removeBackground, type Config } from '@imgly/background-removal'

export interface RemovalProgress {
  phase: 'loading' | 'processing' | 'complete'
  progress: number
}

export async function removeImageBackground(
  imageSource: string | Blob | ArrayBuffer,
  onProgress?: (progress: RemovalProgress) => void
): Promise<Blob> {
  const config: Config = {
    progress: (key: string, current: number, total: number) => {
      if (onProgress) {
        const phase = key.includes('load') ? 'loading' : 'processing'
        onProgress({ phase, progress: current / total })
      }
    },
    output: {
      format: 'image/png',
      quality: 0.95,
    },
  }

  const result = await removeBackground(imageSource, config)
  onProgress?.({ phase: 'complete', progress: 1 })
  return result
}
