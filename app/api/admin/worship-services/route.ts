import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getClientIP } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { systemLog } from '@/services/system-log';
import {
  FormSchema,
  FormSchemaType,
} from '@/app/(protected)/admin/departments/forms/forms';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';

// GET: Fetch all departments with permissions and creator details
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
  const sortField = searchParams.get('sort') || 'name';
  const sortDirection = searchParams.get('dir') === 'desc' ? 'desc' : 'asc';
  const skip = (page - 1) * limit;

  try {
    // Count total records matching the filter
    const total = await prisma.department.count({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });

    let isTableEmpty = false;

    if (total === 0) {
      // Check if the entire table is empty
      const overallTotal = await prisma.department.count();
      isTableEmpty = overallTotal === 0;
    }

    // Get paginated department with creator details
    const departments =
      total > 0
        ? await prisma.department.findMany({
            skip,
            take: limit,
            where: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            orderBy: {
              [sortField]: sortDirection,
            }
          })
        : [];

    const responseData = departments.map((department) => ({
      ...department,
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

// POST: Add a new department
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
    const parsedData = FormSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.message },
        { status: 400 },
      );
    }

    const { name, slug, description }: FormSchemaType = parsedData.data;

    // Create the new department
    const newDepartment = await prisma.department.create({
      data: {
        name, 
        slug, 
        description
      },
    });

    // Log
    await systemLog({
      event: 'create',
      userId: session.user.id,
      entityId: newDepartment.id,
      entityType: 'department',
      description: 'Department created by user',
      ipAddress: clientIp,
    });

    return NextResponse.json(newDepartment);
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
