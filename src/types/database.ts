export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'user'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'user'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'user'
          avatar_url?: string | null
          updated_at?: string
        }
      }
      designs: {
        Row: {
          id: string
          short_id: string
          owner_id: string
          title: string
          original_image_url: string | null
          silhouette_image_url: string | null
          qr_code_url: string | null
          final_composite_url: string | null
          current_message: string
          current_media_url: string | null
          content_type: 'text' | 'image' | 'link'
          is_active: boolean
          is_published: boolean
          scan_count: number
          last_scanned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          short_id: string
          owner_id: string
          title?: string
          original_image_url?: string | null
          silhouette_image_url?: string | null
          qr_code_url?: string | null
          final_composite_url?: string | null
          current_message?: string
          current_media_url?: string | null
          content_type?: 'text' | 'image' | 'link'
          is_active?: boolean
          is_published?: boolean
          scan_count?: number
          last_scanned_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          short_id?: string
          owner_id?: string
          title?: string
          original_image_url?: string | null
          silhouette_image_url?: string | null
          qr_code_url?: string | null
          final_composite_url?: string | null
          current_message?: string
          current_media_url?: string | null
          content_type?: 'text' | 'image' | 'link'
          is_active?: boolean
          is_published?: boolean
          scan_count?: number
          last_scanned_at?: string | null
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          design_id: string | null
          provider: 'google_drive' | 'dropbox' | 'onedrive'
          share_link: string
          label: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          design_id?: string | null
          provider: 'google_drive' | 'dropbox' | 'onedrive'
          share_link: string
          label?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          user_id?: string
          design_id?: string | null
          provider?: 'google_drive' | 'dropbox' | 'onedrive'
          share_link?: string
          label?: string | null
          is_active?: boolean
        }
      }
      scan_logs: {
        Row: {
          id: string
          design_id: string
          scanned_at: string
          ip_address: string | null
          user_agent: string | null
          referer: string | null
        }
        Insert: {
          id?: string
          design_id: string
          scanned_at?: string
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
        }
        Update: {
          design_id?: string
          scanned_at?: string
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
        }
      }
    }
    Functions: {
      increment_scan_count: {
        Args: { p_design_id: string }
        Returns: void
      }
    }
  }
}
