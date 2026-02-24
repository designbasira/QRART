import { CreationPipeline } from '@/components/admin/creation-pipeline'

export function AdminCreatePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nouveau design</h2>
      <CreationPipeline />
    </div>
  )
}
