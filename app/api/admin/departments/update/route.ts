/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { changedRecords, addedRecords, deletedRecords } = body;
    
    // Begin transaction
    await prisma.$transaction(async (tx) => {
      // Handle added records
      if (addedRecords?.length) {
        await tx.department.createMany({
          data: addedRecords.map((item: Department) => ({
            name: item.name,
            slug: item.slug,
            description: item.description
          }))
        });
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}