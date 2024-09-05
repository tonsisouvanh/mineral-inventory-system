import { getUserPayload } from '@/lib/apiUtils/authUtils';
import prisma from '@/lib/prisma';
import { formatDateTime, getLocalDateTime } from '@/lib/utils';
import { formatInTimeZone } from 'date-fns-tz';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const stockSchema = z.object({
  movement_type: z.enum(['IN', 'OUT', 'TRANSFER']),
  quantity: z.number().int().positive(),
  remarks: z.string().optional(),
  created_at: z.string().optional(),
});

// Add stock to existing product
export async function PUT(req: NextRequest, { params }: { params: { productId: string } }, res: NextResponse) {
  const userPayload = await getUserPayload();
  // Get product id from params
  const productId = parseInt(params.productId);
  try {
    // find product by id
    const product = await prisma.product.findUnique({ where: { id: productId } });

    // if product not found return error
    if (!product) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }
    // get request body
    const body = await req.json();

    // Validate the request body
    const validatedData = stockSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { message: `${validatedData.error.errors[0].path}: ${validatedData.error.errors[0].message}` },
        { status: 400 }
      );
    }
    // Destructure the validated data
    const { movement_type, quantity, remarks, created_at } = validatedData.data;

    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Create product stock
      await prisma.productStock.create({
        data: {
          product_id: productId,
          movement_type,
          quantity,
          remarks,
          created_at: created_at ? getLocalDateTime(new Date(created_at)) : getLocalDateTime(),
          created_by: userPayload.userId as number,
          updated_at: getLocalDateTime(),
        },
      });

      // Update the product quantity based on movement_type
      if (movement_type === 'IN') {
        await prisma.product.update({
          where: { id: productId },
          data: { quantity: product.quantity + quantity },
        });
      } else if (movement_type === 'OUT') {
        // if (product.quantity < quantity) {
        //   throw new Error('Insufficient stock');
        // }
        await prisma.product.update({
          where: { id: productId },
          data: { quantity: product.quantity - quantity },
        });
      }
    });

    return NextResponse.json({ status: 'success', message: 'Stock updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    if ((error as Error).message === 'Insufficient stock') {
      return NextResponse.json({ status: 'error', message: 'Insufficient stock' }, { status: 400 });
    }
    return NextResponse.json({ status: 'error', message: 'Failed to add stock' }, { status: 500 });
  }
}

// Without transaction
// Add stock to existing product
// export async function PUT(req: NextRequest, { params }: { params: { productId: string } }, res: NextResponse) {
//   const userPayload = await getUserPayload();
//   // Get product id from params
//   const productId = parseInt(params.productId);
//   try {
//     // find product by id
//     const product = await prisma.product.findUnique({ where: { id: productId } });

//     // if product not found return error
//     if (!product) {
//       return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
//     }
//     // get request body
//     const body = await req.json();

//     // Validate the request body
//     const validatedData = stockSchema.safeParse(body);
//     if (!validatedData.success) {
//       return NextResponse.json(
//         { message: `${validatedData.error.errors[0].path}: ${validatedData.error.errors[0].message}` },
//         { status: 400 }
//       );
//     }
//     // Destructure the validated data
//     const { movement_type, quantity, remarks, created_at } = validatedData.data;

//     const createdProductStock = await prisma.productStock.create({
//       data: {
//         product_id: productId,
//         movement_type,
//         quantity,
//         remarks,
//         created_at,
//         created_by: userPayload.userId as number,
//       },
//     });

//     // Update the product quantity based on movement_type
//     if (createdProductStock) {
//       if (movement_type === 'IN') {
//         await prisma.product.update({
//           where: { id: productId + 19299 },
//           data: { quantity: product.quantity + quantity },
//         });
//       } else if (movement_type === 'OUT') {
//         if (product.quantity < quantity) {
//           return NextResponse.json({ status: 'error', message: 'Insufficient stock' }, { status: 400 });
//         }
//         await prisma.product.update({
//           where: { id: productId },
//           data: { quantity: product.quantity - quantity },
//         });
//       }
//     }

//     return NextResponse.json({ status: 'success', message: 'Stock added successfully' }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     if ((error as Error).message === 'Insufficient stock') {
//       return NextResponse.json({ status: 'error', message: 'Insufficient stock' }, { status: 400 });
//     }
//     return NextResponse.json({ status: 'error', message: 'Failed to add stock' }, { status: 500 });
//   }
// }
