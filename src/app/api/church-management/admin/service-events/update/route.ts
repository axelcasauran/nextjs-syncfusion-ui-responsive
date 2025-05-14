/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@framework/api/validateSession';
import { getClientIP } from '@lib/api';
import { batchOperations } from '@framework/api/batch-operations';

const _entity = 'Service';
const _master = 'service';
const _detail = 'serviceDetail';

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await validateSession();
    if (error) return error;

    const clientIp = getClientIP(request);
    const body = await request.json();

    const result = await batchOperations({
      model: _master,
      ...body,
      userId: session.user.id,
      clientIp,
      entityType: _entity
    });

    if (body.details) {
      await batchOperations({
        model: _detail,
        ...body.details,
        userId: session.user.id,
        clientIp,
        entityType: _entity
      });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}