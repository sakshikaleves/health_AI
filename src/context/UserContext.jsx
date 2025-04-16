"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Create context
const UserContext = createContext();

// Storage keys
const STORAGE_KEYS = {
  SESSION_ID: "prescripto_session_id",
  USER_DATA: "prescripto_user_data",
  IS_AUTHENTICATED: "prescripto_is_authenticated",
};

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState({
    isAuthenticated: false,
    sessionId: null,
    phone: null,
    // Add other user properties as needed
  });

  // Initialize user from localStorage
  useEffect(() => {
    try {
      const isAuthenticated =
        localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === "true";

      if (isAuthenticated) {
        const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
        const userData = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.USER_DATA) || "{}"
        );

        setUser({
          isAuthenticated: true,
          sessionId,
          phone: userData?.phone || null,
          ...userData,
        });
      }
    } catch (error) {
      console.error("Error loading user data from localStorage:", error);
      // Handle the error gracefully - possibly clear invalid data
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    }
  }, []);

  // Update user state and localStorage
  const changeUser = (userData) => {
    if (userData.isAuthenticated) {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, userData.sessionId);
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify({
          phone: userData.phone,
          firstName: userData.firstName,
          lastName: userData.lastName,
          // Add other properties as needed
          ...userData,
        })
      );
    } else {
      // Clear localStorage on logout
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    }

    setUser(userData);
  };

  // Login function that verifies OTP via API
  const login = async (phone, otp) => {
    try {
      // Direct API call instead of using apiService
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.session_id) {
        changeUser({
          isAuthenticated: true,
          sessionId: data.session_id,
          phone: phone,
          ...data.user, // Assuming API returns user data
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Optionally make an API call to invalidate session on server
    fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.error("Logout API error:", err));

    // Clear user state
    changeUser({
      isAuthenticated: false,
      sessionId: null,
      phone: null,
    });
  };

  // Get current user profile data
  const getCurrentUser = async () => {
    if (!user.isAuthenticated) return null;

    try {
      const response = await fetch("/api/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.sessionId}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Session expired, log out
          logout();
          return null;
        }
        throw new Error(`Failed to get user profile: ${response.status}`);
      }

      const profileData = await response.json();

      // Update user data with latest from server
      setUser((prev) => ({
        ...prev,
        ...profileData,
      }));

      return profileData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        changeUser,
        login,
        logout,
        getCurrentUser,
        isAuthenticated: () => user.isAuthenticated,
      }}
    >
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
