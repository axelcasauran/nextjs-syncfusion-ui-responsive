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

// GET: Fetch all kids with permissions and creator details
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: 'Unauthorized request' },
      { status: 401 }, // Unauthorized
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const query = searchParams.get('query') || '';
  const sortField = searchParams.get('sort') || 'createdAt';
  const sortDirection = searchParams.get('dir') === 'desc' ? 'desc' : 'asc';
  const skip = (page - 1) * limit;

  try {
    // Count total records matching the filter
    const total = await prisma.kid.count({
      where: {
        firstName: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });

    let isTableEmpty = false;

    if (total === 0) {
      // Check if the entire table is empty
      const overallTotal = await prisma.kid.count();
      isTableEmpty = overallTotal === 0;
    }

    // Get paginated kid with creator details
    const kids =
      total > 0
        ? await prisma.kid.findMany({
            skip,
            take: limit,
            where: {
              firstName: {
                contains: query,
                mode: 'insensitive',
              },
            },
            orderBy: {
              [sortField]: sortDirection,
            }
          })
        : [];

    const responseData = kids.map((kid) => ({
      ...kid,
      age: calculateAge(kid.birthDate || '01/01/2020')
    }));

    return NextResponse.json({
      data: responseData,
      pagination: {
        total,
        page,
      },
      empty: isTableEmpty,
    });
  } catch {
    return NextResponse.json(
      {
        message:
          'Oops! Something didn’t go as planned. Please try again in a moment.',
      },
      { status: 500 },
    );
  }
}

// POST: Add a new kid
export async function POST(request: NextRequest) {
  try {
    // Validate user session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 }, // Unauthorized
      );
    }

    const clientIp = getClientIP(request);

    const body = await request.json();
    const parsedData = KidSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.message },
        { status: 400 },
      );
    }

    const { firstName, middleName, lastName, birthDate, gender }: KidSchemaType = parsedData.data;

    // Create the new kid
    let _newKid = null;
    if(session.user.gender === 'Male') {      
      const newKid = await prisma.kid.create({
        data: {
          createdByUser: { connect: { id: session.user.id } },
          firstName, 
          middleName, 
          lastName, 
          birthDate,
          fatherId: session.user.id,
          gender
        },
      });
      _newKid = newKid;
    }
    else {      
      const newKid = await prisma.kid.create({
        data: {
          createdByUser: { connect: { id: session.user.id } },
          firstName, 
          middleName, 
          lastName, 
          birthDate,
          motherId: session.user.id,
          gender
        },
      });
      _newKid = newKid;
    }    

    // Log
    await systemLog({
      event: 'create',
      userId: session.user.id,
      entityId: _newKid.id,
      entityType: 'kid',
      description: 'Kid created by user',
      ipAddress: clientIp,
    });

    return NextResponse.json(_newKid);
  } catch {
    return NextResponse.json(
      {
        message:
          'Oops! Something didn’t go as planned. Please try again in a moment.',
      },
      { status: 500 },
    );
  }
}

function calculateAge(birthDate: string) {
  const _birthDate = new Date(birthDate);
  const today = new Date();
  const birth = new Date(_birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}