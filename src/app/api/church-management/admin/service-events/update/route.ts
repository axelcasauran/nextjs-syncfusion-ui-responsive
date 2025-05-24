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

    // First handle the master record and get its ID
    const masterResult = await batchOperations({
      model: _master,
      ...body,
      userId: session.user.id,
      clientIp,
      entityType: _entity,
      type: 'master'
    });

    // Get the master ID (either new or existing)
    const masterId = masterResult.ids;

    // If we have details, process them
    if (body.details) {
      // For new records, add the master ID to all details
      if (body.addedRecords && body.details.addedRecords) {
        body.details.addedRecords = body.details.addedRecords.map((detail: any) => ({
          ...detail,
          serviceId: masterId
        }));
      }

      // Process the detail records
      await batchOperations({
        model: _detail,
        ...body.details,
        userId: session.user.id,
        clientIp,
        entityType: `${_entity}Detail`,
        type: 'detail',
        masterId // Pass the master ID to the batch operations
      });
    }

    // Fetch the complete record with details
    const record = await findRecord(_master, {
      where: {
        id: masterId,
      },
      include: {
        serviceDetail: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    return NextResponse.json({
      result: record
    });

  } catch (error: any) {
    console.error('Error in service-events update:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}