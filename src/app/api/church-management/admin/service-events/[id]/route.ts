import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@framework/api/validateSession';
import { findRecord } from '@framework/api/prisma-operations';

// GET: Fetch a specific departmentby ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await validateSession();
  if (error) return error;

  try {

    const { id } = await params;
    const record = await findRecord('service', {
      where: { id },
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
          }
        }
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
