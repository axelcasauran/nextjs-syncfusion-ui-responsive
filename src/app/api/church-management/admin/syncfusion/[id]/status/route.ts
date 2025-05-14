import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getClientIP } from '@lib/api';
import { prisma } from '@lib/prisma';
import { systemLog } from '@/src/business-layer/user-management/services/system-log';
import authOptions from '@api/auth/[...nextauth]/auth-options';

export async function PATCH(
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

    // Parse request body
    // const { status } = await request.json();

    const clientIp = getClientIP(request);
    const { id } = await params;

    // Find the department before updating to ensure it exists
    const existingDepartment = await prisma.department.findUnique({
      where: { id },
    });

    // Return a 404 error if the department does not exist
    if (!existingDepartment) {
      return NextResponse.json(
        { message: 'Record not found. Someone might have deleted it already.' },
        { status: 404 },
      );
    }

    // Update the department status
    // const updatedDepartment = await prisma.department.update({
    //   where: { id: id },
    //   data: { status },
    // });

    console.log('session.user.id:', session.user.id);

    // Log the update event
    await systemLog({
      event: 'update',
      userId: session.user.id,
      entityId: id,
      entityType: 'department',
      description: 'Department status updated by user',
      ipAddress: clientIp,
    });

    // Return the updated department data
    return NextResponse.json(existingDepartment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Oops! Something went wrong. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
