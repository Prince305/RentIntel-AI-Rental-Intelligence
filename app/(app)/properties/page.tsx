'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Home, Bed, Bath, Square } from 'lucide-react';
import { PropertyDialog } from '@/components/property-dialog';
import { toast } from 'sonner';

type Property = {
  id: string;
  org_id: string;
  address: string;
  region: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size_m2: number;
  amenities: string[];
  current_rent: number;
  target_rent: number;
  expenses: number;
  tenant_id: string | null;
  created_at: string;
  updated_at: string;
};

export default function PropertiesPage() {
  const { organization, canWrite } = useOrg();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const loadProperties = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('org_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [organization]);

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProperty(null);
    loadProperties();
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
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your rental property portfolio</p>
        </div>
        {canWrite() && (
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-[#00BFA5] hover:bg-[#00A891]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        )}
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Get started by adding your first rental property
            </p>
            {canWrite() && (
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-[#00BFA5] hover:bg-[#00A891]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleEdit(property)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{property.address}</CardTitle>
                    <CardDescription className="mt-1">
                      {property.region} • {property.type}
                    </CardDescription>
                  </div>
                  {property.tenant_id ? (
                    <Badge className="bg-green-100 text-green-800">Occupied</Badge>
                  ) : (
                    <Badge variant="outline">Vacant</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {property.bedrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {property.bathrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    {property.size_m2}m²
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Rent</span>
                    <span className="text-lg font-bold text-[#00BFA5]">
                      R{(property.current_rent / 100).toLocaleString()}
                    </span>
                  </div>
                  {property.target_rent !== property.current_rent && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">Target Rent</span>
                      <span className="text-sm text-gray-700">
                        R{(property.target_rent / 100).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PropertyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        property={editingProperty}
        onSuccess={handleDialogClose}
      />
    </div>
  );
}
