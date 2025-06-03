"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo_white.webp";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AiFillCaretDown, AiFillCaretRight } from "react-icons/ai";
import { useAuth } from "@/contexts/AuthContext";
import { useAccUserRedirect } from "@/hooks/useAccUser";
import { ROLE_SIDEBAR_ITEMS } from "./SideBarRole";

interface SideBarProps {
  closeSidebar?: () => void;
}

export const SideBar = ({ closeSidebar }: SideBarProps) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  useAccUserRedirect();

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && closeSidebar) {
      closeSidebar();
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const linkClass = (route: string) =>
    `text-[13px] text-[#797c8b] hover:text-white font-[500] flex items-center transition duration-300 group h-11 border-t border-[#252D37] ${
      pathname.includes(route) ? "text-white bg-[#1E2639]" : ""
    }`;

  const subLinkClass = (route: string) =>
    `text-[13px] text-[#797c8b] hover:text-white font-[500] flex items-center transition duration-300 group h-11 ${
      pathname === route ? "text-white" : ""
    }`;

  const linkBar = (route: string) =>
    `bg-[#307DF1] h-[23px] w-[3px] group-hover:opacity-100 opacity-0 transition duration-300 ${
      pathname.includes(route) ? "opacity-100" : ""
    }`;

  if (!user) return null;

  const userRole = user.role.toLowerCase() as keyof typeof ROLE_SIDEBAR_ITEMS;
  const sidebarItems = ROLE_SIDEBAR_ITEMS[userRole] || ROLE_SIDEBAR_ITEMS.admin;

  return (
    <main className="bg-[#131226] h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
      <Link
        className="text-white font-bold flex items-center text-[30px] px-8 py-[19.5px]"
        href={"/dashboard"}
        onClick={handleLinkClick}
      >
        <Image height={30} src={logo} alt={"Logo"} priority />
        <span className="text-white text-[18px] font-bold ml-2">
          Payment Gateway
        </span>
      </Link>

      {sidebarItems.map((item) => {
        if (item.single) {
          return (
            <Link
              key={item.path}
              href={`/${item.path}`}
              className={linkClass(`/${item.path}`)}
              onClick={handleLinkClick}
            >
              <div className={linkBar(`/${item.path}`)}></div>
              {item.icon}
              {item.label}
            </Link>
          );
        } else if (item.items) {
          const isOpen = openSections[item.label] || false;
          const isActive = item.items.some((subItem) =>
            pathname.includes(subItem.path)
          );

          return (
            <div key={item.label}>
              <button
                onClick={() => toggleSection(item.label)}
                className={`text-[13px] text-[#797c8b] hover:text-white font-[500] flex items-center justify-between pr-5 transition duration-300 group h-11 w-full border-t border-[#252D37] ${
                  isActive ? "text-white bg-[#1E2639]" : ""
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`h-[23px] w-[3px] group-hover:bg-[#307DF1] transition duration-300 ${
                      isActive ? "bg-[#307DF1]" : "bg-transparent"
                    }`}
                  ></div>
                  {item.icon}
                  {item.label}
                </div>
                {isOpen ? (
                  <AiFillCaretDown className="text-xs" />
                ) : (
                  <AiFillCaretRight className="text-xs" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pl-[56px] bg-[#1D1B31] text-[13px]">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.path}
                      className={subLinkClass(`/${subItem.path}`)}
                      href={`/${subItem.path}`}
                      onClick={handleLinkClick}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </main>
  );
};
