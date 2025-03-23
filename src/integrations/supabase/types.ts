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
      food_items: {
        Row: {
          calories_per_100g: number
          carbs_per_100g: string | null
          category: Database["public"]["Enums"]["food_category"]
          created_at: string | null
          created_by: string | null
          fat_per_100g: string | null
          id: string
          name: string
          protein_per_100g: string | null
          recommended_serving: number | null
          serving_unit: Database["public"]["Enums"]["serving_unit"] | null
          trainer_notes: string | null
          updated_at: string | null
        }
        Insert: {
          calories_per_100g: number
          carbs_per_100g?: string | null
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string | null
          created_by?: string | null
          fat_per_100g?: string | null
          id?: string
          name: string
          protein_per_100g?: string | null
          recommended_serving?: number | null
          serving_unit?: Database["public"]["Enums"]["serving_unit"] | null
          trainer_notes?: string | null
          updated_at?: string | null
        }
        Update: {
          calories_per_100g?: number
          carbs_per_100g?: string | null
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string | null
          created_by?: string | null
          fat_per_100g?: string | null
          id?: string
          name?: string
          protein_per_100g?: string | null
          recommended_serving?: number | null
          serving_unit?: Database["public"]["Enums"]["serving_unit"] | null
          trainer_notes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      meal_logs: {
        Row: {
          calories: number
          carbs: number | null
          created_at: string | null
          fat: number | null
          food_item_id: string
          id: string
          logged_at: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          protein: number | null
          quantity: number
          user_id: string
        }
        Insert: {
          calories: number
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          food_item_id: string
          id?: string
          logged_at?: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          protein?: number | null
          quantity: number
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          food_item_id?: string
          id?: string
          logged_at?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          protein?: number | null
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_logs_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      student_details: {
        Row: {
          age: number | null
          calories_goal: number | null
          carbs_goal: number | null
          created_at: string | null
          dietary_preference:
            | Database["public"]["Enums"]["dietary_preference"]
            | null
          fat_goal: number | null
          id: string
          personal_goal: Database["public"]["Enums"]["personal_goal"] | null
          protein_goal: number | null
          status: Database["public"]["Enums"]["student_status"] | null
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          calories_goal?: number | null
          carbs_goal?: number | null
          created_at?: string | null
          dietary_preference?:
            | Database["public"]["Enums"]["dietary_preference"]
            | null
          fat_goal?: number | null
          id: string
          personal_goal?: Database["public"]["Enums"]["personal_goal"] | null
          protein_goal?: number | null
          status?: Database["public"]["Enums"]["student_status"] | null
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          calories_goal?: number | null
          carbs_goal?: number | null
          created_at?: string | null
          dietary_preference?:
            | Database["public"]["Enums"]["dietary_preference"]
            | null
          fat_goal?: number | null
          id?: string
          personal_goal?: Database["public"]["Enums"]["personal_goal"] | null
          protein_goal?: number | null
          status?: Database["public"]["Enums"]["student_status"] | null
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trainer_feedback: {
        Row: {
          created_at: string | null
          id: string
          message: string
          student_id: string
          trainer_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          student_id: string
          trainer_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          student_id?: string
          trainer_id?: string
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
      dietary_preference:
        | "standard"
        | "vegetarian"
        | "vegan"
        | "keto"
        | "paleo"
        | "other"
      food_category:
        | "protein"
        | "carbs"
        | "fat"
        | "vegetable"
        | "fruit"
        | "dairy"
        | "other"
      meal_type: "breakfast" | "lunch" | "dinner" | "snack"
      personal_goal:
        | "weight-loss"
        | "muscle-gain"
        | "maintenance"
        | "general-health"
        | "performance"
      serving_unit: "g" | "ml" | "serving"
      student_status: "pending" | "active" | "inactive"
      user_role: "admin" | "trainer" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
