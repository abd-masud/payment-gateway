"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAccUserRedirect } from "@/hooks/useAccUser";
import { Breadcrumb } from "./Breadcrumb";
import { PersonToPersonTable } from "./PersonToPersonTable";

export const PersonToPersonComponent = () => {
  const { user } = useAuth();
  useAccUserRedirect();
  if (!user) return null;
  return (
    <main className="bg-[#F2F4F7] min-h-screen p-5">
      <Breadcrumb />
      <PersonToPersonTable />
    </main>
  );
};
