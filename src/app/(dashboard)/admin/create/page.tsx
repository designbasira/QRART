import { CreationPipeline } from '@/components/admin/creation-pipeline'

export const metadata = { title: 'Nouveau design - Silhouette QR Live' }

export default function CreateDesignPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nouveau design</h2>
      <CreationPipeline />
    </div>
  )
}
