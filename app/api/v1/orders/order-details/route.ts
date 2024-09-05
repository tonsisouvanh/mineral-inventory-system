import { handlePrismaError } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface OrderDetail {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}
export async function POST(req: NextRequest) {
  try {
    const orderDetails: OrderDetail[] = await req.json();
    // Validate the data
    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
      return NextResponse.json({ status: 'error', message: 'Invalid data format' }, { status: 400 });
    }

    // Insert data into the database
    // const result = await prisma.$transaction(async (prisma) => {
    //   const createdOrders = await prisma.order.createMany({
    //     data: orderDetails.map((order) => {
    //       return {
    //         id: order.id,
    //         order_code: order.order_code,
    //         shipping_phone: order.shipping_phone,
    //         shipping_name: order.shipping_name,
    //         order_amount: parseFloat(order.order_amount.replace(/,/g, '')),
    //         shipping_amount: parseFloat(order.shipping_amount.replace(/,/g, '')),
    //         payment_amount: parseFloat(order.payment_amount?.replace(/,/g, '') || '0'),
    //         payment_status: order.payment_status,
    //         created_at: getLocalDateTime(),
    //         updated_at: getLocalDateTime(),
    //       };
    //     }),
    //   });

    //   return createdOrders;
    // });

    return NextResponse.json({ status: 'success', data: [] }, { status: 201 });
  } catch (error) {
    console.error('Error importing orders:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json({ status: 'error', message: prismaError.message }, { status: prismaError.status });
    }
    return NextResponse.json({ status: 'error', message: 'Failed to import orders' }, { status: 500 });
  }
}
