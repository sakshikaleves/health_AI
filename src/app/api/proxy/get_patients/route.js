// import { NextResponse } from "next/server";
// import { BASE_URL } from "../../../../config/api";  // Ensure correct path to config
// // D:\New folder (2)\original_mahul\app-frontend\src\app\api\proxy\get_patients\route.js
// export async function GET(request) {
//   const cookie = request.headers.get("cookie");

//   console.log("[GET_PATIENTS] Cookie received:", cookie);  // 🧪 for debugging

//   try {
//     const response = await fetch(`${BASE_URL}/api/v1/auth/get_patients`, {
//       method: "GET",
//       headers: {
//         Cookie: cookie || "",
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await response.json();
//     console.log("[GET_PATIENTS] Response from backend:", data);  // 🧪 for debugging

//     return NextResponse.json(data, { status: response.status });
//   } catch (err) {
//     console.error("[GET_PATIENTS] Error:", err);
//     return NextResponse.json(
//       { error: "Failed to get patients", message: err.message },
//       { status: 500 }
//     );
//   }
// }






// src/app/api/proxy/share_patient/route.js

import { NextResponse } from "next/server";
import { BASE_URL } from "@/config/api";

// GET: fetch patients
export async function GET(request) {
  const cookie = request.headers.get("cookie");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/get_patients`, {
      method: "GET",
      headers: {
        Cookie: cookie || "",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("[GET_PATIENTS] Error:", err);
    return NextResponse.json(
      { error: "Failed to get patients", message: err.message },
      { status: 500 }
    );
  }
}

// POST: share with phone number
export async function POST(request) {
  const cookie = request.headers.get("cookie");

  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/api/v1/auth/share_with_account`, {
      method: "POST",
      headers: {
        Cookie: cookie || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[SHARE_PATIENT] Error:", error);
    return NextResponse.json(
      { error: "Failed to share patient", message: error.message },
      { status: 500 }
    );
  }
}
