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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      batch_products: {
        Row: {
          batch_id: string
          completed_quantity: number | null
          created_at: string
          id: string
          product_id: string
          quantity: number
        }
        Insert: {
          batch_id: string
          completed_quantity?: number | null
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
        }
        Update: {
          batch_id?: string
          completed_quantity?: number | null
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "batch_products_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          batch_id: string
          completed_parts: number | null
          created_at: string
          efficiency_percentage: number | null
          estimated_completion_time: string | null
          id: string
          name: string
          operator_name: string
          priority: Database["public"]["Enums"]["priority_level"]
          progress_percentage: number | null
          quality_score_percentage: number | null
          start_time: string | null
          status: Database["public"]["Enums"]["batch_status"]
          total_parts: number | null
          updated_at: string
        }
        Insert: {
          batch_id: string
          completed_parts?: number | null
          created_at?: string
          efficiency_percentage?: number | null
          estimated_completion_time?: string | null
          id?: string
          name: string
          operator_name: string
          priority?: Database["public"]["Enums"]["priority_level"]
          progress_percentage?: number | null
          quality_score_percentage?: number | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["batch_status"]
          total_parts?: number | null
          updated_at?: string
        }
        Update: {
          batch_id?: string
          completed_parts?: number | null
          created_at?: string
          efficiency_percentage?: number | null
          estimated_completion_time?: string | null
          id?: string
          name?: string
          operator_name?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          progress_percentage?: number | null
          quality_score_percentage?: number | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["batch_status"]
          total_parts?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      machines: {
        Row: {
          created_at: string
          current_batch_id: string | null
          efficiency_percentage: number | null
          id: string
          last_maintenance: string | null
          machine_name: string
          machine_type: string
          status: string
          updated_at: string
          uptime_hours: number | null
        }
        Insert: {
          created_at?: string
          current_batch_id?: string | null
          efficiency_percentage?: number | null
          id?: string
          last_maintenance?: string | null
          machine_name: string
          machine_type: string
          status?: string
          updated_at?: string
          uptime_hours?: number | null
        }
        Update: {
          created_at?: string
          current_batch_id?: string | null
          efficiency_percentage?: number | null
          id?: string
          last_maintenance?: string | null
          machine_name?: string
          machine_type?: string
          status?: string
          updated_at?: string
          uptime_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "machines_current_batch_id_fkey"
            columns: ["current_batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      product_operations: {
        Row: {
          angle_value: number | null
          created_at: string
          id: string
          operation_order: number
          operation_type: string
          position_mm: number
          product_id: string
          size_value: number | null
        }
        Insert: {
          angle_value?: number | null
          created_at?: string
          id?: string
          operation_order?: number
          operation_type: string
          position_mm: number
          product_id: string
          size_value?: number | null
        }
        Update: {
          angle_value?: number | null
          created_at?: string
          id?: string
          operation_order?: number
          operation_type?: string
          position_mm?: number
          product_id?: string
          size_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_operations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          data3: string | null
          data5: string | null
          data6: string | null
          estimated_cut_time_seconds: number | null
          id: string
          length_mm: number
          name: string
          nc_file_generated: boolean | null
          operations_count: number | null
          priority: number | null
          product_id: string
          profile: Database["public"]["Enums"]["product_profile"]
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          data3?: string | null
          data5?: string | null
          data6?: string | null
          estimated_cut_time_seconds?: number | null
          id?: string
          length_mm: number
          name: string
          nc_file_generated?: boolean | null
          operations_count?: number | null
          priority?: number | null
          product_id: string
          profile: Database["public"]["Enums"]["product_profile"]
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          data3?: string | null
          data5?: string | null
          data6?: string | null
          estimated_cut_time_seconds?: number | null
          id?: string
          length_mm?: number
          name?: string
          nc_file_generated?: boolean | null
          operations_count?: number | null
          priority?: number | null
          product_id?: string
          profile?: Database["public"]["Enums"]["product_profile"]
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "office" | "user"
      batch_status:
        | "Draft"
        | "Queued"
        | "Running"
        | "Paused"
        | "Completed"
        | "Error"
      priority_level: "Low" | "Medium" | "High" | "Critical"
      product_profile:
        | "IPE240"
        | "IPE300"
        | "HEB200"
        | "HEB300"
        | "L80x80"
        | "L100x100"
      product_status: "Draft" | "Ready" | "Processing" | "Complete"
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
      app_role: ["admin", "office", "user"],
      batch_status: [
        "Draft",
        "Queued",
        "Running",
        "Paused",
        "Completed",
        "Error",
      ],
      priority_level: ["Low", "Medium", "High", "Critical"],
      product_profile: [
        "IPE240",
        "IPE300",
        "HEB200",
        "HEB300",
        "L80x80",
        "L100x100",
      ],
      product_status: ["Draft", "Ready", "Processing", "Complete"],
    },
  },
} as const
