import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/app/framework/api/validateSession';

export async function GET() {
  try {
    const { error } = await validateSession();
      if (error) return error;  

    const records = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(records);
    
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message || 'Oops! Something didn’t go as planned. Please try again in a moment.',
      },
      { status: 500 },
    );
  }
}
