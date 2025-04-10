"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { profiles } from "@/data/Users";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      setCurrentUser({
        isAuthenticated: true,
        sessionId,
        // You might want to fetch user details using the session ID here
      });
    } else {
      setCurrentUser({ isAuthenticated: false });
    }
    setIsLoading(false);
  }, []);

  const changeUser = (user) => {
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("sessionId");
    setCurrentUser({ isAuthenticated: false });
  };

  return (
    <UserContext.Provider
      value={{ currentUser, changeUser, logout, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
