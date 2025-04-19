/**
 * API configuration
 * Contains base URLs and other API-related constants
 */

export const API_BASE_URL = "http://51.20.164.58:5001";
export const API_V1_URL = `${API_BASE_URL}/api/v1`;

// Auth endpoints
export const AUTH_ENDPOINT = `${API_V1_URL}/auth`;

// Patient endpoints
export const PATIENT_ENDPOINT = `${API_V1_URL}/patient`;

// Export the complete endpoints for direct use
export const LAB_REPORT_ENDPOINT = (id, byTestGroup = false) => 
  `${PATIENT_ENDPOINT}/labreport/${id}${byTestGroup ? '?byTestGroup=True' : ''}`;
