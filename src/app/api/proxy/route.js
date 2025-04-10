import { NextResponse } from "next/server";

const API_ENDPOINT = "http://13.61.182.8:5001";

export async function GET(request) {
  try {
    // Get URL parameters from the request
    const { searchParams, pathname } = new URL(request.url);
    const phone = searchParams.get("phone");
    const otp = searchParams.get("otp");
    const userInput = searchParams.get("user_input");
    
    // Extract the path after /api/proxy
    const path = pathname.replace('/api/proxy', '');
    
    // Default to authentication endpoint if no specific path is provided
    let targetUrl = `${API_ENDPOINT}/api/v1`;
    
    // Handle authentication endpoint
    if (!path || path === '/') {
      targetUrl += `/auth/authenticate_user?phone=${phone}`;
      if (otp) {
        targetUrl += `&otp=${otp}`;
      }
    } 
    // Handle other API endpoints
    else {
      targetUrl += path;
      
      // Add query parameters if they exist
      if (userInput) {
        targetUrl += `?user_input=${encodeURIComponent(userInput)}`;
      }
    }
    
    // Get authorization header from the original request
    const authHeader = request.headers.get('authorization');
    
    // Set up headers for the API request
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    
    // Add authorization header if it exists
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Forward the request to the actual API
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: headers,
    });

    // Get the response data
    const data = await response.json();

    // Return the response
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
    // Get URL parameters and path
    const { pathname } = new URL(request.url);
    
    // Extract the path after /api/proxy
    const path = pathname.replace('/api/proxy', '');
    
    // Build target URL
    const targetUrl = `${API_ENDPOINT}/api/v1${path}`;
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    // Clone the request to forward it
    const formData = await request.formData();
    
    // Forward the request with formData
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
      },
      body: formData,
    });

    // Get the response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Error connecting to API", error: error.message },
      { status: 500 }
    );
  }
}
