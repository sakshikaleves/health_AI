// app/api/proxy/prescription/route.js

export async function GET(request) {
  try {
    const res = await fetch(
      "http://13.61.182.8:5001/api/v1/patient/prescriptions",
      {
        method: "GET",
        headers: {
          Cookie:
            "session=eyJwYXRpZW50X2lkIjo4LCJzZXNzaW9uX2lkIjoiYWI4YmFkMTEtNzg2Zi00ZmUyLThhMGYtODYzMzFiNDk2MmJjIn0.Z_fM3g.wcmYMnGaz5dFUO8daRWIm9Qs3ZY",
        },
      }
    );

    const data = await res.json(); // or res.text() if it's not JSON
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
