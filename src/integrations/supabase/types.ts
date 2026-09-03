export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      certificates_issued: {
        Row: {
          aggregate_score: number
          candidate_name: string
          chapter_id: string
          hash: string
          id: string
          issued_at: string
          levels: Json
          user_id: string
        }
        Insert: {
          aggregate_score?: number
          candidate_name: string
          chapter_id?: string
          hash: string
          id?: string
          issued_at?: string
          levels?: Json
          user_id: string
        }
        Update: {
          aggregate_score?: number
          candidate_name?: string
          chapter_id?: string
          hash?: string
          id?: string
          issued_at?: string
          levels?: Json
          user_id?: string
        }
        Relationships: []
      }
      certification_attempts: {
        Row: {
          chapter_id: string
          coherence: number | null
          correct: boolean
          created_at: string
          direction: string | null
          duration_ms: number
          efficiency: number | null
          essential_found: number | null
          essential_total: number | null
          id: string
          level: string
          opened_card_ids: Json
          overtime_ms: number
          scenario_id: string
          scenario_index: number
          score: number
          user_id: string
        }
        Insert: {
          chapter_id?: string
          coherence?: number | null
          correct?: boolean
          created_at?: string
          direction?: string | null
          duration_ms?: number
          efficiency?: number | null
          essential_found?: number | null
          essential_total?: number | null
          id?: string
          level: string
          opened_card_ids?: Json
          overtime_ms?: number
          scenario_id: string
          scenario_index?: number
          score?: number
          user_id: string
        }
        Update: {
          chapter_id?: string
          coherence?: number | null
          correct?: boolean
          created_at?: string
          direction?: string | null
          duration_ms?: number
          efficiency?: number | null
          essential_found?: number | null
          essential_total?: number | null
          id?: string
          level?: string
          opened_card_ids?: Json
          overtime_ms?: number
          scenario_id?: string
          scenario_index?: number
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      certification_card_interactions: {
        Row: {
          attempt_id: string | null
          card_id: string
          created_at: string
          duration_ms: number
          id: string
          opened_at_ms: number
          reopens: number
          scenario_id: string
          user_id: string
        }
        Insert: {
          attempt_id?: string | null
          card_id: string
          created_at?: string
          duration_ms?: number
          id?: string
          opened_at_ms?: number
          reopens?: number
          scenario_id: string
          user_id: string
        }
        Update: {
          attempt_id?: string | null
          card_id?: string
          created_at?: string
          duration_ms?: number
          id?: string
          opened_at_ms?: number
          reopens?: number
          scenario_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certification_card_interactions_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "certification_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      certification_progress: {
        Row: {
          best_score: number
          chapter_id: string
          completed: number
          completed_at: string | null
          level: string
          passed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          best_score?: number
          chapter_id?: string
          completed?: number
          completed_at?: string | null
          level: string
          passed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          best_score?: number
          chapter_id?: string
          completed?: number
          completed_at?: string | null
          level?: string
          passed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      certification_reasoning: {
        Row: {
          attempt_id: string | null
          bias: string | null
          created_at: string
          free_text: string | null
          id: string
          items: Json
          scenario_id: string
          user_id: string
        }
        Insert: {
          attempt_id?: string | null
          bias?: string | null
          created_at?: string
          free_text?: string | null
          id?: string
          items?: Json
          scenario_id: string
          user_id: string
        }
        Update: {
          attempt_id?: string | null
          bias?: string | null
          created_at?: string
          free_text?: string | null
          id?: string
          items?: Json
          scenario_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certification_reasoning_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "certification_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_journal_entries: {
        Row: {
          attempt_id: string | null
          bias: string | null
          chapter_id: string
          coherence: number
          correct: boolean
          created_at: string
          direction: string
          efficiency: number
          id: string
          level: string
          reasoning: Json
          scenario_id: string
          symbol: string
          title: string
          user_id: string
        }
        Insert: {
          attempt_id?: string | null
          bias?: string | null
          chapter_id?: string
          coherence?: number
          correct?: boolean
          created_at?: string
          direction: string
          efficiency?: number
          id?: string
          level: string
          reasoning?: Json
          scenario_id: string
          symbol: string
          title: string
          user_id: string
        }
        Update: {
          attempt_id?: string | null
          bias?: string | null
          chapter_id?: string
          coherence?: number
          correct?: boolean
          created_at?: string
          direction?: string
          efficiency?: number
          id?: string
          level?: string
          reasoning?: Json
          scenario_id?: string
          symbol?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_journal_entries_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "certification_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_flags: {
        Row: {
          enabled: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          enabled?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          enabled?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          locale: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          locale?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      scenario_usage: {
        Row: {
          chapter_id: string
          cooldown_until: string | null
          created_at: string
          id: string
          last_used_at: string
          level: string
          scenario_id: string
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          chapter_id?: string
          cooldown_until?: string | null
          created_at?: string
          id?: string
          last_used_at?: string
          level: string
          scenario_id: string
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          chapter_id?: string
          cooldown_until?: string | null
          created_at?: string
          id?: string
          last_used_at?: string
          level?: string
          scenario_id?: string
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
