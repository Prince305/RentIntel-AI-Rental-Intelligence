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

type Property = {
  id: string;
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
};

type PropertyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  onSuccess: () => void;
};

const REGIONS = ['Johannesburg', 'Cape Town', 'Durban', 'Rosebank'];
const PROPERTY_TYPES = ['apartment', 'house', 'townhouse'];
const COMMON_AMENITIES = ['Parking', 'Pool', 'Garden', 'Security', 'Gym', 'Pet-friendly', 'Furnished'];

export function PropertyDialog({ open, onOpenChange, property, onSuccess }: PropertyDialogProps) {
  const { organization } = useOrg();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    region: 'Johannesburg',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    size_m2: 80,
    amenities: [] as string[],
    current_rent: 0,
    target_rent: 0,
    expenses: 0,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address,
        region: property.region,
        type: property.type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        size_m2: property.size_m2,
        amenities: property.amenities || [],
        current_rent: property.current_rent / 100,
        target_rent: property.target_rent / 100,
        expenses: property.expenses / 100,
      });
    } else {
      setFormData({
        address: '',
        region: 'Johannesburg',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        size_m2: 80,
        amenities: [],
        current_rent: 0,
        target_rent: 0,
        expenses: 0,
      });
    }
  }, [property, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    setLoading(true);

    try {
      const data = {
        org_id: organization.id,
        address: formData.address,
        region: formData.region,
        type: formData.type,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        size_m2: formData.size_m2,
        amenities: formData.amenities,
        current_rent: Math.round(formData.current_rent * 100),
        target_rent: Math.round(formData.target_rent * 100),
        expenses: Math.round(formData.expenses * 100),
      };

      if (property) {
        const { error } = await supabase
          .from('properties')
          .update(data)
          .eq('id', property.id);

        if (error) throw error;
        toast.success('Property updated successfully');
      } else {
        const { error } = await supabase.from('properties').insert(data);

        if (error) throw error;
        toast.success('Property added successfully');
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property ? 'Edit Property' : 'Add Property'}</DialogTitle>
          <DialogDescription>
            {property ? 'Update property details below' : 'Enter the details of your rental property'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Property Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="size_m2">Size (m²)</Label>
              <Input
                id="size_m2"
                type="number"
                min="0"
                value={formData.size_m2}
                onChange={(e) => setFormData({ ...formData, size_m2: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_AMENITIES.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      formData.amenities.includes(amenity)
                        ? 'bg-[#00BFA5] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_rent">Current Rent (R)</Label>
              <Input
                id="current_rent"
                type="number"
                min="0"
                step="0.01"
                value={formData.current_rent}
                onChange={(e) => setFormData({ ...formData, current_rent: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_rent">Target Rent (R)</Label>
              <Input
                id="target_rent"
                type="number"
                min="0"
                step="0.01"
                value={formData.target_rent}
                onChange={(e) => setFormData({ ...formData, target_rent: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="expenses">Monthly Expenses (R)</Label>
              <Input
                id="expenses"
                type="number"
                min="0"
                step="0.01"
                value={formData.expenses}
                onChange={(e) => setFormData({ ...formData, expenses: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#00BFA5] hover:bg-[#00A891]" disabled={loading}>
              {loading ? 'Saving...' : property ? 'Update' : 'Add Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
