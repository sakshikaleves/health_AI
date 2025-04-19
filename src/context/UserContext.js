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
        // We'll fetch and add userData separately
      });
    } else {
      setCurrentUser({ isAuthenticated: false });
    }
    setIsLoading(false);
  }, []);

  const changeUser = (user) => {
    setCurrentUser(user);
  };

  // New function to update user data
  const updateUserData = (userData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      userData
    }));
  };

  const logout = () => {
    localStorage.removeItem("sessionId");
    setCurrentUser({ isAuthenticated: false });
  };

  return (
    <UserContext.Provider
      value={{ currentUser, changeUser, updateUserData, logout, isLoading }}
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
