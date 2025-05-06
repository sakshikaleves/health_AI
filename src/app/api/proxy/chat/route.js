import { NextResponse } from 'next/server';
import { BASE_URL } from '../../../../config/api';

export async function GET(request) {
  const cookie = request.headers.get('cookie');

  try {
    const response = await fetch(`${BASE_URL}/api/v1/patient/chats`, {
      method: 'GET',
      headers: {
        Cookie: cookie || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load chats', message: err.message }, { status: 500 });
  }
}
