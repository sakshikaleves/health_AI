"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const BottomNavbar = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("records");

  // Set active tab based on current path
  useEffect(() => {
    const path = pathname.split("/")[1] || "home";
    if (navItems.some((item) => item.id === path)) {
      setActiveTab(path);
    }
  }, [pathname]);

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
      id: "scanner",
      icon: "/logo.png",
      label: "Scan",
      isSpecial: true,
    },
    {
      id: "ai",
      icon: "/navbar/ai.png",
      label: "AI",
    },
    {
      id: "notification",
      icon: "/navbar/notification.png",
      label: "Notify",
    },
  ];

  // Don't show the navbar on certain pages
  if (
    pathname === "/login" ||
    pathname === "/welcome" ||
    pathname === "/" ||
    pathname === "/otp"
  )
    return null;

  return (
    <div className="fixed bottom-2 left-0 right-0 px-3 z-50 max-w-lg mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex justify-around bg-white rounded-full shadow-lg items-center relative"
        style={{ boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}
      >
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={`/${item.id}`}
            className={`
              flex flex-col items-center justify-center py-1.5 px-3 relative
              ${item.isSpecial ? "mx-1" : ""}
            `}
            onClick={() => setActiveTab(item.id)}
          >
            {item.isSpecial ? (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
                <span className="text-[10px] font-medium mt-0.5 text-teal-600">
                  {item.label}
                </span>
              </motion.div>
            ) : (
              <>
                <div
                  className={`
                    relative p-1 flex items-center justify-center
                    ${activeTab === item.id ? "text-teal-500" : "text-gray-400"}
                  `}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={22}
                    height={22}
                    className="transition-all duration-200"
                    style={{
                      opacity: activeTab === item.id ? 1 : 0.7,
                      transform:
                        activeTab === item.id ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                </div>
                <span
                  className={`
                    text-[10px] font-medium transition-colors duration-200
                    ${activeTab === item.id ? "text-teal-500" : "text-gray-500"}
                  `}
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-[4px] h-[4px] bg-teal-500 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default BottomNavbar;
