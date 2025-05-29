export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'moderator' | 'user'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'moderator' | 'user'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'moderator' | 'user'
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type UpdateProfile = Database['public']['Tables']['profiles']['Update']