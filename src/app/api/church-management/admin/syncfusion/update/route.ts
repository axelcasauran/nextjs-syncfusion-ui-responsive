/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { validateSession } from '@framework/api/validateSession';
import { systemLog } from '@/src/business-layer/user-management/services/system-log';
import { getClientIP } from '@lib/api';
import { Department } from '@/src/business-layer/church-management/models/department';

const _entity = 'Department';

export async function POST(request: NextRequest) {
  try {
    const { error, session } = await validateSession();
    if (error) return error;  

    const clientIp = getClientIP(request);
    const body = await request.json();
    const { changedRecords, addedRecords, deletedRecords } = body;
    let _newIds = '';
    
    // Updating records - Begin transaction
    await prisma.$transaction(async (tx) => {
      // Handle added records
      if (addedRecords?.length) {
        const _new = await tx.department.createManyAndReturn({
          data: addedRecords.map((item: Department) => ({
            name: item.name,
            slug: item.slug,
            description: item.description
          }))
        });

        // Audit logs
        const newIds = _new.map(record => record.id).join(', ');
        _newIds = newIds;
      }
      // Handle updated records
      if (changedRecords?.length) {
        await Promise.all(
          changedRecords.map((item: Department) =>
            tx.department.update({
              where: { id: item.id },
              data: {
                name: item.name,
                slug: item.slug,
                description: item.description
              }
            })
          )
        );
      }
      // Handle deleted records
      if (deletedRecords?.length) {
        await tx.department.deleteMany({
          where: {
            id: {
              in: deletedRecords.map((item: Department) => item.id)
            }
          }
        });
      }
    });

    // Audit Logs - Begin transaction
    // Handle added records
    if (addedRecords?.length) {
      // Audit logs
      await systemLog({event: 'create', userId: session.user.id, entityId: _newIds, entityType: _entity, description: _entity + ' created by user', ipAddress: clientIp });      
    }
    // Handle updated records
    if (changedRecords?.length) {
      // Audit logs
      const updatedIds = changedRecords.map((record: Department) => record.id).join(', ');
      await systemLog({event: 'update', userId: session.user.id, entityId: updatedIds, entityType: _entity, description: _entity + ' updated by user', ipAddress: clientIp });
    }
    // Handle deleted records
    if (deletedRecords?.length) {
      // Audit logs
      const deletedIds = deletedRecords.map((record: Department) => record.id).join(', ');
      await systemLog({event: 'delete', userId: session.user.id, entityId: deletedIds, entityType: _entity, description: _entity + ' deleted by user', ipAddress: clientIp });
    }
  
    return NextResponse.json({success: true });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}