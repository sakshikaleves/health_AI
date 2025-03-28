"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, FileText, Sparkles, Bell } from "lucide-react";
import Image from "next/image";

const BottomNavbar = () => {
  const [activeTab, setActiveTab] = useState("records");

  const navItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
    },
    {
      id: "records",
      icon: FileText,
      label: "Records",
    },
    {
      id: "ai",
      icon: Sparkles,
      label: "AI",
    },
    {
      id: "notification",
      icon: Bell,
      label: "Notification",
    },
  ];

  return (
    <div className="fixed bottom-2 left-0 right-0  px-7 z-50">
      <div className="flex justify-between p-3 pl-4 pr-4 rounded-full shadow-2xl items-center">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={`/${item.id}`}
            className="flex flex-col items-center justify-center"
            onClick={() => setActiveTab(item.id)}
          >
            <div
              className={`
              relative  p-1
              ${activeTab === item.id ? "text-teal-500" : "text-gray-400"}
            `}
            >
              <item.icon
                className={`w-8 h-8 ${
                  activeTab === item.id ? "text-teal-500" : "text-gray-400"
                }`}
              />
            </div>
            <span
              className={`
              text-[10px] mt-1 
              ${activeTab === item.id ? "text-teal-500" : "text-gray-400"}
            `}
            >
              {item.label}
            </span>
            {activeTab === item.id && (
              <div className="absolute bottom-0 w-[54px] h-[4px] bg-teal-500 rounded-full"></div>
            )}
          </Link>
        ))}

        <div className="absolute left-1/2 -top-[22px] -translate-x-1/2 bg-black w-[58px] h-[58px] rounded-full flex items-center justify-center shadow-lg">
           <Image
            src="/logo.png"
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full"
            />
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
