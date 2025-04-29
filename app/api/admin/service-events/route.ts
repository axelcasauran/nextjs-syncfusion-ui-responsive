 
import { NextRequest, NextResponse } from 'next/server';
import { getClientIP } from '@/lib/api';
import { systemLog } from '@/services/system-log';
import { buildWhereCondition } from '@/app/framework/api/prisma-conditions';
import { validateSession } from '@/app/framework/api/validateSession';
import { getRequestParams } from '@/app/framework/api/request-params';
import { validateRequestBody } from '@/app/framework/api/validate-request';
import { extractModelData } from '@/app/framework/api/extract-model-data';
import { createRecord, findManyRecords, countRecords } from '@/app/framework/api/prisma-operations';
import { FormSchema } from '@/app/(protected)/admin/service-and-events/forms/forms';


const _entity = 'Service and Events';

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

    // const data = records.map((record: any) => ({...record}));

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

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await validateSession();
    if (error) return error;  

    const clientIp = getClientIP(request);
    const validation = await validateRequestBody(request, FormSchema);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error || 'Oops! Something didn’t go as planned. Please try again in a moment.' },
        { status: 500 },
      );
    }

    /// Extract and create record dynamically
    const modelData = extractModelData(validation.data, 'service');
    const newRecord = await createRecord('service', modelData);

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
