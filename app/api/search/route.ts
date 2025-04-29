import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 }, // Unauthorized
      );
    }

    // Perform the searches concurrently using Promise.all
    const [customers] = await Promise.all([
      prisma.user.findMany({
        where: query
          ? {
              OR: [
                { id: { contains: query, mode: 'insensitive' } },
                { firstName: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
              ],
            }
          : undefined,
        take: limit,
        select: {
          id: true,
          firstName: true,
          status: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),

    ]);

    // Return results in separate keys
    return NextResponse.json({
      data: {
        customers,
      },
      meta: {
        query,
        limit,
      },
    });
  } catch (error) {
    console.error(
      'Error fetching search results:',
      error instanceof Error ? error.message : error,
    );

    // Safeguard against invalid error payloads
    return NextResponse.json(
      {
        message: 'Failed to fetch search results.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
