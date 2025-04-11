import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get the phone number and OTP from the query parameters
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const otp = searchParams.get('otp');
    
    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }
    
    console.log(`Verifying OTP for phone: ${phone}`);
    
    // Make the request to the external API
    const response = await fetch(
      `http://13.61.182.8:5001/api/v1/auth/authenticate_user?phone=${phone}&otp=${otp}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log("OTP verification API response status:", response.status);
    
    // Handle API response
    const responseData = await response.json();
    
    // Forward any cookies from the API response
    const headers = new Headers();
    const setCookieHeader = response.headers.get('Set-Cookie');
    if (setCookieHeader) {
      headers.set('Set-Cookie', setCookieHeader);
      console.log("Found Set-Cookie header in OTP verification, forwarding to client");
    }
    
    return NextResponse.json(responseData, {
      status: response.status,
      headers: headers,
    });
  } catch (error) {
    console.error("Error in OTP verification API route:", error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
