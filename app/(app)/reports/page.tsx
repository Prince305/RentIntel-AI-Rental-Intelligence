'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrg } from '@/lib/org-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type Report = {
  id: string;
  org_id: string;
  month: string;
  url: string;
  created_at: string;
};

export default function ReportsPage() {
  const { organization } = useOrg();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('org_id', organization.id)
        .order('month', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [organization]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Monthly portfolio performance reports</p>
      </div>

      <Card className="bg-gradient-to-r from-[#001F3F]/5 to-[#00BFA5]/5 border-[#00BFA5]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#00BFA5] rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Reports</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive monthly reports are generated automatically and include portfolio summary,
                property performance, tenant overview, and AI-powered insights. Reports are delivered via
                email and stored for your records.
              </p>
              <p className="text-sm text-gray-500">
                Next report will be generated on the 1st of next month at 2:00 AM
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-600 text-center">
              Monthly reports will appear here once they are generated
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Report for {format(new Date(report.month + '-01'), 'MMMM yyyy')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Generated on {format(new Date(report.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
