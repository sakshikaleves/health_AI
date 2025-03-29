"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, FileText, Sparkles, Bell } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const BottomNavbar = () => {
  const [activeTab, setActiveTab] = useState("records");
  const pathname = usePathname();
  const navItems = [
    {
      id: "home",
      icon: "/navbar/home.png",
      label: "Home",
    },
    {
      id: "records",
      icon: "/navbar/records.png",
      label: "Records",
    },
    {
      id: "ai",
      icon: "/navbar/ai.png",
      label: "AI",
    },
    {
      id: "notification",
      icon: "/navbar/notification.png",
      label: "Notification",
    },
  // Don't show the navbar on the login and ai pages
  ];
  if (pathname === "/login" || pathname === "/otp") return null;
  return (
    <div className="fixed bottom-2 z- left-0 right-0  px-6 z-50">
      <div className="flex justify-around p-2 pl-4 bg-white pr-4 rounded-full shadow-2xl items-center">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={`/${item.id}`}
            className="flex flex-col items-center max-w-md justify-center"
            onClick={() => setActiveTab(item.id)}
          >
            <div
              className={`
              relative  p-1 w-full flex items-center justify-center rounded-full
              ${
                activeTab === item.id
                  ? " bg-[#f1fffd] text-teal-500"
                  : "text-gray-400"
              }
            `}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={26}
                height={26}
                className={`${
                  activeTab === item.id ? "text-teal-500" : "text-gray-400"
                }`}
              />
            </div>
            <span
              className={`
              text-sm  font-semibold
              ${activeTab === item.id ? "text-teal-500" : ""}
            `}
            >
              {item.label}
            </span>
            {activeTab === item.id && (
              <div className="absolute bottom-0 w-[54px] h-[4px] bg-teal-500 rounded-full"></div>
            )}
          </Link>
        ))}

        <div className="absolute left-1/2 -top-[28px] -translate-x-1/2 bg-black w-[58px] h-[58px] rounded-full flex items-center justify-center shadow-lg">
          <Link href={"/scanner"}>
            <Image
              src="/logo.png"
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
