import axios from "axios";
import { NextResponse } from "next/server";
import { PATIENT_ENDPOINT } from "@/config/api";

export async function POST(request) {
  try {
    // Get the cookie from the incoming request
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json(
        { error: "Authentication required. Please log in and try again." },
        { status: 401 }
      );
    }

    // Get form data from the incoming request
    const formData = await request.formData();

    // Create a new FormData object to send to the external API
    const apiFormData = new FormData();

    // Get the file from the form data
    const file = formData.get("Labreport");
    if (!file) {
      return NextResponse.json(
        {
          error: "No lab report file provided. Please select a file to upload.",
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File is too large. Please select a file smaller than 10MB." },
        { status: 400 }
      );
    }

    // Append the file to the API FormData
    apiFormData.append("Labreport", file);

    // Make the request to the external API
    const response = await axios.post(
      `${PATIENT_ENDPOINT}/upload_labreport`,
      apiFormData,
      {
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        timeout: 30000, // 30 second timeout
      }
    );

    // Return the response from the external API
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Lab Report Upload Error:", error);

    // Handle different error types
    if (error.code === "ECONNABORTED") {
      return NextResponse.json(
        {
          error:
            "Upload timed out. Please try again with a smaller file or check your connection.",
        },
        { status: 408 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "Your session has expired. Please log in again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to upload lab report. Please try again later.",
        details: error.response?.data?.message || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
