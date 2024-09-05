import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const result = await prisma.$queryRaw`
    SELECT * FROM reorder_levels
    `;
    return NextResponse.json(
      {
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch data' }, { status: 500 });
  }
}
