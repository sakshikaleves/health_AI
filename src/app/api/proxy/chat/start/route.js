// D:\New folder (2)\app\api\proxy\chat\start\route.js
import { NextResponse } from 'next/server';
import { BASE_URL } from '../../../../../config/api';

export async function GET(request) {
  const cookie = request.headers.get('cookie');

  try {
    const backendRes = await fetch(`${BASE_URL}/api/v1/patient/chat/start/diagnose`, {
      method: 'GET',
      headers: {
        Cookie: cookie || '',
      },
    });

    const text = await backendRes.text(); // read as text first
    console.log('[CHAT/START] Backend raw response:', text);

    let data;
    try {
      data = JSON.parse(text); // then parse
    } catch (jsonErr) {
      console.error('[CHAT/START] JSON parsing failed:', jsonErr);
      return NextResponse.json(
        { error: 'Failed to parse JSON from backend', raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error('[CHAT/START] Fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to reach chat backend', message: err.message },
      { status: 500 }
    );
  }
}
