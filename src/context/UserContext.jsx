"use client";
import { createContext, useContext, useState, useEffect } from "react";
import apiService from "@/services/api";

// Create context
const UserContext = createContext();

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState({
    isAuthenticated: false,
    sessionId: null,
    phone: null,
    // Add other user properties as needed
  });

  // Initialize user from API service
  useEffect(() => {
    if (apiService.isAuthenticated()) {
      const userData = apiService.getCurrentUser();
      setUser({
        isAuthenticated: true,
        sessionId: apiService.sessionId,
        phone: userData?.phone || null,
        // Add other user properties as needed
      });
    }
  }, []);

  // Update user state
  const changeUser = (userData) => {
    if (userData.isAuthenticated) {
      // Set user in API service if not already set
      if (!apiService.isAuthenticated()) {
        apiService.setSession(userData.sessionId, {
          phone: userData.phone,
          // Add other user properties as needed
        });
      }
    } else {
      // Clear session if logging out
      apiService.clearSession();
    }

    setUser(userData);
  };

  // Expose login, logout functions
  const login = async (phone, otp) => {
    try {
      const response = await apiService.verifyOTP(phone, otp);
      if (response.session_id) {
        changeUser({
          isAuthenticated: true,
          sessionId: response.session_id,
          phone: phone,
          // Add other user properties as needed
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    changeUser({
      isAuthenticated: false,
      sessionId: null,
      phone: null,
    });
  };

  return (
    <UserContext.Provider value={{ user, changeUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for using the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
