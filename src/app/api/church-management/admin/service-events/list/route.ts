
import { NextRequest, NextResponse } from 'next/server';
import { buildWhereCondition } from '@framework/api/prisma-conditions';
import { validateSession } from '@framework/api/validateSession';
import { getRequestParams } from '@framework/api/request-params';
import { findManyRecords, countRecords } from '@framework/api/prisma-operations';

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
