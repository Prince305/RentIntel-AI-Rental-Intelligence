'use client';

import { useState } from 'react';
import { useOrg } from '@/lib/org-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, CreditCard, Crown } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { organization, refreshOrg, canWrite } = useOrg();
  const [orgName, setOrgName] = useState(organization?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSaveOrg = async () => {
    if (!organization || !canWrite()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ name: orgName })
        .eq('id', organization.id);

      if (error) throw error;

      toast.success('Organization updated successfully');
      refreshOrg();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update organization');
    } finally {
      setSaving(false);
    }
  };

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case 'free':
        return {
          name: 'Free',
          price: 'R0',
          features: ['Up to 3 properties', 'Basic insights', 'Email support'],
          color: 'bg-gray-100 text-gray-800',
        };
      case 'pro':
        return {
          name: 'Pro',
          price: 'R499/month',
          features: ['Up to 20 properties', 'Full AI insights', 'Monthly reports', 'Priority support'],
          color: 'bg-[#00BFA5] text-white',
        };
      case 'enterprise':
        return {
          name: 'Enterprise',
          price: 'R1,999/month',
          features: [
            'Unlimited properties',
            'Advanced AI features',
            'White-label ready',
            'Dedicated support',
            'Custom integrations',
          ],
          color: 'bg-[#001F3F] text-white',
        };
      default:
        return {
          name: 'Unknown',
          price: 'N/A',
          features: [],
          color: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const currentPlan = getPlanDetails(organization?.plan || 'free');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your organization and billing preferences</p>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Update your organization information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={!canWrite()}
                />
              </div>
              <div className="space-y-2">
                <Label>Organization ID</Label>
                <Input value={organization?.id || ''} disabled />
              </div>
              {canWrite() && (
                <Button
                  onClick={handleSaveOrg}
                  disabled={saving || orgName === organization?.name}
                  className="bg-[#00BFA5] hover:bg-[#00A891]"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${currentPlan.color}`}>
                    <Crown className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{currentPlan.name} Plan</h3>
                    <p className="text-sm text-gray-600">{currentPlan.price}</p>
                  </div>
                </div>
                <Badge className={currentPlan.color}>{currentPlan.name}</Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Plan Features</h4>
                <ul className="space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00BFA5]"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Available Plans</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['free', 'pro', 'enterprise'].map((plan) => {
                    const planDetails = getPlanDetails(plan);
                    const isCurrent = organization?.plan === plan;

                    return (
                      <Card key={plan} className={isCurrent ? 'border-[#00BFA5] border-2' : ''}>
                        <CardHeader>
                          <CardTitle className="text-lg">{planDetails.name}</CardTitle>
                          <CardDescription className="text-xl font-bold">
                            {planDetails.price}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 mb-4">
                            {planDetails.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button
                            className="w-full"
                            variant={isCurrent ? 'outline' : 'default'}
                            disabled={isCurrent}
                          >
                            {isCurrent ? 'Current Plan' : 'Upgrade'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  To implement payments in your application, you&apos;ll need to configure Stripe.
                  Visit{' '}
                  <a
                    href="https://bolt.new/setup/stripe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    https://bolt.new/setup/stripe
                  </a>{' '}
                  for setup instructions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
