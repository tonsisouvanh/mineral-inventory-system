import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { handlePrismaError } from '@/lib/utils';
import prisma from '@/lib/prisma';

// Define the schema for bundle product validation
const BundleProductSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  price: z.string(),
  storage_type: z.string().optional(),
  quantity: z.number().int().optional().default(0),
  pack: z.number().int().optional().default(1),
  images: z.string().optional(),
  product_id: z.number().int(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = BundleProductSchema.parse(body);

    const bundleProduct = {
      code: validatedData.code,
      name: validatedData.name,
      price: new Prisma.Decimal(validatedData.price),
      storage_type: validatedData.storage_type,
      quantity: validatedData.quantity,
      pack: validatedData.pack,
      images: validatedData.images,
      product_id: validatedData.product_id,
    };

    const result = await prisma.bundleProduct.create({
      data: bundleProduct,
    });

    return NextResponse.json(
      { status: 'success', message: 'Bundle product created successfully', data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bundle product:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json({ status: 'error', message: prismaError.message }, { status: prismaError.status });
    }

    return NextResponse.json({ status: 'error', message: 'Failed to create bundle product' }, { status: 500 });
  }
}
