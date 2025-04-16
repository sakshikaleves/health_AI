import { NextResponse } from "next/server";
import { AUTH_ENDPOINT } from "@/config/api";

export async function GET(request) {
  try {
    // Get the phone number from the query parameters
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    console.log(`Authenticating user with phone: ${phone}`);

    // Make the request to the external API
    const response = await fetch(
      `${AUTH_ENDPOINT}/authenticate_user?phone=${phone}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Authentication API response status:", response.status);

    // Handle API response
    const responseData = await response.json();

    // Forward any cookies from the API response
    const headers = new Headers();
    const setCookieHeader = response.headers.get("Set-Cookie");
    if (setCookieHeader) {
      headers.set("Set-Cookie", setCookieHeader);
      console.log("Found Set-Cookie header, forwarding to client");
    }

    return NextResponse.json(responseData, {
      status: response.status,
      headers: headers,
    });
  } catch (error) {
    console.error("Error in authentication API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
