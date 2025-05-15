/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@framework/api/validateSession';
import { getClientIP } from '@lib/api';
import { batchOperations } from '@framework/api/batch-operations';
import { findRecord } from '@framework/api/prisma-operations';

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
      entityType: _entity,
      type: 'master'
    });

    if (body.details) {
      await batchOperations({
        model: _detail,
        ...body.details,
        userId: session.user.id,
        clientIp,
        entityType: _entity,
        type: 'detail'
      });
    }

    const record = await findRecord(_master, {
      where: {
        id: result.ids,
      },
      include: {
        serviceDetail: true,
      }
    });

    return NextResponse.json({
      result: record
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}