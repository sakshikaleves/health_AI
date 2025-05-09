// import { NextResponse } from "next/server";
// import { BASE_URL } from "@/config/api";
// // D:\New folder (2)\original_mahul\app-frontend\src\app\api\proxy\share_patient\route.jsx
// // GET: Fetch shared patients
// export async function GET(request) {
//   const cookie = request.headers.get("cookie");

//   try {
//     const res = await fetch(`${BASE_URL}/api/v1/auth/get_patients`, {
//       method: "GET",
//       headers: {
//         Cookie: cookie || "",
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await res.json();
//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     console.error("[GET_PATIENTS] Error:", error);
//     return NextResponse.json(
//       { error: "Failed to get patients" },
//       { status: 500 }
//     );
//   }
// }

// // POST: Share with phone number
// export async function POST(request) {
//   const cookie = request.headers.get("cookie");
//   const body = await request.json();

//   try {
//     const res = await fetch(`${BASE_URL}/api/v1/auth/share_with_account/`, {
//       method: "POST",
//       headers: {
//         Cookie: cookie || "",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();
//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     console.error("[SHARE_PATIENT] Error:", error);
//     return NextResponse.json(
//       { error: "Failed to share patient" },
//       { status: 500 }
//     );
//   }
// }






// // src/app/api/proxy/share_patient/route.js

// import { NextResponse } from "next/server";
// import { BASE_URL } from "@/config/api";

// // GET: fetch patients
// export async function GET(request) {
//   const cookie = request.headers.get("cookie");

//   try {
//     const response = await fetch(`${BASE_URL}/api/v1/auth/get_patients`, {
//       method: "GET",
//       headers: {
//         Cookie: cookie || "",
//         "Content-Type": "application/json",
//       },
//     });

//     const contentType = response.headers.get("content-type") || "";
//     if (!contentType.includes("application/json")) {
//       const raw = await response.text();
//       console.error("[GET_PATIENTS] Unexpected response:", raw);
//       return NextResponse.json(
//         { error: "Expected JSON but received HTML", debug: raw },
//         { status: 500 }
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json(data, { status: response.status });
//   } catch (err) {
//     console.error("[GET_PATIENTS] Error:", err);
//     return NextResponse.json(
//       { error: "Failed to get patients", message: err.message },
//       { status: 500 }
//     );
//   }
// }

// // POST: share with phone number
// export async function POST(request) {
//   const cookie = request.headers.get("cookie");

//   try {
//     const body = await request.json();

//     const response = await fetch(`${BASE_URL}/api/v1/auth/share_with_account/`, {
//       method: "POST",
//       headers: {
//         Cookie: cookie || "",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const contentType = response.headers.get("content-type") || "";
//     if (!contentType.includes("application/json")) {
//       const raw = await response.text();
//       console.error("[SHARE_PATIENT] Unexpected response:", raw);
//       return NextResponse.json(
//         { error: "Expected JSON but received HTML", debug: raw },
//         { status: 500 }
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     console.error("[SHARE_PATIENT] Error:", error);
//     return NextResponse.json(
//       { error: "Failed to share patient", message: error.message },
//       { status: 500 }
//     );
//   }
// }

// D:\New folder (2)\original_mahul\app-frontend\src\app\api\proxy\share_patient\route.js
// D:\New folder (2)\original_mahul\app-frontend\src\app\api\proxy\share_patient\route.js

import { NextResponse } from "next/server";
import { BASE_URL } from "@/config/api";

// GET: Fetch shared patients
export async function GET(request) {
  const cookie = request.headers.get("cookie");

  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/get_patients`, {
      method: "GET",
      headers: {
        Cookie: cookie || "",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[GET_PATIENTS] Error:", error);
    return NextResponse.json(
      { error: "Failed to get patients", message: error.message },
      { status: 500 }
    );
  }
}

// POST: Share patient with phone number
export async function POST(request) {
  const cookie = request.headers.get("cookie");

  try {
    const body = await request.json();

    const res = await fetch(`${BASE_URL}/api/v1/auth/share_with_account`, {
      method: "POST",
      headers: {
        Cookie: cookie || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Try to parse the response as JSON safely
    const text = await res.text();

    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: res.status });
    } catch (parseError) {
      console.error("[SHARE_PATIENT] Unexpected non-JSON response:", text);
      return NextResponse.json(
        {
          error: "Invalid response from backend",
          raw: text,
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("[SHARE_PATIENT] Error:", error);
    return NextResponse.json(
      { error: "Failed to share patient", message: error.message },
      { status: 500 }
    );
  }
}
