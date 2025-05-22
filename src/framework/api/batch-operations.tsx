/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@lib/prisma';
import { systemLog } from '@/src/business-layer/user-management/services/system-log';
import { PrismaModels } from './prisma-models';

const prismaModels = PrismaModels;

interface BatchOperationOptions {
    model: string;
    addedRecords?: any[];
    changedRecords?: any[];
    deletedRecords?: any[];
    userId: string;
    clientIp: string;
    entityType: string;
    type?: 'master' | 'detail';
    masterId?: string; // ID of the master record for details
    masterField?: string; // Field name that links to the master (default: model + 'Id')
}

export async function batchOperations({
    model,
    addedRecords,
    changedRecords,
    deletedRecords,
    userId,
    clientIp,
    entityType,
    type,
    masterId,
    masterField
}: BatchOperationOptions) {
    if (!prismaModels[model]) {
        throw new Error(`Model ${model} not found`);
    }

    let _newIds = null;
    const isDetail = type === 'detail';
    const foreignKeyField = masterField || (isDetail ? model.replace('Detail', '') + 'Id' : null);

    // +++++++++++++++++++++++
    // Batch Update
    await prisma.$transaction(async (tx) => {
        // Handle added records
        if (addedRecords?.length) {
            // For detail records, ensure they have the master ID
            if (isDetail && masterId && foreignKeyField) {
                addedRecords = addedRecords.map(item => ({
                    ...item,
                    [foreignKeyField]: masterId
                }));
            }

            const newRecords = await (tx[model as keyof typeof tx] as any).createManyAndReturn({
                data: addedRecords
            });

            _newIds = newRecords.map((record: any) => record.id).join(', ');
        }

        // Handle updated records
        if (changedRecords?.length) {
            // For detail records, ensure they have the master ID
            if (isDetail && masterId && foreignKeyField) {
                changedRecords = changedRecords.map(item => ({
                    ...item,
                    [foreignKeyField]: masterId
                }));
            }

            await Promise.all(
                changedRecords.map(item =>
                    (tx[model as keyof typeof tx] as any).update({
                        where: { id: item.id },
                        data: filterSchemaFields(item)
                    })
                )
            );
        }

        // Handle deleted records
        if (deletedRecords?.length) {
            await (tx[model as keyof typeof tx] as any).deleteMany({
                where: {
                    id: {
                        in: deletedRecords.map(item => item.id)
                    }
                }
            });
        }
    }, {
        timeout: 10000
    });

    // +++++++++++++++++++++++
    // Audit Logs
    // Handle added records
    if (addedRecords?.length) {
        // Audit logs
        await systemLog({ 
            event: 'create', 
            userId: userId, 
            entityId: _newIds || '', 
            entityType: entityType, 
            description: `${entityType} created`, 
            ipAddress: clientIp 
        });
    }
    // Handle updated records
    if (changedRecords?.length) {
        // Audit logs
        const updatedIds = changedRecords.map((record: any) => record.id).join(', ');
        await systemLog({ 
            event: 'update', 
            userId: userId, 
            entityId: updatedIds, 
            entityType: entityType, 
            description: `${entityType} updated`, 
            ipAddress: clientIp 
        });
    }
    // Handle deleted records
    if (deletedRecords?.length) {
        // Audit logs
        const deletedIds = deletedRecords.map((record: any) => record.id).join(', ');
        await systemLog({ 
            event: 'delete', 
            userId: userId, 
            entityId: deletedIds, 
            entityType: entityType, 
            description: `${entityType} deleted`, 
            ipAddress: clientIp 
        });
    }

    if (type === 'master') {
        return { ids: _newIds || ((changedRecords?.[0]?.id) || '') };
    }
    else {
        return { success: true };
    }
}

// Helper function to filter schema fields
function filterSchemaFields(data: any): any {
    // Filter out object and array fields
    const filteredData = Object.entries(data).reduce((acc: any, [key, value]) => {
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Skip object fields (like user objects)
            return acc;
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});

    return filteredData;
}