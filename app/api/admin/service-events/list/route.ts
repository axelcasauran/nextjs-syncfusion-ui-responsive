
import { NextRequest, NextResponse } from 'next/server';
import { buildWhereCondition } from '@/app/framework/api/prisma-conditions';
import { validateSession } from '@/app/framework/api/validateSession';
import { getRequestParams } from '@/app/framework/api/request-params';
import { findManyRecords, countRecords } from '@/app/framework/api/prisma-operations';

export async function GET(request: NextRequest) {
  const { error } = await validateSession();
  if (error) return error;

  const { field, nestedField, value, operator, search, sortField, sortDirection, skip, limit } = getRequestParams(request);

  try {

    const whereCondition = buildWhereCondition(field, nestedField, value, operator, search, ['type', 'name', 'description', 'location']);

    // Count total records matching the filter
    const total = await countRecords('service', whereCondition);

    // Get paginated records
    const records = total > 0
      ? await findManyRecords('service', {
        skip,
        take: limit,
        where: whereCondition,
        orderBy: {
          [sortField]: sortDirection,
        }
      })
      : [];

    return NextResponse.json({
      result: records,
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
