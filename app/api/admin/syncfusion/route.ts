import { NextRequest, NextResponse } from 'next/server';
import { getClientIP } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { systemLog } from '@/services/system-log';
import { FormSchema, FormSchemaType } from '@/app/(protected)/admin/departments/forms/forms';
import { buildWhereCondition } from '@/app/framework/api/prisma-conditions';
import { validateSession } from '@/app/framework/api/validateSession';
import { getRequestParams } from '@/app/framework/api/request-params';
import { validateRequestBody } from '@/app/framework/api/validate-request';

const _entity = 'Department';

export async function GET(request: NextRequest) {
  const { error } = await validateSession();
  if (error) return error;  

  const { field, nestedField, value, operator, search, sortField, sortDirection, skip, limit } = getRequestParams(request);

  try {

    const whereCondition = buildWhereCondition(field, nestedField, value, operator, search, ['name', 'slug', 'description']);

    // Count total records matching the filter
    const total = await prisma.department.count({where: whereCondition});

    // Get paginated record
    const records = total > 0
      ? await prisma.department.findMany({
          skip,
          take: limit,
          where: whereCondition,
          orderBy: {
            [sortField]: sortDirection,
          }
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

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await validateSession();
    if (error) return error;  

    const clientIp = getClientIP(request);
    const validation = await validateRequestBody(request, FormSchema);
    if (!validation.success) {
      return validation.error;
    }

    const { name, slug, description }: FormSchemaType = validation.data;

    // Create the new record
    const newRecord = await prisma.department.create({
      data: {
        name, 
        slug, 
        description
      },
    });

    // Log
    await systemLog({event: 'create', userId: session.user.id, entityId: newRecord.id, entityType: _entity, description: _entity + ' created by user', ipAddress: clientIp });

    return NextResponse.json(newRecord);

  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || 'Oops! Something didn’t go as planned. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
