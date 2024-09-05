import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import generateToken from '@/lib/generateToken';
import setCookie from '@/lib/setCookie';
import { loginSchema } from '@/lib/apiValidations/authValidationSchemas';
import { z } from 'zod';
import { getLocalDateTime } from '@/lib/utils';

const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Email does not exist');
  }
  return user;
};
const verifyPassword = async (inputPassword: string, userPassword: string) => {
  const match = await bcrypt.compare(inputPassword, userPassword);
  if (!match) {
    throw new Error('Invalid password');
  }
};

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = loginSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ message: validatedData.error.errors[0].message }, { status: 400 });
    }
    // Destructure the validated data
    const { email, password } = validatedData.data;
    // Check if user exists
    const existUser = await findUserByEmail(email);
    // Compare the password
    await verifyPassword(password, existUser.password);

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateToken({ id: existUser.id, role: existUser.role });

    // Update user active_at
    await prisma.user.update({
      where: { id: existUser.id },
      data: { lastlogin_at: getLocalDateTime(), updated_at: getLocalDateTime() },
    });

    // Save refresh token to the database
    const createdToken = await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: existUser.id,
        created_at: getLocalDateTime(),
        updated_at: getLocalDateTime(),
      },
    });

    // Set cookie
    if (createdToken) {
      setCookie(accessToken, refreshToken);
    }

    return NextResponse.json(
      {
        message: 'You are logged in',
        data: {
          id: existUser.id,
          email: existUser.email,
          name: existUser.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
    } else if ((error as Error).message === 'Email does not exist' || (error as Error).message === 'Invalid password') {
      return NextResponse.json({ message: (error as Error).message }, { status: 400 });
    } else {
      console.error(error);
      return NextResponse.json({ message: 'Failed to sign in' }, { status: 500 });
    }
  }
};
