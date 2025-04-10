import { NextResponse } from "next/server";

const API_ENDPOINT = "http://13.61.182.8:5001";

export async function GET(request) {
  try {
    // Get URL parameters from the request
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const otp = searchParams.get("otp");

    // Construct target URL based on parameters
    let targetUrl = `${API_ENDPOINT}/api/v1/auth/authenticate_user?phone=${phone}`;
    if (otp) {
      targetUrl += `&otp=${otp}`;
    }

    // Forward the request to the actual API
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Get the response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Error connecting to API" },
      { status: 500 }
    );
  }
}
