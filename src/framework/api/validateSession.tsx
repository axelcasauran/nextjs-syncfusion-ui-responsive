import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@api/auth/[...nextauth]/auth-options';

export async function validateSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 }
      ),
      session: null
    };
  }

  return { error: null, session };
}