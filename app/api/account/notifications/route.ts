import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';
import { SystemNotificationType } from '@/app/models/system'; // Import your enum

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const query = searchParams.get('query') || '';
  const sortField = searchParams.get('sort') || 'createdAt';
  const sortDirection = searchParams.get('dir') === 'desc' ? 'desc' : 'asc';
  const type = searchParams.get('type') || null;
  const createdAtFrom = searchParams.get('createdAtFrom');
  const createdAtTo = searchParams.get('createdAtTo');

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 }, // Unauthorized
      );
    }

    // Map type query to enum, fallback to undefined if invalid
    const typeFilter =
      type && type !== 'all' ? (type as SystemNotificationType) : undefined;

    // Count total notifications with filters
    const totalCount = await prisma.systemNotification.count({
      where: {
        AND: [
          ...(typeFilter ? [{ type: typeFilter }] : []), // Add type filter if valid
          ...(createdAtFrom || createdAtTo
            ? [
                {
                  createdAt: {
                    ...(createdAtFrom ? { gte: new Date(createdAtFrom) } : {}), // Greater than or equal to `from`
                    ...(createdAtTo ? { lte: new Date(createdAtTo) } : {}), // Less than or equal to `to`
                  },
                },
              ]
            : []),
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
    });

    // Handle sorting logic
    const orderBy =
      sortField === 'entity'
        ? { entityType: sortDirection as Prisma.SortOrder } // Sort by entityType if "entity" is selected
        : { [sortField]: sortDirection as Prisma.SortOrder }; // Default sorting

    // Fetch notifications with filters
    const notifications = await prisma.systemNotification.findMany({
      where: {
        AND: [
          ...(typeFilter ? [{ type: typeFilter }] : []), // Add type filter if valid
          ...(createdAtFrom || createdAtTo
            ? [
                {
                  createdAt: {
                    ...(createdAtFrom ? { gte: new Date(createdAtFrom) } : {}), // Greater than or equal to `from`
                    ...(createdAtTo ? { lte: new Date(createdAtTo) } : {}), // Less than or equal to `to`
                  },
                },
              ]
            : []),
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
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
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
      pagination: {
        total: totalCount,
        page,
        limit,
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch notifications.' },
      { status: 500 },
    );
  }
}
