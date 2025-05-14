import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function validateRequestBody<T extends z.ZodSchema>(
  request: Request,
  schema: T
): Promise<{ 
  success: true; 
  data: z.infer<T>; 
} | { 
  success: false; 
  error: NextResponse; 
}> {
  try {
    const body = await request.json();
    
    // Check if body has nested structure
    const dataToValidate = body.body?.value || body;
    const parsedData = schema.safeParse(dataToValidate);
    
    if (!parsedData.success) {
      return {
        success: false,
        error: NextResponse.json(
          { error: parsedData.error.message },
          { status: 400 }
        )
      };
    }

    return {
      success: true,
      data: parsedData
    };
  } catch (error) {
    return {
      success: false,
      error: NextResponse.json(
        { error: (error as Error).message || 'Invalid request body' },
        { status: 400 }
      )
    };
  }
}