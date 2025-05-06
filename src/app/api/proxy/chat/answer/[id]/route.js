// app/api/proxy/chat/answer/[id]/route.js
import { NextResponse } from 'next/server';
import { BASE_URL } from '../../../../../../config/api';

export async function GET(_request, context) {
  const { id } = context.params;
  const cookie = _request.headers.get('cookie');
  const query = new URL(_request.url).searchParams.get('user_input');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/patient/chat/answer/${id}?user_input=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        Cookie: cookie || '',
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[CHAT ANSWER] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send message', message: err.message },
      { status: 500 }
    );
  }
}
