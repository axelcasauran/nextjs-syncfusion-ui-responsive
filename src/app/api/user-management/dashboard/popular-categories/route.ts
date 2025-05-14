import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@lib/prisma';
import authOptions from '@api/auth/[...nextauth]/auth-options';

export interface PopularCategory {
  id: string;
  name: string;
  slug: string;
  totalSold: number;
}

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

    // Fetch top 5 best-selling categories within the date range
    const categories = await prisma.$queryRaw<PopularCategory[]>(Prisma.sql`
      SELECT 
        c.id, 
        c.name,
        c.slug,
        COALESCE(SUM(CAST(oi.quantity AS INT)), 0)::bigint AS "totalSold"
      FROM "EcommerceCategory" c
      LEFT JOIN "EcommerceProduct" p ON c.id = p."categoryId"
      LEFT JOIN "EcommerceOrderItem" oi ON p.id = oi."productId"
      LEFT JOIN "EcommerceOrder" o ON oi."orderId" = o.id
      WHERE p."isTrashed" = false
      ${from ? Prisma.sql`AND o."createdAt" >= ${new Date(from)}` : Prisma.empty}
      ${to ? Prisma.sql`AND o."createdAt" <= ${new Date(to)}` : Prisma.empty}
      GROUP BY c.id, c.name
      ORDER BY "totalSold" DESC
      LIMIT 5
    `);

    // Serialize BigInt values
    const serializedCategories = categories.map((category) => ({
      ...category,
      totalSold: category.totalSold.toString(), // Convert BigInt to string
    }));

    return NextResponse.json({
      success: true,
      data: serializedCategories,
    });
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 },
    );
  }
}
