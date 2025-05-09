// D:\New folder (2)\original_mahul\app-frontend\src\app\api\proxy\labreports\route.js

import axios from "axios";
import { PATIENT_ENDPOINT } from "@/config/api";

export async function GET(request) {
  try {
    // Get the cookie from the incoming request
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create config object with headers including the forwarded cookie
    const config = {
      method: "GET",
      url: `${PATIENT_ENDPOINT}/labreports`,
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true, // Ensures cookies are sent with the request
    };

    // Make the request using axios
    const response = await axios(config);

    // Return the data from the response
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Lab Reports Fetch Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
