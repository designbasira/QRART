
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, Image } from 'lucide-react'

interface ImageUploadProps {
  onImageUploaded: (dataUrl: string) => void
}

export function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      onImageUploaded(dataUrl)
    }
    reader.readAsDataURL(file)
  }, [onImageUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Importer l&apos;image client</h3>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-[24px] p-6 sm:p-12 text-center cursor-pointer transition-all duration-240 ${
          isDragActive
            ? 'border-primary bg-primary-soft/30'
            : 'border-border hover:border-accent hover:bg-surface-alt/30'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-[18px]" />
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-[18px] bg-surface-alt flex items-center justify-center mx-auto">
              {isDragActive ? (
                <Image size={24} className="text-primary" />
              ) : (
                <CloudUpload size={24} className="text-accent" />
              )}
            </div>
            <p className="text-text-secondary">
              {isDragActive
                ? 'Déposez l\'image ici...'
                : 'Glissez-déposez une image ou cliquez pour sélectionner'}
            </p>
            <span className="inline-block text-xs bg-surface-alt text-text-secondary px-3 py-1 rounded-[999px]">
              PNG, JPG, WEBP — Max 10 Mo
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
