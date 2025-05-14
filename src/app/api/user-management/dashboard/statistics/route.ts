import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@lib/prisma';
import authOptions from '@api/auth/[...nextauth]/auth-options';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract date range parameters
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 }, // Unauthorized
      );
    }

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    // Fetch statistics with independent date range handling
    const [customers, orders ] = await Promise.all([
      // New customers
      prisma.user.count({
        where: {
          ...(fromDate || toDate
            ? {
                createdAt: {
                  ...(fromDate ? { gte: fromDate } : {}),
                  ...(toDate ? { lte: toDate } : {}),
                },
              }
            : {}),
        },
      }),

      // Sales sum and count per day
      prisma.$queryRaw<
        { date: string; total: bigint; count: bigint }[]
      >(Prisma.sql`
        SELECT 
          DATE("createdAt") AS date, 
          SUM("totalAmount") AS "total", 
          COUNT(*) AS "count"
        FROM "EcommerceOrder"
        WHERE "status" IN ('DELIVERED', 'PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED', 'REFUNDED', 'FAILED')
        ${fromDate ? Prisma.sql`AND "createdAt" >= ${fromDate}` : Prisma.empty}
        ${toDate ? Prisma.sql`AND "createdAt" <= ${toDate}` : Prisma.empty}
        GROUP BY DATE("createdAt")
        ORDER BY DATE("createdAt") ASC
      `),
    ]);

    // Prepare the response data with adjusted keys
    return NextResponse.json({
      customers, // New Customers
      orders, // Total Orders
      revenue: 0, // Total Revenue
      sales: [], // Sales per day
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch statistics',
      },
      { status: 500 },
    );
  }
}
