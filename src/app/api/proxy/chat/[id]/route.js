import { NextResponse } from 'next/server';
import { BASE_URL } from '../../../../../config/api';

export async function GET(_request, context) {
  const { params } = context;
  const cookie = _request.headers.get('cookie');

  try {
    const response = await fetch(`${BASE_URL}/api/v1/patient/chat/${params.id}`, {
      method: 'GET',
      headers: {
        Cookie: cookie || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error('[CHAT FETCH] Error fetching chat by id:', err);
    return NextResponse.json(
      { error: 'Failed to fetch chat', message: err.message },
      { status: 500 }
    );
  }
}
