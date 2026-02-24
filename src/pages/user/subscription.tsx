import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { SubscriptionContent } from '@/components/user/subscription-content'

export function UserSubscriptionPage() {
  const { user, profile } = useAuth()
  const [designCount, setDesignCount] = useState(0)

  useEffect(() => {
    if (!user) return
    async function load() {
      const supabase = createClient()
      const { count } = await supabase.from('designs').select('*', { count: 'exact', head: true }).eq('owner_id', user!.id)
      setDesignCount(count || 0)
    }
    load()
  }, [user])

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-[26px] font-bold text-text-primary">Abonnement</h2>
        <p className="text-text-secondary mt-1">Gérez votre plan et consultez votre utilisation</p>
      </div>
      <SubscriptionContent currentPlan={'free'} designCount={designCount} />
    </div>
  )
}
