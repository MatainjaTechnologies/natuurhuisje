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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          alternative_email: string | null
          auth_user_id: string
          avatar_url: string | null
          business_license: string | null
          city: string | null
          company_name: string | null
          coordinates: unknown
          country: string
          created_at: string
          currency_preference: string
          date_of_birth: string | null
          display_name: string | null
          email: string
          email_notifications: boolean
          first_name: string | null
          gender: Database["public"]["Enums"]["user_gender"] | null
          id: string
          is_verified: boolean
          last_login_at: string | null
          last_name: string | null
          marketing_emails: boolean
          metadata: Json | null
          nationality: string | null
          payment_methods: Json | null
          phone_country_code: string | null
          phone_full: string | null
          phone_number: string | null
          phone_verification_code: string | null
          phone_verified: boolean
          postal_code: string | null
          preferences: Json | null
          preferred_language: string
          role: Database["public"]["Enums"]["user_role"]
          sms_notifications: boolean
          state: string | null
          status: Database["public"]["Enums"]["user_status"]
          stripe_customer_id: string | null
          tax_id: string | null
          timezone: string
          updated_at: string
          verification_document_url: string | null
          website: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          alternative_email?: string | null
          auth_user_id: string
          avatar_url?: string | null
          business_license?: string | null
          city?: string | null
          company_name?: string | null
          coordinates?: unknown
          country?: string
          created_at?: string
          currency_preference?: string
          date_of_birth?: string | null
          display_name?: string | null
          email: string
          email_notifications?: boolean
          first_name?: string | null
          gender?: Database["public"]["Enums"]["user_gender"] | null
          id?: string
          is_verified?: boolean
          last_login_at?: string | null
          last_name?: string | null
          marketing_emails?: boolean
          metadata?: Json | null
          nationality?: string | null
          payment_methods?: Json | null
          phone_country_code?: string | null
          phone_full?: string | null
          phone_number?: string | null
          phone_verification_code?: string | null
          phone_verified?: boolean
          postal_code?: string | null
          preferences?: Json | null
          preferred_language?: string
          role?: Database["public"]["Enums"]["user_role"]
          sms_notifications?: boolean
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          stripe_customer_id?: string | null
          tax_id?: string | null
          timezone?: string
          updated_at?: string
          verification_document_url?: string | null
          website?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          alternative_email?: string | null
          auth_user_id?: string
          avatar_url?: string | null
          business_license?: string | null
          city?: string | null
          company_name?: string | null
          coordinates?: unknown
          country?: string
          created_at?: string
          currency_preference?: string
          date_of_birth?: string | null
          display_name?: string | null
          email?: string
          email_notifications?: boolean
          first_name?: string | null
          gender?: Database["public"]["Enums"]["user_gender"] | null
          id?: string
          is_verified?: boolean
          last_login_at?: string | null
          last_name?: string | null
          marketing_emails?: boolean
          metadata?: Json | null
          nationality?: string | null
          payment_methods?: Json | null
          phone_country_code?: string | null
          phone_full?: string | null
          phone_number?: string | null
          phone_verification_code?: string | null
          phone_verified?: boolean
          postal_code?: string | null
          preferences?: Json | null
          preferred_language?: string
          role?: Database["public"]["Enums"]["user_role"]
          sms_notifications?: boolean
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          stripe_customer_id?: string | null
          tax_id?: string | null
          timezone?: string
          updated_at?: string
          verification_document_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: number
          similarity: number
          title: string
        }[]
      }
    }
    Enums: {
      user_gender: "male" | "female" | "other" | "prefer_not_to_say"
      user_role: "user" | "landlord" | "admin"
      user_status: "active" | "inactive" | "suspended" | "pending_verification"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      user_gender: ["male", "female", "other", "prefer_not_to_say"],
      user_role: ["user", "landlord", "admin"],
      user_status: ["active", "inactive", "suspended", "pending_verification"],
    },
  },
} as const
