"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { profiles } from "@/data/Users";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, changeUser } = useUser();

  const handleProfileClick = (profile) => {
    changeUser(profile);
    setIsOpen(false);
  };

  return (
    <div className="relative w-screen mx-auto">
      <div className="flex justify-center items-center bg-teal-700 p-4 shadow-md">
        <div
          className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser.image} alt="Profile" />
          </Avatar>
          <span className="text-gray-900 font-medium">{currentUser.name}</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
        <div className="absolute right-1 flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-full shadow-sm">
          <span className="text-yellow-400 text-sm font-medium">36</span>
          <div className="w-3 h-2 bg-yellow-400 rounded-full flex items-center justify-center shadow">
            🪙
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-2 border ml-2 mr-2 w-full bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Select Profile</h3>
          <div className="space-y-2">
            {profiles.map((profile, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => handleProfileClick(profile)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={profile.image} alt={profile.name} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.status}</p>
                  </div>
                </div>
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 text-teal-700 font-medium border-t pt-2">
            Add new account
          </button>
        </div>
      )}
    </div>
  );
}