import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          timezone: string;
          stripe_customer_id: string | null;
          plan: 'free' | 'pro' | 'enterprise';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          timezone?: string;
          stripe_customer_id?: string | null;
          plan?: 'free' | 'pro' | 'enterprise';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          timezone?: string;
          stripe_customer_id?: string | null;
          plan?: 'free' | 'pro' | 'enterprise';
          created_at?: string;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          org_id: string;
          role: 'OWNER' | 'ADMIN' | 'ANALYST' | 'VIEWER';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          org_id: string;
          role?: 'OWNER' | 'ADMIN' | 'ANALYST' | 'VIEWER';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          org_id?: string;
          role?: 'OWNER' | 'ADMIN' | 'ANALYST' | 'VIEWER';
          created_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          org_id: string;
          address: string;
          region: string;
          type: string;
          bedrooms: number;
          bathrooms: number;
          size_m2: number;
          amenities: any;
          current_rent: number;
          target_rent: number;
          expenses: number;
          tenant_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          address: string;
          region: string;
          type: string;
          bedrooms?: number;
          bathrooms?: number;
          size_m2?: number;
          amenities?: any;
          current_rent?: number;
          target_rent?: number;
          expenses?: number;
          tenant_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          address?: string;
          region?: string;
          type?: string;
          bedrooms?: number;
          bathrooms?: number;
          size_m2?: number;
          amenities?: any;
          current_rent?: number;
          target_rent?: number;
          expenses?: number;
          tenant_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tenants: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          lease_start: string;
          lease_end: string;
          payment_status: 'CURRENT' | 'LATE' | 'DEFAULTED' | 'UNKNOWN';
          last_payment_date: string | null;
          risk_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          lease_start: string;
          lease_end: string;
          payment_status?: 'CURRENT' | 'LATE' | 'DEFAULTED' | 'UNKNOWN';
          last_payment_date?: string | null;
          risk_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          lease_start?: string;
          lease_end?: string;
          payment_status?: 'CURRENT' | 'LATE' | 'DEFAULTED' | 'UNKNOWN';
          last_payment_date?: string | null;
          risk_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      market_data: {
        Row: {
          id: string;
          region: string;
          property_type: string;
          avg_rent: number;
          vacancy_rate: number;
          updated_at: string;
        };
      };
      insights: {
        Row: {
          id: string;
          org_id: string;
          property_id: string | null;
          type: string;
          message: string;
          severity: 'INFO' | 'WARNING' | 'CRITICAL';
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          property_id?: string | null;
          type: string;
          message: string;
          severity?: 'INFO' | 'WARNING' | 'CRITICAL';
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          org_id: string;
          month: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          month: string;
          url: string;
          created_at?: string;
        };
      };
      files: {
        Row: {
          id: string;
          org_id: string;
          property_id: string | null;
          tenant_id: string | null;
          kind: string;
          path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          property_id?: string | null;
          tenant_id?: string | null;
          kind: string;
          path: string;
          created_at?: string;
        };
      };
    };
  };
};
