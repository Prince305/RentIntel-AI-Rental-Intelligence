'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrg } from '@/lib/org-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, RefreshCw, TrendingUp, DollarSign, Home, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type Insight = {
  id: string;
  org_id: string;
  property_id: string | null;
  type: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  created_at: string;
};

export default function InsightsPage() {
  const { organization } = useOrg();
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadInsights = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('org_id', organization.id)
        .order('severity', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [organization]);

  const generateInsights = async () => {
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const result = await response.json();
      toast.success(`Generated ${result.insights_generated} insights`);
      loadInsights();
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate insights');
    } finally {
      setGenerating(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INFO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pricing':
        return <DollarSign className="h-5 w-5" />;
      case 'cashflow':
        return <TrendingUp className="h-5 w-5" />;
      case 'occupancy':
        return <Home className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA5]"></div>
      </div>
    );
  }

  const criticalCount = insights.filter((i) => i.severity === 'CRITICAL').length;
  const warningCount = insights.filter((i) => i.severity === 'WARNING').length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
          <p className="text-gray-600 mt-1">AI-powered recommendations for your portfolio</p>
        </div>
        <Button
          onClick={generateInsights}
          disabled={generating}
          className="bg-[#00BFA5] hover:bg-[#00A891]"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Refresh Insights'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{insights.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
          </CardContent>
        </Card>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No insights yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Generate AI-powered insights for your properties
            </p>
            <Button
              onClick={generateInsights}
              disabled={generating}
              className="bg-[#00BFA5] hover:bg-[#00A891]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className={`border-2 ${getSeverityColor(insight.severity)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getSeverityColor(insight.severity)}`}>
                    {getTypeIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {insight.type}
                      </Badge>
                      <Badge className={getSeverityColor(insight.severity)}>
                        {insight.severity}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-auto">
                        {format(new Date(insight.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-900">{insight.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
