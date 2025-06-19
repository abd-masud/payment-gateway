"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAccUserRedirect } from "@/hooks/useAccUser";
import { Breadcrumb } from "./Breadcrumb";
import { VendorsListTable } from "./VendorsListTable";
import { useCallback, useEffect, useState } from "react";
import { UserApiResponse, Users } from "@/types/users";

export const VendorsListComponent = () => {
  const { user } = useAuth();
  const [vendorsData, setVendorsData] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useAccUserRedirect();

  const fetchVendors = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json: UserApiResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch vendors");
      }

      setVendorsData(json.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);
  return (
    <main className="bg-[#F2F4F7] min-h-screen p-5">
      <Breadcrumb />
      <VendorsListTable
        users={vendorsData}
        fetchUsers={fetchVendors}
        loading={loading}
      />
    </main>
  );
};
