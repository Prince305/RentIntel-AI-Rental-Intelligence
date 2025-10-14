'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth-context';

type Organization = {
  id: string;
  name: string;
  timezone: string;
  stripe_customer_id: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
};

type Membership = {
  id: string;
  user_id: string;
  org_id: string;
  role: 'OWNER' | 'ADMIN' | 'ANALYST' | 'VIEWER';
  created_at: string;
};

type OrgContextType = {
  organization: Organization | null;
  membership: Membership | null;
  loading: boolean;
  hasRole: (role: 'OWNER' | 'ADMIN' | 'ANALYST' | 'VIEWER') => boolean;
  canWrite: () => boolean;
  refreshOrg: () => Promise<void>;
};

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrgData = async () => {
    if (!user) {
      setOrganization(null);
      setMembership(null);
      setLoading(false);
      return;
    }

    try {
      const { data: memberships, error: membershipError } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1);

      if (membershipError) throw membershipError;

      if (memberships && memberships.length > 0) {
        const firstMembership = memberships[0];
        setMembership(firstMembership);

        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', firstMembership.org_id)
          .maybeSingle();

        if (orgError) throw orgError;
        setOrganization(org);
      } else {
        setOrganization(null);
        setMembership(null);
      }
    } catch (error) {
      console.error('Error loading org data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgData();
  }, [user]);

  const hasRole = (requiredRole: 'OWNER' | 'ADMIN' | 'ANALYST' | 'VIEWER') => {
    if (!membership) return false;

    const roleHierarchy: Record<string, number> = {
      OWNER: 4,
      ADMIN: 3,
      ANALYST: 2,
      VIEWER: 1,
    };

    return roleHierarchy[membership.role] >= roleHierarchy[requiredRole];
  };

  const canWrite = () => {
    return hasRole('ADMIN');
  };

  return (
    <OrgContext.Provider
      value={{
        organization,
        membership,
        loading,
        hasRole,
        canWrite,
        refreshOrg: loadOrgData,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
}
