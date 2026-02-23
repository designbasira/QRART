import type { Database } from './database'

export type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Design = Database['public']['Tables']['designs']['Row']
export type Integration = Database['public']['Tables']['integrations']['Row']
export type ScanLog = Database['public']['Tables']['scan_logs']['Row']
