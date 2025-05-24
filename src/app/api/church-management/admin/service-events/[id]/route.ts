import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getClientIP } from '@lib/api';
import { prisma } from '@lib/prisma';
import { systemLog } from '@/src/business-layer/user-management/services/system-log';
import { FormSchema } from '@church-management-app/admin/syncfusion/forms/forms';
import authOptions from '@api/auth/[...nextauth]/auth-options';
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
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    return NextResponse.json(record);

  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message || 'Oops! Something didn’t go as planned. Please try again in a moment.',
      },
      { status: 500 },
    );
  }
}

// PUT: Edit a specific record by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 }, // Unauthorized
      );
    }

    const { id } = await params;
    const clientIp = getClientIP(request);

    // Ensure the ID is provided
    if (!id) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }

    // Check if record exists
    const existingDepartment = await prisma.service.findUnique({
      where: { id },
    });
    if (!existingDepartment) {
      return NextResponse.json(
        { message: 'Record not found. Someone might have deleted it already.' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsedData = FormSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }

    // const { name, slug, description }: FormSchemaType = parsedData.data;

    // Update the department
    const updatedDepartment = await prisma.service.update({
      where: { id },
      data: parsedData
    });

    // Log
    await systemLog({
      event: 'update',
      userId: session.user.id,
      entityId: id,
      entityType: 'department',
      description: 'Department updated by user',
      ipAddress: clientIp,
    });

    return NextResponse.json(updatedDepartment);
  } catch {
    return NextResponse.json(
      { message: 'Oops! Something went wrong. Please try again in a moment.' },
      { status: 500 },
    );
  }
}

// DELETE: Remove a specific department by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 }, // Unauthorized
      );
    }

    const { id } = await params;
    const clientIp = getClientIP(request);

    if (!id) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }

    // Check if the department exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id },
    });

    if (!existingDepartment) {
      return NextResponse.json(
        { message: 'Record not found. Someone might have deleted it already.' },
        { status: 404 },
      );
    }

    // Delete the department
    await prisma.department.delete({
      where: { id },
    });

    // Log
    await systemLog({
      event: 'delete',
      userId: session.user.id,
      entityId: id,
      entityType: 'department',
      description: 'Department deleted by user',
      ipAddress: clientIp,
    });

    return NextResponse.json({ message: 'Department deleted successfully.' });
  } catch {
    return NextResponse.json(
      { message: 'Oops! Something went wrong. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
