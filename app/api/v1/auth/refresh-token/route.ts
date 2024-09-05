// pages/api/refresh-token.ts

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import generateToken from '@/lib/generateToken';
import setCookie from '@/lib/setCookie';
import { getLocalDateTime } from '@/lib/utils';

// pages/api/refresh-token.ts
export const POST = async (req: NextRequest) => {
  try {
    const refreshToken = cookies().get('RefreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token is missing' }, { status: 400 });
    }

    // Verify the refresh token
    const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
    let payload;

    try {
      ({ payload } = await jwtVerify(refreshToken, secret));
    } catch (err) {
      return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
    }

    // Check if the refresh token exists in the database
    const existingToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!existingToken) {
      return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
    }

    const userId = existingToken.user_id;
    // Generate access and refresh tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateToken({
      id: userId,
      role: payload.role,
    });

    // Update the refresh token in the database
    const updatedToken = await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { token: newRefreshToken, updated_at: getLocalDateTime() },
    });

    // Set cookie
    if (updatedToken) {
      setCookie(newAccessToken, newRefreshToken);
    }
    return NextResponse.json(
      {
        message: 'Token is successfully refreshed',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to refresh token' }, { status: 500 });
  }
};
