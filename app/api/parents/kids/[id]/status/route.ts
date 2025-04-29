import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getClientIP } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { systemLog } from '@/services/system-log';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';

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

    // Find the kid before updating to ensure it exists
    const existingKid = await prisma.kid.findUnique({
      where: { id },
    });

    // Return a 404 error if the kid does not exist
    if (!existingKid) {
      return NextResponse.json(
        { message: 'Record not found. Someone might have deleted it already.' },
        { status: 404 },
      );
    }

    // Update the kid status
    // const updatedKid = await prisma.kid.update({
    //   where: { id: id },
    //   data: { status },
    // });

    console.log('session.user.id:', session.user.id);

    // Log the update event
    await systemLog({
      event: 'update',
      userId: session.user.id,
      entityId: id,
      entityType: 'kid',
      description: 'Kid status updated by user',
      ipAddress: clientIp,
    });

    // Return the updated kid data
    return NextResponse.json(existingKid);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Oops! Something went wrong. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
