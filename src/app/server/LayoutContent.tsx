"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SideBar } from "@/components/SideBar/SideBar";
import { Header } from "@/components/Header/Header";

const HIDDEN_PAGES = [
  "/",
  "/terms-and-conditions",
  "/privacy-policy",
  "/auth/login",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/new-password",
] as const;

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);
  const closeSidebar = () => isSidebarVisible && setSidebarVisible(false);

  const isHiddenPage = HIDDEN_PAGES.includes(
    pathname as (typeof HIDDEN_PAGES)[number]
  );

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (isSidebarVisible && isMobile) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isSidebarVisible, isMobile]);

  return (
    <>
      {!isHiddenPage && (
        <>
          <div
            className={`fixed w-[250px] z-50 transition-transform duration-300 ${
              isSidebarVisible ? "translate-x-0" : "-translate-x-full"
            }`}
            aria-hidden={!isSidebarVisible}
          >
            <SideBar closeSidebar={closeSidebar} />
          </div>
          {isSidebarVisible && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition duration-300"
              onClick={closeSidebar}
              role="presentation"
            />
          )}
        </>
      )}
      <main
        className={`flex-1 transition-all duration-300 ${
          !isHiddenPage && isSidebarVisible ? "md:ml-[250px] ml-0" : "ml-0"
        }`}
      >
        {!isHiddenPage && (
          <div className="sticky top-0 z-20 bg-white">
            <Header toggleSidebar={toggleSidebar} />
          </div>
        )}
        {children}
      </main>
    </>
  );
}
