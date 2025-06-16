"use client";

import { AdminDashboardComponent } from "@/components/AdminDashboard/AdminDashboard";
import { VendorDashboardComponent } from "@/components/VendorDashboard/VendorDashboard";
import { MerchantDashboardComponent } from "@/components/MerchantDashboard/MerchantDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  switch (user?.role?.trim()) {
    case "admin":
      return <AdminDashboardComponent />;
    case "vendor":
      return <VendorDashboardComponent />;
    case "merchant":
      return <MerchantDashboardComponent />;
    default:
      return <div>Unauthorized</div>;
  }
}
