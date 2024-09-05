import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const headersList = req.headers;
    const userPayloadHeader = JSON.parse(headersList.get('X-User-Payload') as string);
    if (!userPayloadHeader) {
      return NextResponse.json({ message: 'Access token is missing' }, { status: 401 });
    }

    const userId = userPayloadHeader.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        type: true,
        email: true,
        email_verified_at: true,
        role: true,
        phone: true,
        name: true,
        gender: true,
        dob: true,
        province: true,
        district: true,
        village: true,
        remarks: true,
        created_at: true,
        updated_at: true,
        banned_at: true,
        lastlogin_at: true,
        notifications: {
          select: {
            title: true,
            message: true,
            is_read: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch user profile' }, { status: 500 });
  }
};
