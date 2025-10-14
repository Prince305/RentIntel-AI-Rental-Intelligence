import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { region, property_type, bedrooms, bathrooms, size_m2, amenities = [] } = body;

    if (!region || !property_type || bedrooms === undefined || bathrooms === undefined || !size_m2) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: marketData, error } = await supabase
      .from('market_data')
      .select('*')
      .eq('region', region)
      .eq('property_type', property_type)
      .maybeSingle();

    if (error) {
      console.error('Error fetching market data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch market data' },
        { status: 500 }
      );
    }

    if (!marketData) {
      return NextResponse.json(
        { error: 'No market data available for this region and property type' },
        { status: 404 }
      );
    }

    let predictedRent = marketData.avg_rent;

    const bedroomAdjustment = (bedrooms - 2) * 0.15;
    predictedRent *= (1 + bedroomAdjustment);

    const bathroomAdjustment = (bathrooms - 1) * 0.08;
    predictedRent *= (1 + bathroomAdjustment);

    const avgSize = property_type === 'apartment' ? 80 : property_type === 'house' ? 150 : 120;
    const sizeAdjustment = ((size_m2 - avgSize) / avgSize) * 0.5;
    predictedRent *= (1 + sizeAdjustment);

    const amenityBonus = amenities.length * 0.03;
    predictedRent *= (1 + amenityBonus);

    const confidence = Math.max(0.5, 1 - marketData.vacancy_rate / 10);

    return NextResponse.json({
      predicted_rent: Math.round(predictedRent),
      confidence: parseFloat(confidence.toFixed(2)),
      market_avg: marketData.avg_rent,
      vacancy_rate: marketData.vacancy_rate,
    });
  } catch (error) {
    console.error('Error predicting rent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
