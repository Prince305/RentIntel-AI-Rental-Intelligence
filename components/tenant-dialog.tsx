'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type Tenant = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  lease_start: string;
  lease_end: string;
  payment_status: 'CURRENT' | 'LATE' | 'DEFAULTED' | 'UNKNOWN';
  last_payment_date: string | null;
  risk_score: number;
};

type TenantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: Tenant | null;
  onSuccess: () => void;
};

export function TenantDialog({ open, onOpenChange, tenant, onSuccess }: TenantDialogProps) {
  const { organization } = useOrg();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    lease_start: '',
    lease_end: '',
    payment_status: 'CURRENT' as 'CURRENT' | 'LATE' | 'DEFAULTED' | 'UNKNOWN',
    last_payment_date: '',
    risk_score: 50,
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        email: tenant.email || '',
        phone: tenant.phone || '',
        lease_start: tenant.lease_start,
        lease_end: tenant.lease_end,
        payment_status: tenant.payment_status,
        last_payment_date: tenant.last_payment_date || '',
        risk_score: tenant.risk_score,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        lease_start: '',
        lease_end: '',
        payment_status: 'CURRENT',
        last_payment_date: '',
        risk_score: 50,
      });
    }
  }, [tenant, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    setLoading(true);

    try {
      const data = {
        org_id: organization.id,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        lease_start: formData.lease_start,
        lease_end: formData.lease_end,
        payment_status: formData.payment_status,
        last_payment_date: formData.last_payment_date || null,
        risk_score: formData.risk_score,
      };

      if (tenant) {
        const { error } = await supabase
          .from('tenants')
          .update(data)
          .eq('id', tenant.id);

        if (error) throw error;
        toast.success('Tenant updated successfully');
      } else {
        const { error } = await supabase.from('tenants').insert(data);

        if (error) throw error;
        toast.success('Tenant added successfully');
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tenant ? 'Edit Tenant' : 'Add Tenant'}</DialogTitle>
          <DialogDescription>
            {tenant ? 'Update tenant details below' : 'Enter the details of your tenant'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lease_start">Lease Start Date</Label>
              <Input
                id="lease_start"
                type="date"
                value={formData.lease_start}
                onChange={(e) => setFormData({ ...formData, lease_start: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lease_end">Lease End Date</Label>
              <Input
                id="lease_end"
                type="date"
                value={formData.lease_end}
                onChange={(e) => setFormData({ ...formData, lease_end: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_status">Payment Status</Label>
              <Select
                value={formData.payment_status}
                onValueChange={(value: any) => setFormData({ ...formData, payment_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="LATE">Late</SelectItem>
                  <SelectItem value="DEFAULTED">Defaulted</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_payment_date">Last Payment Date</Label>
              <Input
                id="last_payment_date"
                type="date"
                value={formData.last_payment_date}
                onChange={(e) => setFormData({ ...formData, last_payment_date: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="risk_score">Risk Score (0-100)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="risk_score"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.risk_score}
                  onChange={(e) => setFormData({ ...formData, risk_score: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-lg font-semibold w-12 text-center">{formData.risk_score}</span>
              </div>
              <p className="text-xs text-gray-500">
                Higher score indicates higher risk. Consider payment history, lease violations, etc.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#00BFA5] hover:bg-[#00A891]" disabled={loading}>
              {loading ? 'Saving...' : tenant ? 'Update' : 'Add Tenant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
