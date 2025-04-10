/**
 * API Service
 * Centralized API calls for the entire application
 */

// Local proxy URL that bypasses CORS
const PROXY_URL = "/api/proxy";

class ApiService {
  constructor() {
    this.sessionId = null;
    this.user = null;

    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      this.sessionId = localStorage.getItem("sessionId");
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
    }
  }

  // Get request headers with session ID if available
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.sessionId) {
      headers["Authorization"] = `Bearer ${this.sessionId}`;
    }

    return headers;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.sessionId;
  }

  // Get current user data
  getCurrentUser() {
    return this.user;
  }

  // Set session and user data
  setSession(sessionId, userData) {
    this.sessionId = sessionId;
    this.user = userData;

    if (typeof window !== "undefined") {
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }

  // Clear session data (logout)
  clearSession() {
    this.sessionId = null;
    this.user = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("user");
    }
  }

  // Authentication
  async sendOTP(phoneNumber) {
    try {
      const response = await fetch(`${PROXY_URL}?phone=${phoneNumber}`);
      return await response.json();
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }

  async verifyOTP(phoneNumber, otp) {
    try {
      const response = await fetch(
        `${PROXY_URL}?phone=${phoneNumber}&otp=${otp}`
      );
      const data = await response.json();

      if (response.ok && data.session_id) {
        // Store authenticated user data
        this.setSession(data.session_id, {
          phone: phoneNumber,
          ...data.user_data, // Include any user data returned from API
        });
      }

      return data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  // Prescriptions
  async getPrescriptions() {
    if (!this.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch(`${PROXY_URL}/patient/prescriptions`, {
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      throw error;
    }
  }

  async getPrescriptionDetails(id) {
    if (!this.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch(`${PROXY_URL}/patient/prescription/${id}`, {
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching prescription details for ID ${id}:`, error);
      throw error;
    }
  }

  // Lab Reports
  async getLabReports() {
    if (!this.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch(`${PROXY_URL}/patient/labreports`, {
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching lab reports:", error);
      throw error;
    }
  }

  async getLabReportDetails(id) {
    if (!this.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch(`${PROXY_URL}/patient/labreport/${id}`, {
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching lab report details for ID ${id}:`, error);
      throw error;
    }
  }

  // Health Analysis
  async getHealthAnalysis() {
    if (!this.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch(`${PROXY_URL}/patient/health-analysis`, {
        headers: this.getHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching health analysis:", error);
      throw error;
    }
  }

  // Supplements
  async uploadSupplements(userInput) {
    if (!this.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch(
        `${PROXY_URL}/patient/upload_supplements?user_input=${encodeURIComponent(
          userInput
        )}`,
        {
          headers: this.getHeaders(),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error uploading supplements:", error);
      throw error;
    }
  }

  // File Uploads
  async uploadPrescription(file) {
    if (!this.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${PROXY_URL}/patient/upload_prescription`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.sessionId}`,
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error("Error uploading prescription:", error);
      throw error;
    }
  }

  async uploadLabReport(file) {
    if (!this.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    try {
      const formData = new FormData();
      formData.append("Labreport", file);

      const response = await fetch(`${PROXY_URL}/patient/upload_labreport`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.sessionId}`,
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error("Error uploading lab report:", error);
      throw error;
    }
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;
