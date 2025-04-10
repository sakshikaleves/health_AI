import { NextResponse } from "next/server";

const API_ENDPOINT = "http://13.61.182.8:5001";

export async function GET(request) {
  try {
    // Get URL and parse the path
    const url = new URL(request.url);
    const originalPath = url.pathname.replace("/api/proxy", "");

    // Preserve any trailing slashes in the original path
    console.log("Original request path:", originalPath);

    // Extract query parameters
    const searchParams = url.searchParams;

    let targetUrl;

    // Handle authentication endpoint
    if (!originalPath || originalPath === "/") {
      targetUrl = `${API_ENDPOINT}/api/v1/auth/authenticate_user`;

      // Add query parameters
      const queryParams = [];
      for (const [key, value] of searchParams.entries()) {
        queryParams.push(`${key}=${encodeURIComponent(value)}`);
      }

      if (queryParams.length > 0) {
        targetUrl += `?${queryParams.join("&")}`;
      }
    }
    // Handle prescriptions endpoint specifically
    else if (
      originalPath === "/patient/prescriptions" ||
      originalPath === "/patient/prescriptions/"
    ) {
      targetUrl = `${API_ENDPOINT}/api/v1/patient/prescriptions`;

      // Add query parameters
      const queryParams = [];
      for (const [key, value] of searchParams.entries()) {
        queryParams.push(`${key}=${encodeURIComponent(value)}`);
      }

      if (queryParams.length > 0) {
        targetUrl += `?${queryParams.join("&")}`;
      }
    }
    // Handle all other API endpoints
    else {
      // Use the EXACT path with preserved trailing slash
      targetUrl = `${API_ENDPOINT}/api/v1${originalPath}`;

      // Add any query parameters
      const queryParams = [];
      for (const [key, value] of searchParams.entries()) {
        queryParams.push(`${key}=${encodeURIComponent(value)}`);
      }

      if (queryParams.length > 0) {
        targetUrl += `?${queryParams.join("&")}`;
      }
    }

    console.log("Final proxying request to:", targetUrl);

    // Get authorization header
    const authHeader = request.headers.get("authorization");

    // Set up headers
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Make the request
    console.log("Making request with headers:", JSON.stringify(headers));
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: headers,
    });

    console.log("Response status:", response.status);

    // Check if response is OK
    if (!response.ok) {
      console.error(
        `API error: ${response.status} ${response.statusText} for ${targetUrl}`
      );

      // Try to get more error details
      let errorDetails = "";
      try {
        const errorText = await response.text();
        errorDetails = errorText;
        console.error("Error response body:", errorText);
      } catch (e) {
        console.error("Could not read error response:", e);
      }

      return NextResponse.json(
        {
          message: `API error: ${response.status} ${response.statusText}`,
          requestUrl: targetUrl,
          errorDetails: errorDetails,
        },
        { status: response.status }
      );
    }

    // Parse response data
    const data = await response.json();
    console.log("Response parsed successfully");

    // Return response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Error connecting to API", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Parse URL path
    const url = new URL(request.url);
    const path = url.pathname.replace("/api/proxy", "");

    console.log("Original POST request path:", path);

    // Build target URL - The key fix: Add /api/v1 prefix to the path
    const targetUrl = `${API_ENDPOINT}/api/v1${path}`;

    console.log("Proxying POST request to:", targetUrl);

    // Get authorization header
    const authHeader = request.headers.get("authorization");

    // Clone the request to forward it
    const formData = await request.formData();

    // Forward the request with formData
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    // Check if response is OK
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { message: `API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Parse response data
    const data = await response.json();

    // Return response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Error connecting to API", error: error.message },
      { status: 500 }
    );
  }
}
