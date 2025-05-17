import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { buildWhereCondition } from '@framework/api/prisma-conditions';
import { validateSession } from '@framework/api/validateSession';
import { getRequestParams } from '@framework/api/request-params';


export async function GET(request: NextRequest) {
  const { error } = await validateSession();
  if (error) return error;

  const { field, nestedField, value, operator, search, sortField, sortDirection, skip, limit } = getRequestParams(request);

  try {

    const whereCondition = buildWhereCondition(field, nestedField, value, operator, search, ['firstName', 'lastName', 'middleName', 'email']);

    // Count total records matching the filter
    const total = await prisma.user.count({ where: whereCondition });

    // Get paginated record
    const records = total > 0
      ? await prisma.user.findMany({
        skip,
        take: limit,
        where: whereCondition,
        orderBy: {
          [sortField]: sortDirection,
        },
        select: {
          id: true,
          isTrashed: true,
          avatar: true,
          firstName: true,
          lastName: true,
          department: true,
          status: true
        }
      })
      : [];

    const data = records.map((record) => ({
      ...record,
      fullName: `${record.firstName} ${record.lastName}`.trim()
    }));

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
