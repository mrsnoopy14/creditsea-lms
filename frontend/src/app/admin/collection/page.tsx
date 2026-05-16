"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ReceiptIndianRupee, Plus } from "lucide-react";

export default function CollectionPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.get("/admin/collection/loans");
      setLoans(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent, loanId: string) => {
    e.preventDefault();
    if (!utrNumber || !amount) {
      toast.error("Please fill all payment details");
      return;
    }

    setActionLoading(loanId);
    try {
      const res = await api.post(`/admin/collection/payments/${loanId}`, {
        utrNumber,
        amount: Number(amount)
      });
      
      if (res.data.loanStatus === "CLOSED") {
        toast.success("Payment recorded. Loan fully paid and CLOSED!");
      } else {
        toast.success(`Payment of ₹${amount} recorded successfully`);
      }
      
      setActivePaymentId(null);
      setUtrNumber("");
      setAmount("");
      fetchLoans(); // Refresh to update amounts and remove closed loans
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add payment");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Collection Module</h1>
        <p className="text-slate-500 mt-2">Manage active loans and record borrower payments.</p>
      </div>

      {loans.length === 0 ? (
        <Card className="border-dashed bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-slate-500">
            <ReceiptIndianRupee className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium">No active loans.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {loans.map((loan) => (
            <Card key={loan._id} className="overflow-hidden border-l-4 border-l-emerald-500 shadow-sm">
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Loan #{loan._id.slice(-6).toUpperCase()}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Applicant: {loan.userId?.email}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    ACTIVE
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="grid grid-cols-2 gap-6 flex-1">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Total Repayment Due</p>
                      <p className="font-bold text-2xl mt-1">₹{Math.round(loan.totalRepayment).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-96">
                    {activePaymentId === loan._id ? (
                      <form onSubmit={(e) => handleAddPayment(e, loan._id)} className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 animate-in fade-in">
                        <h4 className="font-semibold text-emerald-900 mb-3 text-sm">Record New Payment</h4>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-emerald-800">UTR Number (Unique)</Label>
                            <Input 
                              required 
                              value={utrNumber} 
                              onChange={(e) => setUtrNumber(e.target.value)} 
                              className="bg-white border-emerald-200 mt-1" 
                              placeholder="e.g. UTR123456789"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-emerald-800">Amount Paid (₹)</Label>
                            <Input 
                              type="number" 
                              required 
                              value={amount} 
                              onChange={(e) => setAmount(e.target.value)} 
                              className="bg-white border-emerald-200 mt-1" 
                              placeholder="10000"
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={actionLoading === loan._id}>
                              {actionLoading === loan._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Payment"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setActivePaymentId(null)}>Cancel</Button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <Button className="w-full h-full min-h-[100px] border-2 border-dashed bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 flex flex-col gap-2" variant="outline" onClick={() => setActivePaymentId(loan._id)}>
                        <Plus className="w-6 h-6" />
                        Record Payment
                      </Button>
                    )}
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
