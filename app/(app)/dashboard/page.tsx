'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrg } from '@/lib/org-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Home, Users, AlertCircle } from 'lucide-react';

type DashboardStats = {
  totalProperties: number;
  occupiedProperties: number;
  totalTenants: number;
  averageRent: number;
  totalExpenses: number;
  criticalInsights: number;
};

export default function DashboardPage() {
  const { organization } = useOrg();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    occupiedProperties: 0,
    totalTenants: 0,
    averageRent: 0,
    totalExpenses: 0,
    criticalInsights: 0,
  });
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  useEffect(() => {
    if (!organization) return;

    const loadDashboardData = async () => {
      try {
        const [propertiesRes, tenantsRes, insightsRes] = await Promise.all([
          supabase.from('properties').select('*').eq('org_id', organization.id),
          supabase.from('tenants').select('*').eq('org_id', organization.id),
          supabase
            .from('insights')
            .select('*')
            .eq('org_id', organization.id)
            .eq('severity', 'CRITICAL')
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        const properties = propertiesRes.data || [];
        const tenants = tenantsRes.data || [];
        const criticalInsights = insightsRes.data || [];

        const totalRent = properties.reduce((sum, p) => sum + p.current_rent, 0);
        const totalExpenses = properties.reduce((sum, p) => sum + p.expenses, 0);
        const occupiedProperties = properties.filter((p) => p.tenant_id).length;

        setStats({
          totalProperties: properties.length,
          occupiedProperties,
          totalTenants: tenants.length,
          averageRent: properties.length > 0 ? totalRent / properties.length : 0,
          totalExpenses,
          criticalInsights: criticalInsights.length,
        });

        if (properties.length > 0) {
          const netIncome = totalRent - totalExpenses;
          const occupancyRate = properties.length > 0 ? (occupiedProperties / properties.length) * 100 : 0;
          setAiSummary(
            `Your portfolio has ${properties.length} properties with ${occupancyRate.toFixed(
              1
            )}% occupancy. Net monthly income is R${(netIncome / 100).toLocaleString()} with ${
              criticalInsights.length
            } items requiring immediate attention.`
          );
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [organization]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA5]"></div>
      </div>
    );
  }

  const occupancyRate =
    stats.totalProperties > 0 ? (stats.occupiedProperties / stats.totalProperties) * 100 : 0;
  const netIncome = stats.averageRent * stats.totalProperties - stats.totalExpenses;
  const roi = stats.totalExpenses > 0 ? (netIncome / stats.totalExpenses) * 100 : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back to your property portfolio</p>
      </div>

      {aiSummary && (
        <Card className="border-[#00BFA5] bg-gradient-to-r from-[#001F3F]/5 to-[#00BFA5]/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#00BFA5]" />
              What changed this month?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{aiSummary}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Occupancy Rate</CardTitle>
            <Home className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.occupiedProperties} of {stats.totalProperties} occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{roi.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">Net income vs expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalTenants}</div>
            <p className="text-xs text-gray-500 mt-1">Active leases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.criticalInsights}</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Monthly Rent</CardTitle>
            <CardDescription>Per property</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00BFA5]">
              R{(stats.averageRent / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Monthly Income</CardTitle>
            <CardDescription>Total rent minus expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00BFA5]">
              R{(netIncome / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
