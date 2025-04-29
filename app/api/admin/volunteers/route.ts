import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildWhereCondition } from '@/app/framework/api/prisma-conditions';
import { validateSession } from '@/app/framework/api/validateSession';
import { getRequestParams } from '@/app/framework/api/request-params';


export async function GET(request: NextRequest) {
  const { error } = await validateSession();
  if (error) return error;  

  const { field, nestedField, value, operator, search, orderBy, skip, limit } = getRequestParams(request);

  try {

    const whereCondition = buildWhereCondition(field, nestedField, value, operator, search, ['email', 'firstName', 'lastName', 'mobilenumber', 'department.name', 'role.name']);

    // Count total records matching the filter
    const total = await prisma.user.count({where: whereCondition});

    // Get paginated record
    const records = total > 0
      ? await prisma.user.findMany({
          skip,
          take: limit,
          where: whereCondition,
          orderBy,
          select: {
            id: true,
            isTrashed: true,
            avatar: true,
            firstName: true,
            lastName: true,
            department: true,
            email: true,
            status: true,
            createdAt: true,
            lastSignInAt: true,
            mobilenumber: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })
      : [];

    const data = records.map((record) => ({...record}));

    return NextResponse.json({
      result: data,
      count: total
    });

  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message || 'Oops! Something didn’t go as planned. Please try again in a moment.',
      },
      { status: 500 },
    );
  }
}