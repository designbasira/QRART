import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKETS } from '@/lib/constants'

type BucketName = keyof typeof STORAGE_BUCKETS

export async function uploadFile(
  file: File | Blob,
  bucket: BucketName,
  path: string
): Promise<string> {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(path, file, {
      contentType: file instanceof File ? file.type : 'image/png',
      upsert: false,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export function generateFilePath(userId: string, extension: string = 'png'): string {
  return `${userId}/${Date.now()}.${extension}`
}
