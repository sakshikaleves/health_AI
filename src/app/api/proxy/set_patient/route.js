//  D:\New folder (2)\original_mahul\app-frontend\src\app\api\proxy\set_patient\route.js
import { NextResponse } from "next/server";
import { BASE_URL } from "@/config/api";

export async function GET(request) {
  const cookie = request.headers.get("cookie");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing patient id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/set_patient/${id}`, {
      method: "GET",
      headers: {
        Cookie: cookie || "",
      },
    });

    const text = await res.text();

    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: res.status });
    } catch {
      return NextResponse.json({ raw: text }, { status: res.status });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
