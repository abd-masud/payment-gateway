"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAccUserRedirect } from "@/hooks/useAccUser";
import { Company } from "./Company";
import { MetricsCards } from "./MetricsCards";
import { QuickActions } from "./QuickActions";
import { Overviews } from "./Overviews";

export const AdminDashboardComponent = () => {
  const { user } = useAuth();

  useAccUserRedirect();
  if (!user) return null;

  return (
    <main className="bg-gray-50 min-h-screen p-6">
      <Company />
      <MetricsCards />
      <QuickActions />
      {/* <Overviews /> */}
    </main>
  );
};
