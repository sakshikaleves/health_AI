"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Settings,
  LogOut,
  Menu,
  Bell,
  Home,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { profiles } from "@/data/Users";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { currentUser, changeUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleProfileClick = (profile) => {
    changeUser(profile);
    setIsOpen(false);
  };

  // Hide navbar on excluded pages
  if (
    pathname === "/login" ||
    pathname === "/welcome" ||
    pathname === "/" ||
    pathname === "/otp" ||
    pathname === "/scanner"
  )
    return null;

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (currentUser?.name) {
      return currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }

    // If API provides first_name and last_name properties
    if (currentUser?.first_name || currentUser?.last_name) {
      const firstInitial = currentUser.first_name
        ? currentUser.first_name[0]
        : "";
      const lastInitial = currentUser.last_name ? currentUser.last_name[0] : "";
      return (firstInitial + lastInitial).toUpperCase();
    }

    return "U";
  };

  // Display name (based on what your API provides)
  const displayName =
    currentUser?.name ||
    (currentUser?.first_name && currentUser?.last_name
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : currentUser?.first_name || "User");

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000]">
      {/* Main Navbar */}
      <div className="flex justify-between items-center bg-gradient-to-r from-teal-800 to-teal-600 px-4 py-3 shadow-lg">
        <div
          className="flex items-center gap-2.5 bg-white/95 pl-2.5 pr-3.5 py-1.5 rounded-full shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 hover:bg-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Avatar className="w-7 h-7 ring-2 ring-teal-500/30 ring-offset-1">
            <AvatarImage src={currentUser?.image} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white text-xs font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center">
            <span className="text-gray-800 font-medium text-sm">
              {displayName}
            </span>
            <ChevronDown
              className={`w-4 h-4 ml-1 text-gray-600 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div
            className="relative p-2 bg-teal-700/60 backdrop-blur-sm rounded-full hover:bg-teal-700/80 transition-all cursor-pointer"
            onClick={() => setShowNotification(!showNotification)}
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-teal-600"></span>
          </div>

          <div className="flex items-center gap-1 bg-gray-800/90 text-white px-2.5 py-1.5 rounded-full shadow-md backdrop-blur-sm border border-gray-700/30">
            <span className="text-yellow-300 font-semibold">36</span>
            <div className="w-4 h-4 text-yellow-300 flex items-center justify-center">
              🪙
            </div>
          </div>
        </div>
      </div>

      {/* Profile dropdown */}
      {isOpen && (
        <div className="absolute mt-1 border border-gray-200/80 mx-2 w-[calc(100%-1rem)] bg-white/95 shadow-xl rounded-xl p-4 z-10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-800">Your Account</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>

          {/* Current profile */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 mb-4 border border-teal-100">
            <div className="flex items-center">
              <Avatar className="w-12 h-12 ring-2 ring-teal-500 ring-offset-1">
                <AvatarImage src={currentUser?.image} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-semibold text-teal-800">{displayName}</p>
                <p className="text-xs text-teal-600">
                  {currentUser?.primary_phone || "No phone number"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <Button
                className="w-full text-xs py-1 h-auto bg-white text-teal-700 border border-teal-200 hover:bg-teal-50"
                onClick={() => router.push("/profile")}
              >
                Manage Profile
              </Button>
              <Button
                className="text-xs py-1 h-auto bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 px-2"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Navigation shortcuts */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-auto py-3 text-gray-700 border-gray-100 hover:border-teal-200 hover:bg-teal-50 space-y-1"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="h-5 w-5 text-teal-600" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-auto py-3 text-gray-700 border-gray-100 hover:border-teal-200 hover:bg-teal-50 space-y-1"
              onClick={() => router.push("/records")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-teal-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs">Records</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-auto py-3 text-gray-700 border-gray-100 hover:border-teal-200 hover:bg-teal-50 space-y-1"
              onClick={() => router.push("/upload")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-teal-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs">Upload</span>
            </Button>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-700 font-normal hover:text-red-600 hover:bg-red-50"
              onClick={() => router.push("/login")}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Notification panel */}
      {showNotification && (
        <div className="absolute right-2 mt-1 w-[calc(100%-1rem)] max-w-sm bg-white/95 shadow-xl rounded-xl overflow-hidden backdrop-blur-sm border border-gray-200/80">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-blue-100 hover:text-white hover:bg-blue-500"
              onClick={() => setShowNotification(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            <div className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    New Lab Report Available
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your recent blood test results are ready to view
                  </p>
                  <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>

            <div className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    Prescription Uploaded Successfully
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your prescription has been processed
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Yesterday</p>
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-amber-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    Appointment Reminder
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Your appointment with Dr. Smith is tomorrow at 10:00 AM
                  </p>
                  <p className="text-xs text-blue-600 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 bg-gray-50 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full text-xs text-blue-600 hover:bg-blue-50"
            >
              View All Notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// <ChevronDown
//   className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
//     isOpen ? "rotate-180" : ""
//   }`}
// />;

// {
//   isOpen && (
//     <div className="absolute mt-2 border border-gray-200/80 ml-2 mr-2 w-[calc(100%-1rem)] bg-white shadow-xl rounded-xl p-4 z-10 backdrop-blur-sm">
//       <h3 className="text-lg font-bold mb-3 text-gray-800">Select Profile</h3>
//       <div className="space-y-2.5">
//         {profiles.map((profile, index) => (
//           <div
//             key={index}
//             className={cn(
//               "flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
//               currentUser.id === profile.id && "bg-teal-50 border-teal-200"
//             )}
//             onClick={() => handleProfileClick(profile)}
//           >
//             <div className="flex items-center gap-3">
//               <Avatar
//                 className={cn(
//                   "w-10 h-10 ring-2",
//                   currentUser.id === profile.id
//                     ? "ring-teal-500"
//                     : "ring-gray-200"
//                 )}
//               >
//                 <AvatarImage src={profile?.image} alt={profile?.name} />
//               </Avatar>
//               <div>
//                 <p
//                   className={cn(
//                     "font-medium",
//                     currentUser.id === profile.id
//                       ? "text-teal-700"
//                       : "text-gray-800"
//                   )}
//                 >
//                   {profile.name}
//                 </p>
//                 <p className="text-sm text-gray-500">{profile?.status}</p>
//               </div>
//             </div>
//             <Settings className="w-5 h-5 text-gray-500 hover:text-teal-600 transition-colors" />
//           </div>
//         ))}
//       </div>
//       <button className="w-full mt-4 py-3 text-teal-700 font-medium border-t border-gray-100 pt-3 hover:text-teal-800 transition-colors">
//         Add new account
//       </button>
//     </div>
//   );
// }
