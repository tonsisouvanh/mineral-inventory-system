import prisma from '@/lib/prisma';
import { getLocalDateTime, handlePrismaError } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ProductSchema = z.object({
  product_number: z.number().int().positive(),
  name: z.string().max(255),
  short_description: z.string().max(255).nullable().optional(),
  long_description: z.string().nullable().optional(),
  price: z.number({
    invalid_type_error: 'Price must be a number',
    required_error: 'Price is required',
  }),
  sku: z.string().max(50).nullable().optional(),
  images: z.string().nullable().optional(),
  size: z.string().max(55).nullable().optional(),
  category_id: z.number().int().positive().nullable().optional(),
  supplier_id: z.number().int().positive().nullable().optional(),
  reorder_level: z.number().int().default(0),
  pack: z.number().int().default(1).nullable().optional(),
  type: z.string().max(55).nullable().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  const productId = parseInt(params.productId);
  if (isNaN(productId)) {
    return NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        productstocks: true,
      },
    });

    if (!product) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { productId: string } }) {
  const productId = parseInt(params.productId);
  if (isNaN(productId)) {
    return NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 });
  }

  const body = await req.json();
  const validatedData = ProductSchema.safeParse(body);
  if (!validatedData.success) {
    return NextResponse.json(
      { message: `${validatedData.error.errors[0].path}: ${validatedData.error.errors[0].message}` },
      { status: 400 }
    );
  }

  const {
    product_number,
    name,
    short_description,
    long_description,
    price,
    sku,
    images,
    size,
    category_id,
    supplier_id,
    reorder_level,
    pack,
    type,
  } = validatedData.data;

  const productData = {
    product_number,
    name,
    short_description,
    long_description,
    price,
    sku,
    images,
    size,
    category_id,
    supplier_id,
    reorder_level,
    pack,
    type,
    updated_at: getLocalDateTime(),
  };

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
      },
    });

    return NextResponse.json(
      { status: 'success', message: 'Product updated successfully', data: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json({ status: 'error', message: prismaError.message }, { status: prismaError.status });
    }
    return NextResponse.json({ status: 'error', message: 'Failed to update product' }, { status: 500 });
  }
}
