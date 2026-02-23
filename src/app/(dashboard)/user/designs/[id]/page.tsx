import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ContentEditor } from '@/components/user/content-editor'

export const metadata = { title: 'Modifier le design - Silhouette QR Live' }

export default async function EditDesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: design } = await supabase
    .from('designs')
    .select('*')
    .eq('id', id)
    .single()

  if (!design) notFound()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Modifier : {design.title}</h2>
      <ContentEditor design={design} />
    </div>
  )
}
