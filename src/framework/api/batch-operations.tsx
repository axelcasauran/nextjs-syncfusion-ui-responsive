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
}

export async function batchOperations({
    model,
    addedRecords,
    changedRecords,
    deletedRecords,
    userId,
    clientIp,
    entityType
}: BatchOperationOptions) {
    if (!prismaModels[model]) {
        throw new Error(`Model ${model} not found`);
    }

    // try {

        let _newIds = '';

        // +++++++++++++++++++++++
        // Batch Update
        await prisma.$transaction(async (tx) => {
            // Handle added records
            if (addedRecords?.length) {
                const newRecords = await (tx[model as keyof typeof tx] as any).createManyAndReturn({
                    data: addedRecords
                });

                _newIds = newRecords.map((record: any) => record.id).join(', ');
            }

            // Handle updated records
            if (changedRecords?.length) {
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
            await systemLog({ event: 'create', userId: userId, entityId: _newIds, entityType: entityType, description: entityType + ' created by user', ipAddress: clientIp });
        }
        // Handle updated records
        if (changedRecords?.length) {
            // Audit logs
            const updatedIds = changedRecords.map((record: any) => record.id).join(', ');
            await systemLog({ event: 'update', userId: userId, entityId: updatedIds, entityType: entityType, description: entityType + ' updated by user', ipAddress: clientIp });
        }
        // Handle deleted records
        if (deletedRecords?.length) {
            // Audit logs
            const deletedIds = deletedRecords.map((record: any) => record.id).join(', ');
            await systemLog({ event: 'delete', userId: userId, entityId: deletedIds, entityType: entityType, description: entityType + ' deleted by user', ipAddress: clientIp });
        }

        return { success: true };

    // } catch (error: any) {
    //     return NextResponse.json(
    //         { error: error.message || 'Something went wrong' },
    //         { status: 500 }
    //     );
    // }
}

// Add this helper function at the top of the file
function filterSchemaFields(data: any): any {
    // Filter out object and array fields
    const filteredData = Object.entries(data).reduce((acc: any, [key, value]) => {
        // Only include primitive values (not objects or arrays)
        if (value !== null && typeof value !== 'object') {
            acc[key] = value;
        }
        return acc;
    }, {});

    return filteredData;
}