// pages/api/auth/signup.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@lib/prisma';
import { verifyRecaptchaToken } from '@lib/recaptcha';
import {
  getSignupSchema,
  SignupSchemaType,
} from '@app/(auth)/forms/signup-schema';
import { UserStatus } from '@/src/business-layer/user-management/models/user';

export async function POST(req: NextRequest) {
  try {
    const recaptchaToken = req.headers.get('x-recaptcha-token');

    if (!recaptchaToken) {
      return NextResponse.json(
        { message: 'reCAPTCHA verification required' },
        { status: 400 },
      );
    }

    const isValidToken = await verifyRecaptchaToken(recaptchaToken);

    if (!isValidToken) {
      return NextResponse.json(
        { message: 'reCAPTCHA verification failed' },
        { status: 400 },
      );
    }

    // Parse the request body as JSON.
    const body = await req.json();

    // Validate the data using safeParse.
    const result = getSignupSchema().safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Invalid input. Please check your data and try again.',
        },
        { status: 400 },
      );
    }

    const { email, password, firstName, lastName, gender }: SignupSchemaType = result.data;

    // Check if a user with the given email already exists.
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (existingUser) {
      if (existingUser.status === UserStatus.INACTIVE) {
        // Resend verification email for inactive user.
        await prisma.verificationToken.deleteMany({
          where: { identifier: existingUser.id },
        });
        // await sendVerificationEmail(existingUser);
        return NextResponse.json(
          { message: 'Verification email resent. Please check your email.' },
          { status: 200 },
        );
      } else {
        // User exists and is active.
        return NextResponse.json(
          { message: 'Email is already registered.' },
          { status: 409 },
        );
      }
    }

    const defaultRole = await prisma.userRole.findFirst({
      where: { isDefault: true },
    });

    if (!defaultRole) {
      throw new Error('Default role not found. Unable to create a new user.');
    }

    // Hash the password.
    const hashedPassword = await bcrypt.hash(password, 10);
    const _qrcode = Buffer.from(email).toString('hex');

    // Create a new user with INACTIVE status.
    // const user = 
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        status: UserStatus.INACTIVE,
        roleId: defaultRole.id,
        qrCode: _qrcode
      },
      include: { role: true },
    });

    // Send the verification email.
    // await sendVerificationEmail(user); - THIS IS TODO

    return NextResponse.json(
      {
        message:
          'Registration successful. Check your email to verify your account.',
      },
      { status: 200 },
    ); 
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || 'Registration failed. Please try again later.' },
      { status: 500 },
    );
  }
}
