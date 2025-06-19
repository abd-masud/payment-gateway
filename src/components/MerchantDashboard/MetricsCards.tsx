"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { FiFileText, FiTrendingUp, FiUsers, FiPackage } from "react-icons/fi";

export const MetricsCards = () => {
  const { user } = useAuth();

  const calculateMetrics = () => {
    return [
      {
        title: "Total Revenue",
        value: `50,000 BDT`,
        change: <span className="text-green-600">On Target</span>,
        icon: <FiTrendingUp className="text-green-500" size={24} />,
        link: "/invoices/closed-invoices-list",
      },
      {
        title: "Receivables",
        value: `50 BDT`,
        change: <span className="text-red-600">Action Needed</span>,
        icon: <FiFileText className="text-yellow-500" size={24} />,
        link: "/invoices/open-invoices-list",
      },
      {
        title: "Total Users",
        value: `2 Members`,
        change: <span className="text-green-600">Active</span>,
        icon: <FiUsers className="text-purple-500" size={24} />,
        link: "/customers/customers-list",
      },
      {
        title: "Whitelist Request",
        value: `2 In Queue`,
        change: <span className="text-green-600">In Stock</span>,
        icon: <FiPackage className="text-blue-500" size={24} />,
        link: "/products/products-list",
      },
    ];
  };

  const metrics = calculateMetrics();

  const isAdmin = user?.role == "admin";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {metrics.map((metric, index) => {
        const cardContent = (
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                {metric.title}
              </p>
              <p className="text-2xl font-bold mt-2 text-gray-800">
                {metric.value}
              </p>
              <p className="text-sm mt-1">{metric.change}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 border">
              {metric.icon}
            </div>
          </div>
        );

        return isAdmin ? (
          <Link
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border hover:border-blue-400 transition duration-300"
            href={metric.link}
          >
            {cardContent}
          </Link>
        ) : (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
            {cardContent}
          </div>
        );
      })}
    </div>
  );
};
