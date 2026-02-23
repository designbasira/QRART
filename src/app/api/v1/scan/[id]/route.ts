import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: design, error } = await supabase
    .from('designs')
    .select('id, current_message, current_media_url, content_type, is_active, is_published')
    .eq('short_id', id)
    .single()

  if (error || !design || !design.is_active || !design.is_published) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  // Log the scan (fire and forget)
  supabase.from('scan_logs').insert({
    design_id: design.id,
    ip_address: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip'),
    user_agent: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
  })

  // Increment scan count
  supabase.rpc('increment_scan_count', { p_design_id: design.id })

  // Redirect to the public content page
  return NextResponse.redirect(new URL(`/scan/${id}`, request.url))
}
