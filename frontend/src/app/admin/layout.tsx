"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, FileCheck, Landmark, ReceiptIndianRupee } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token || !userRole || userRole === "Borrower") {
      router.push("/login");
    } else {
      setRole(userRole);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (!mounted || !role) return null;

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["Admin", "Sales", "Sanction", "Disbursement", "Collection"] },
    { href: "/admin/sales", label: "Sales (Leads)", icon: <Users className="w-5 h-5" />, roles: ["Admin", "Sales"] },
    { href: "/admin/sanction", label: "Sanction", icon: <FileCheck className="w-5 h-5" />, roles: ["Admin", "Sanction"] },
    { href: "/admin/disbursement", label: "Disbursement", icon: <Landmark className="w-5 h-5" />, roles: ["Admin", "Disbursement"] },
    { href: "/admin/collection", label: "Collection", icon: <ReceiptIndianRupee className="w-5 h-5" />, roles: ["Admin", "Collection"] },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mr-2">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Ops Panel</span>
        </div>
        
        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Logged in as</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="font-medium text-slate-200">{role}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.filter(l => l.roles.includes(role)).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                pathname === link.href ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.icon}
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
