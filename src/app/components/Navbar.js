"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { profiles } from "@/data/Users";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, changeUser } = useUser();
  const pathname = usePathname();

  const handleProfileClick = (profile) => {
    changeUser(profile);
    setIsOpen(false);
  };

  if (pathname === "/login" || pathname === "/otp") return null;

  return (
    <div className="relative w-screen mx-auto">
      <div className="flex justify-center items-center bg-gradient-to-r from-teal-800 to-teal-600 p-4 shadow-lg">
        <div
          className="flex items-center gap-3 bg-white/95 px-3 py-2 rounded-full shadow-md cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Avatar className="w-8 h-8 ring-2 ring-teal-500/30 ring-offset-1">
            <AvatarImage src={currentUser.image} alt="Profile" />
          </Avatar>
          <span className="text-gray-800 font-medium">{currentUser.name}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        <div className="absolute right-4 flex items-center gap-2 bg-gray-800/90 text-white px-2.5 py-1.5 rounded-full shadow-md backdrop-blur-sm border border-gray-700/30">
          <span className="text-yellow-300 font-semibold">36</span>
          <div className="w-4 h-4 text-yellow-300 flex items-center justify-center">
            🪙
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-2 border border-gray-200/80 ml-2 mr-2 w-[calc(100%-1rem)] bg-white shadow-xl rounded-xl p-4 z-10 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-3 text-gray-800">
            Select Profile
          </h3>
          <div className="space-y-2.5">
            {profiles.map((profile, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                  currentUser.id === profile.id && "bg-teal-50 border-teal-200"
                )}
                onClick={() => handleProfileClick(profile)}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    className={cn(
                      "w-10 h-10 ring-2",
                      currentUser.id === profile.id
                        ? "ring-teal-500"
                        : "ring-gray-200"
                    )}
                  >
                    <AvatarImage src={profile.image} alt={profile.name} />
                  </Avatar>
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        currentUser.id === profile.id
                          ? "text-teal-700"
                          : "text-gray-800"
                      )}
                    >
                      {profile.name}
                    </p>
                    <p className="text-sm text-gray-500">{profile.status}</p>
                  </div>
                </div>
                <Settings className="w-5 h-5 text-gray-500 hover:text-teal-600 transition-colors" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 text-teal-700 font-medium border-t border-gray-100 pt-3 hover:text-teal-800 transition-colors">
            Add new account
          </button>
        </div>
      )}
    </div>
  );
}
