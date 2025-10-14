import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: memberships } = await supabaseClient
      .from('memberships')
      .select('org_id')
      .eq('user_id', user.id)
      .limit(1);

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 });
    }

    const orgId = memberships[0].org_id;

    const { data: properties, error: propertiesError } = await supabaseClient
      .from('properties')
      .select('*')
      .eq('org_id', orgId);

    if (propertiesError) throw propertiesError;

    const insights: Array<{
      org_id: string;
      property_id: string | null;
      type: string;
      message: string;
      severity: 'INFO' | 'WARNING' | 'CRITICAL';
    }> = [];

    for (const property of properties || []) {
      try {
        const predictResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/predict-rent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            region: property.region,
            property_type: property.type,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            size_m2: property.size_m2,
            amenities: property.amenities || [],
          }),
        });

        if (predictResponse.ok) {
          const { predicted_rent, market_avg } = await predictResponse.json();
          const priceDiff = ((property.current_rent - predicted_rent) / predicted_rent) * 100;

          if (priceDiff < -10) {
            insights.push({
              org_id: orgId,
              property_id: property.id,
              type: 'pricing',
              message: `${property.address} is underpriced by ${Math.abs(priceDiff).toFixed(1)}%. Market suggests R${(predicted_rent / 100).toLocaleString()}/month vs your R${(property.current_rent / 100).toLocaleString()}.`,
              severity: 'WARNING',
            });
          } else if (priceDiff > 15) {
            insights.push({
              org_id: orgId,
              property_id: property.id,
              type: 'pricing',
              message: `${property.address} may be overpriced by ${priceDiff.toFixed(1)}%. Market average is R${(market_avg / 100).toLocaleString()}/month.`,
              severity: 'INFO',
            });
          }
        }
      } catch (error) {
        console.error('Error analyzing property:', property.id, error);
      }

      const netIncome = property.current_rent - property.expenses;
      const roi = property.expenses > 0 ? (netIncome / property.expenses) * 100 : 0;

      if (roi < 10) {
        insights.push({
          org_id: orgId,
          property_id: property.id,
          type: 'cashflow',
          message: `${property.address} has low ROI of ${roi.toFixed(1)}%. Consider reducing expenses or increasing rent.`,
          severity: roi < 0 ? 'CRITICAL' : 'WARNING',
        });
      }

      if (!property.tenant_id) {
        insights.push({
          org_id: orgId,
          property_id: property.id,
          type: 'occupancy',
          message: `${property.address} is currently vacant. Potential monthly loss: R${(property.current_rent / 100).toLocaleString()}.`,
          severity: 'WARNING',
        });
      }
    }

    await supabaseClient.from('insights').delete().eq('org_id', orgId);

    if (insights.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('insights')
        .insert(insights);

      if (insertError) throw insertError;
    }

    return NextResponse.json({
      success: true,
      insights_generated: insights.length,
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
