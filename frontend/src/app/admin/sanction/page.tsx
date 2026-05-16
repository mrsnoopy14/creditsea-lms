"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, FileCheck2, Check, X } from "lucide-react";

export default function SanctionPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // State for rejecting
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get("/admin/sanction/loans");
      setLoans(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !reason) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setActionLoading(id);
    try {
      await api.patch(`/admin/sanction/loans/${id}`, {
        status,
        rejectionReason: status === "REJECTED" ? reason : undefined,
      });
      toast.success(`Loan ${status.toLowerCase()} successfully`);
      setRejectId(null);
      setReason("");
      fetchLoans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sanction Module</h1>
        <p className="text-slate-500 mt-2">Review and approve or reject pending loan applications.</p>
      </div>

      {loans.length === 0 ? (
        <Card className="border-dashed bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-slate-500">
            <FileCheck2 className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium">No pending applications.</p>
            <p className="text-sm">You are all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {loans.map((loan) => (
            <Card key={loan._id} className="overflow-hidden border-l-4 border-l-yellow-400">
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Loan #{loan._id.slice(-6).toUpperCase()}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Applicant: {loan.userId?.email}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    {loan.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Amount</p>
                    <p className="font-bold text-xl mt-1">₹{loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Tenure</p>
                    <p className="font-bold text-xl mt-1">{loan.tenure} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Interest Rate</p>
                    <p className="font-bold text-xl mt-1">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total Repayment</p>
                    <p className="font-bold text-xl mt-1 text-primary">₹{Math.round(loan.totalRepayment).toLocaleString()}</p>
                  </div>
                </div>
                
                {rejectId === loan._id && (
                  <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100 animate-in fade-in">
                    <p className="text-sm font-medium text-red-800 mb-2">Rejection Reason</p>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Why is this rejected?" 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)}
                        className="bg-white border-red-200 focus-visible:ring-red-500"
                      />
                      <Button variant="destructive" onClick={() => handleAction(loan._id, "REJECTED")} disabled={actionLoading === loan._id}>
                        {actionLoading === loan._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Reject"}
                      </Button>
                      <Button variant="ghost" onClick={() => setRejectId(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
              {rejectId !== loan._id && (
                <CardFooter className="bg-slate-50 border-t flex justify-end gap-3 p-4">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setRejectId(loan._id)}>
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction(loan._id, "APPROVED")} disabled={actionLoading === loan._id}>
                    {actionLoading === loan._id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    Approve
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
