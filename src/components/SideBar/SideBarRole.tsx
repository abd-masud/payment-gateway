import { AiFillDashboard } from "react-icons/ai";
import {
  FaUsers,
  FaShieldAlt,
  FaLifeRing,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaCreditCard,
} from "react-icons/fa";

export const ROLE_SIDEBAR_ITEMS = {
  admin: [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: <AiFillDashboard className="ml-[21px] text-[16px] mr-3 w-5" />,
      single: true,
    },
    {
      label: "Vendors",
      icon: <FaUsers className="ml-[21px] text-[16px] mr-3 w-5" />,
      items: [
        { path: "vendors/list", label: "Vendor List" },
        { path: "vendors/add", label: "Add Vendor" },
        { path: "vendors/approvals", label: "Pending Approvals" },
      ],
    },
    {
      label: "Merchants",
      icon: <FaUsers className="ml-[21px] text-[16px] mr-3 w-5" />,
      items: [
        { path: "merchants/list", label: "Merchant List" },
        { path: "merchants/kyc", label: "KYC Verification" },
      ],
    },
    {
      path: "ip-whitelist",
      label: "IP Whitelist",
      icon: <FaShieldAlt className="ml-[21px] text-[16px] mr-3 w-5" />,
      single: true,
    },
    {
      path: "support",
      label: "Support",
      icon: <FaLifeRing className="ml-[21px] text-[16px] mr-3 w-5" />,
      single: true,
    },
  ],
  vendor: [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: <AiFillDashboard className="ml-[21px] text-[16px] mr-3 w-5" />,
      single: true,
    },
    {
      label: "Balance",
      icon: <FaMoneyBillWave className="ml-[21px] text-[16px] mr-3 w-5" />,
      items: [
        { path: "balance/add", label: "Add Balance" },
        { path: "balance/history", label: "Balance History" },
      ],
    },
    {
      path: "transactions",
      label: "Transactions",
      icon: <FaExchangeAlt className="ml-[21px] text-[16px] mr-3 w-5" />,
      single: true,
    },
  ],
  merchant: [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: <AiFillDashboard className="ml-[21px] text-[16px] mr-3 w-5" />,
      single: true,
    },
    {
      label: "Account",
      icon: <FaCreditCard className="ml-[21px] text-[16px] mr-3 w-5" />,
      items: [
        { path: "account/details", label: "Account Details" },
        { path: "account/settings", label: "Account Settings" },
      ],
    },
    {
      label: "Funds",
      icon: <FaMoneyBillWave className="ml-[21px] text-[16px] mr-3 w-5" />,
      items: [
        { path: "funds/deposit", label: "Deposit" },
        { path: "funds/withdraw", label: "Withdraw" },
        { path: "funds/history", label: "Transaction History" },
      ],
    },
  ],
};
