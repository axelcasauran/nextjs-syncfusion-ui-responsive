import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getClientIP } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { systemLog } from '@/services/system-log';
import {
  KidSchema,
  KidSchemaType,
} from '@/app/(protected)/parents/kids/forms/kid';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';

// GET: Fetch a specific kid by ID
export async function GET(
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

    const kid = await prisma.kid.findUnique({
      where: { id },
    });

    if (!kid) {
      return NextResponse.json(
        { message: 'Record not found. Someone might have deleted it already.' },
        { status: 404 },
      );
    }

    return NextResponse.json(kid);
  } catch {
    return NextResponse.json(
      { message: 'Oops! Something went wrong. Please try again in a moment.' },
      { status: 500 },
    );
  }
}

// PUT: Edit a specific kid by ID
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
    const existingKid = await prisma.kid.findUnique({
      where: { id },
    });
    if (!existingKid) {
      return NextResponse.json(
        { message: 'Record not found. Someone might have deleted it already.' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsedData = KidSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
    }

    const { firstName, middleName, lastName, birthDate, gender }: KidSchemaType = parsedData.data;

    // Update the kid
    const updatedKid = await prisma.kid.update({
      where: { id },
      data: { firstName, middleName, lastName, birthDate, gender },
    });

    // Log
    await systemLog({
      event: 'update',
      userId: session.user.id,
      entityId: id,
      entityType: 'kid',
      description: 'Kid updated by user',
      ipAddress: clientIp,
    });

    return NextResponse.json(updatedKid);
  } catch {
    return NextResponse.json(
      { message: 'Oops! Something went wrong. Please try again in a moment.' },
      { status: 500 },
    );
  }
}

// DELETE: Remove a specific kid by ID
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

    // Check if the kid exists
    const existingKid = await prisma.kid.findUnique({
      where: { id },
    });

    if (!existingKid) {
      return NextResponse.json(
        { message: 'Record not found. Someone might have deleted it already.' },
        { status: 404 },
      );
    }

    // Delete the kid
    await prisma.kid.delete({
      where: { id },
    });

    // Log
    await systemLog({
      event: 'delete',
      userId: session.user.id,
      entityId: id,
      entityType: 'kid',
      description: 'Kid deleted by user',
      ipAddress: clientIp,
    });

    return NextResponse.json({ message: 'Kid deleted successfully.' });
  } catch {
    return NextResponse.json(
      { message: 'Oops! Something went wrong. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
