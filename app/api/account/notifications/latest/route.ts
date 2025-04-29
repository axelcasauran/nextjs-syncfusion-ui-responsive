import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { SystemNotificationType } from '@/app/models/system';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const sortField = searchParams.get('sort') || 'createdAt';
  const sortDirection = searchParams.get('dir') === 'asc' ? 'asc' : 'desc';
  const type = searchParams.get('type') || null;

  // Always return the latest 20 notifications.
  const limit = 20;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 },
      );
    }

    // Map type query to enum, fallback to undefined if invalid.
    const typeFilter =
      type && type !== 'all' ? (type as SystemNotificationType) : undefined;

    // Handle sorting logic.
    const orderBy =
      sortField === 'entity'
        ? { entityType: sortDirection as Prisma.SortOrder }
        : { [sortField]: sortDirection as Prisma.SortOrder };

    // Fetch notifications with filters and include related user data.
    const notifications = await prisma.systemNotification.findMany({
      where: {
        AND: [
          ...(typeFilter ? [{ type: typeFilter }] : []),
          {
            OR: [
              { subject: { contains: query, mode: 'insensitive' } },
              { message: { contains: query, mode: 'insensitive' } },
              { entityId: { contains: query, mode: 'insensitive' } },
              { entityType: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      orderBy,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { message: 'Failed to fetch notifications.' },
      { status: 500 },
    );
  }
}
