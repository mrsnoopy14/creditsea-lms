"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2, FileUp, IndianRupee, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function BorrowerDashboard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<any[]>([]);

  // Step 1 State
  const [fullName, setFullName] = useState("");
  const [pan, setPan] = useState("");
  const [dob, setDob] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [employmentMode, setEmploymentMode] = useState("Salaried");

  // Step 2 State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  // Step 3 State
  const [amount, setAmount] = useState([100000]);
  const [tenure, setTenure] = useState([180]); // days

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/borrower/loan");
      setLoans(res.data);
      if (res.data.length > 0) {
        setStep(4); // Show status page if already applied
      } else {
        setStep(1);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/borrower/profile", {
        fullName,
        pan,
        dob,
        monthlySalary: Number(monthlySalary),
        employmentMode,
      });
      toast.success("Profile saved successfully");
      setStep(2);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: string) => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || "Failed to save profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("salarySlip", file);
      await api.post("/borrower/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Salary slip uploaded successfully");
      setStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const applyLoan = async () => {
    setLoading(true);
    try {
      await api.post("/borrower/loan", {
        amount: amount[0],
        tenure: tenure[0],
      });
      toast.success("Loan application submitted!");
      fetchLoans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to apply for loan");
    } finally {
      setLoading(false);
    }
  };

  // Calculations for Step 3
  const interestRate = 12; // 12% p.a.
  const simpleInterest = (amount[0] * interestRate * tenure[0]) / (365 * 100);
  const totalRepayment = amount[0] + simpleInterest;

  if (loading && step === 1 && loans.length === 0 && !fullName) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Active Loans View (Step 4)
  if (step === 4) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Applications</h1>
        {loans.map((loan) => (
          <Card key={loan._id} className="shadow-sm">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Loan #{loan._id.slice(-6).toUpperCase()}</CardTitle>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold 
                  ${loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${loan.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' : ''}
                  ${loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                  ${loan.status === 'DISBURSED' ? 'bg-green-100 text-green-800' : ''}
                  ${loan.status === 'CLOSED' ? 'bg-slate-100 text-slate-800' : ''}
                `}>
                  {loan.status}
                </div>
              </div>
              <CardDescription>Applied on {new Date(loan.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="font-semibold text-lg">₹{loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tenure</p>
                  <p className="font-semibold text-lg">{loan.tenure} days</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Repayment</p>
                  <p className="font-semibold text-lg">₹{Math.round(loan.totalRepayment).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Interest Rate</p>
                  <p className="font-semibold text-lg">{loan.interestRate}% p.a.</p>
                </div>
              </div>
              {loan.rejectionReason && (
                <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-md text-sm border border-red-100">
                  <span className="font-semibold">Reason for rejection:</span> {loan.rejectionReason}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Apply for a Loan</h1>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          
          {[
            { num: 1, label: "Personal Info" },
            { num: 2, label: "Upload Doc" },
            { num: 3, label: "Loan Config" }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= s.num ? "bg-primary text-white shadow-md" : "bg-white text-slate-400 border-2 border-slate-200"}`}>
                {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.num}
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= s.num ? "text-primary" : "text-slate-400"}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <Card className="shadow-lg border-t-4 border-t-primary animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Tell us about yourself to check your eligibility.</CardDescription>
          </CardHeader>
          <form onSubmit={submitProfile}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input id="pan" placeholder="ABCDE1234F" required value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlySalary">Monthly Salary (₹)</Label>
                  <Input id="monthlySalary" type="number" required value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="employment">Employment Mode</Label>
                  <Select value={employmentMode} onValueChange={setEmploymentMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salaried">Salaried</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end bg-slate-50 border-t p-4 rounded-b-xl">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save & Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Step 2: Upload Salary Slip */}
      {step === 2 && (
        <Card className="shadow-lg border-t-4 border-t-primary animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle>Upload Salary Slip</CardTitle>
            <CardDescription>Please provide your latest salary slip (PDF, JPG, PNG). Max 5MB.</CardDescription>
          </CardHeader>
          <form onSubmit={submitUpload}>
            <CardContent>
              <div 
                className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-1">Click to browse or drag and drop</h3>
                <p className="text-sm text-slate-500 mb-4">Supported formats: PDF, JPEG, PNG</p>
                
                {file && (
                  <div className="bg-primary/10 text-primary p-3 rounded-md inline-flex items-center text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-slate-50 border-t p-4 rounded-b-xl">
              <Button variant="outline" type="button" onClick={() => setStep(1)} disabled={loading}>Back</Button>
              <Button type="submit" disabled={loading || !file}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Upload & Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Step 3: Loan Config */}
      {step === 3 && (
        <Card className="shadow-lg border-t-4 border-t-primary animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle>Configure Your Loan</CardTitle>
            <CardDescription>Select the amount and tenure that works best for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Loan Amount</Label>
                <span className="text-2xl font-bold text-primary flex items-center">
                  <IndianRupee className="w-5 h-5 mr-1" />
                  {amount[0].toLocaleString()}
                </span>
              </div>
              <Slider
                value={amount}
                onValueChange={setAmount}
                min={50000}
                max={500000}
                step={10000}
                className="w-full py-4"
              />
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>₹50,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Tenure (Days)</Label>
                <span className="text-2xl font-bold text-primary">{tenure[0]} Days</span>
              </div>
              <Slider
                value={tenure}
                onValueChange={setTenure}
                min={30}
                max={365}
                step={5}
                className="w-full py-4"
              />
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>30 Days</span>
                <span>365 Days</span>
              </div>
            </div>

            <div className="bg-slate-100 rounded-xl p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4">Repayment Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Principal Amount</span>
                  <span className="font-medium">₹{amount[0].toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Interest (12% p.a.)</span>
                  <span className="font-medium text-red-600">+ ₹{Math.round(simpleInterest).toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-lg">
                  <span className="text-slate-900">Total Repayment</span>
                  <span className="text-primary">₹{Math.round(totalRepayment).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-slate-50 border-t p-4 rounded-b-xl">
             <Button variant="outline" type="button" onClick={() => setStep(2)} disabled={loading}>Back</Button>
             <Button onClick={applyLoan} disabled={loading} size="lg" className="px-8">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Apply Now
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
