"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Landmark, ArrowRightCircle } from "lucide-react";

export default function DisbursementPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get("/admin/disbursement/loans");
      setLoans(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (id: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/disbursement/loans/${id}`);
      toast.success("Funds disbursed successfully");
      fetchLoans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Disbursement failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Disbursement Module</h1>
        <p className="text-slate-500 mt-2">Release funds for approved loan applications.</p>
      </div>

      {loans.length === 0 ? (
        <Card className="border-dashed bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Landmark className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium">No pending disbursements.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {loans.map((loan) => (
            <Card key={loan._id} className="overflow-hidden border-l-4 border-l-blue-500">
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Loan #{loan._id.slice(-6).toUpperCase()}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Applicant: {loan.userId?.email}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    READY FOR DISBURSAL
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-2 gap-8 flex-1">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Approved Amount to Transfer</p>
                      <p className="font-bold text-3xl text-slate-900">₹{loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Bank Account</p>
                      <p className="font-semibold text-lg">HDFC Bank (**** 1234)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-blue-50/50 border-t flex justify-end p-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md" onClick={() => handleDisburse(loan._id)} disabled={actionLoading === loan._id}>
                  {actionLoading === loan._id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRightCircle className="w-4 h-4 mr-2" />}
                  Release Funds Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
