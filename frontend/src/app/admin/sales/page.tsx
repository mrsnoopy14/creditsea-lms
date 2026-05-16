"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UserX } from "lucide-react";

export default function SalesPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/admin/sales/leads");
      setLeads(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales Module</h1>
        <p className="text-slate-500 mt-2">Track registered users who haven't applied for a loan yet.</p>
      </div>

      {leads.length === 0 ? (
        <Card className="border-dashed bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-slate-500">
            <UserX className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium">No leads currently available.</p>
            <p className="text-sm">All registered users have applied for a loan.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <Card key={lead._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold truncate" title={lead.email}>{lead.email}</CardTitle>
                <CardDescription>Registered User</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500">Joined: {new Date(lead.createdAt).toLocaleDateString()}</p>
                <div className="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Follow Up Needed
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
