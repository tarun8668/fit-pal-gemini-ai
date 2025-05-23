export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      meal_tracking: {
        Row: {
          calories: number
          carbs: number
          created_at: string | null
          fat: number
          food_items: string
          id: string
          meal_date: string
          meal_name: string
          meal_type: string
          protein: number
          user_id: string
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string | null
          fat: number
          food_items: string
          id?: string
          meal_date?: string
          meal_name: string
          meal_type: string
          protein: number
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string | null
          fat?: number
          food_items?: string
          id?: string
          meal_date?: string
          meal_name?: string
          meal_type?: string
          protein?: number
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          order_id: string
          payment_id: string | null
          plan_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: string
          id?: string
          order_id: string
          payment_id?: string | null
          plan_id: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          order_id?: string
          payment_id?: string | null
          plan_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_diet_plans: {
        Row: {
          carbs_target: number
          created_at: string | null
          daily_calories: number
          description: string | null
          fat_target: number
          id: string
          plan_name: string
          protein_target: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          carbs_target: number
          created_at?: string | null
          daily_calories: number
          description?: string | null
          fat_target: number
          id?: string
          plan_name: string
          protein_target: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          carbs_target?: number
          created_at?: string | null
          daily_calories?: number
          description?: string | null
          fat_target?: number
          id?: string
          plan_name?: string
          protein_target?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          payment_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          payment_id?: string | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          payment_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          created_at: string | null
          daily_calorie_goal: number | null
          diet_preferences: string | null
          gender: string | null
          goal: string | null
          height: number | null
          id: string
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          created_at?: string | null
          daily_calorie_goal?: number | null
          diet_preferences?: string | null
          gender?: string | null
          goal?: string | null
          height?: number | null
          id: string
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          created_at?: string | null
          daily_calorie_goal?: number | null
          diet_preferences?: string | null
          gender?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
