import axios from "axios";
import { PATIENT_ENDPOINT } from "@/config/api";

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const url = new URL(request.url);
    const byTestGroup = url.searchParams.get("byTestGroup");

    console.log(`Fetching lab report ${id} with byTestGroup=${byTestGroup}`);

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

    // Create the URL with the correct endpoint format
    const apiUrl = `${PATIENT_ENDPOINT}/labreport/${id}${
      byTestGroup ? `?byTestGroup=${byTestGroup}` : ""
    }`;

    console.log(`Making request to: ${apiUrl}`);

    // Create config object with headers including the forwarded cookie
    const config = {
      method: "GET",
      url: apiUrl,
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true, // Ensures cookies are sent with the request
    };

    // Make the request using axios
    const response = await axios(config);
    console.log("Lab report API response received successfully");

    // Return the data from the response
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Lab Report ${params.id} Fetch Error:`, error);
    console.error("Error details:", error.response?.data || error.message);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.response?.data || error.message,
        stack: error.stack,
      }),
      {
        status: error.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
