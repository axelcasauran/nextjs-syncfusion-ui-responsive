 
import { NextRequest, NextResponse } from 'next/server';
import { getClientIP } from '@lib/api';
import { systemLog } from '@/src/business-layer/user-management/services/system-log';
import { buildWhereCondition } from '@framework/api/prisma-conditions';
import { validateSession } from '@framework/api/validateSession';
import { getRequestParams } from '@framework/api/request-params';
import { validateRequestBody } from '@framework/api/validate-request';
import { extractModelData } from '@framework/api/extract-model-data';
import { createRecord, findRecord } from '@framework/api/prisma-operations';
import { FormSchema } from '@church-management-app/admin/service-and-events/forms/forms';


const _entity = 'Service and Events';

export async function GET(request: NextRequest) {
  const { error } = await validateSession();
  if (error) return error;  

  const { field, nestedField, value, operator, search } = getRequestParams(request);

  try {

    const whereCondition = buildWhereCondition(field, nestedField, value, operator, search, ['id']);

    // Get paginated records
    const record = await findRecord('service', {
          where: whereCondition,
          include: {
            serviceDetail: true,
          }
        });

    return NextResponse.json({
      result: record
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
