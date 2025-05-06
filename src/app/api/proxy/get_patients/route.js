import { NextResponse } from "next/server";
import { BASE_URL } from "../../../../config/api";  // Ensure correct path to config

export async function GET(request) {
  const cookie = request.headers.get("cookie");

  console.log("[GET_PATIENTS] Cookie received:", cookie);  // 🧪 for debugging

  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/get_patients`, {
      method: "GET",
      headers: {
        Cookie: cookie || "",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("[GET_PATIENTS] Response from backend:", data);  // 🧪 for debugging

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("[GET_PATIENTS] Error:", err);
    return NextResponse.json(
      { error: "Failed to get patients", message: err.message },
      { status: 500 }
    );
  }
}
