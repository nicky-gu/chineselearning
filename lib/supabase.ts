import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          pin: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          pin?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          pin?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      learning_data: {
        Row: {
          id: string
          user_id: string
          pinyin_practice: any
          dictation_practice: any
          sound_game: any
          mistakes_dictation: any
          mistakes_sound: any
          statistics: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pinyin_practice?: any
          dictation_practice?: any
          sound_game?: any
          mistakes_dictation?: any
          mistakes_sound?: any
          statistics?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pinyin_practice?: any
          dictation_practice?: any
          sound_game?: any
          mistakes_dictation?: any
          mistakes_sound?: any
          statistics?: any
          created_at?: string
          updated_at?: string
        }
      }
      ai_interactions: {
        Row: {
          id: string
          user_id: string
          interaction_type: string
          input_data: any
          ai_response: any
          model_used: string
          tokens_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          interaction_type: string
          input_data: any
          ai_response: any
          model_used: string
          tokens_used?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          interaction_type?: string
          input_data?: any
          ai_response?: any
          model_used?: string
          tokens_used?: number
          created_at?: string
        }
      }
      ai_usage_quotas: {
        Row: {
          id: string
          user_id: string
          date: string
          request_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          request_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          request_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
