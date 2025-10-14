'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Mail, Phone, AlertTriangle } from 'lucide-react';
import { TenantDialog } from '@/components/tenant-dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

type Tenant = {
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

export default function TenantsPage() {
  const { organization, canWrite } = useOrg();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const loadTenants = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('org_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error loading tenants:', error);
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, [organization]);

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTenant(null);
    loadTenants();
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'CURRENT':
        return 'bg-green-100 text-green-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DEFAULTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: 'High', color: 'text-red-600' };
    if (score >= 40) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600 mt-1">Manage tenant information and leases</p>
        </div>
        {canWrite() && (
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-[#00BFA5] hover:bg-[#00A891]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        )}
      </div>

      {tenants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tenants yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Add your first tenant to start tracking leases and payments
            </p>
            {canWrite() && (
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-[#00BFA5] hover:bg-[#00A891]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => {
            const risk = getRiskLevel(tenant.risk_score);
            const leaseEnding = new Date(tenant.lease_end) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

            return (
              <Card
                key={tenant.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleEdit(tenant)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Risk: <span className={risk.color}>{risk.label}</span> ({tenant.risk_score})
                      </CardDescription>
                    </div>
                    <Badge className={getPaymentStatusColor(tenant.payment_status)}>
                      {tenant.payment_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tenant.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {tenant.email}
                    </div>
                  )}
                  {tenant.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {tenant.phone}
                    </div>
                  )}

                  <div className="pt-3 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lease Start</span>
                      <span className="font-medium">{format(new Date(tenant.lease_start), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lease End</span>
                      <span className="font-medium">{format(new Date(tenant.lease_end), 'MMM dd, yyyy')}</span>
                    </div>
                    {tenant.last_payment_date && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Payment</span>
                        <span className="font-medium">
                          {format(new Date(tenant.last_payment_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>

                  {leaseEnding && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded">
                      <AlertTriangle className="h-4 w-4" />
                      Lease ending soon
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <TenantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tenant={editingTenant}
        onSuccess={handleDialogClose}
      />
    </div>
  );
}
