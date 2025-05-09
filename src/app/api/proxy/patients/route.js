// D:\New folder (2)\original_mahul\app-frontend\src\app\api\proxy\patients\route.js

import axios from "axios";
import { BASE_URL } from "@/config/api";

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
   }

    const response = await axios.get(`${BASE_URL}/api/v1/auth/get_patients`, {
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true,
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Patient Fetch Error:", error?.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch patients" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
