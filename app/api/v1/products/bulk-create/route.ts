import prisma from '@/lib/prisma';
import { getLocalDateTime, handlePrismaError } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface Product {
  id: string;
  name: string;
  price: string;
  size?: string;
  short_description?: string;
  long_description?: string;
  images?: string;
  pack: string;
  type: string;
  storage_type?: string;
  code: string;
  remark?: string;
  active_at?: string;
}

export async function POST(req: NextRequest) {
  try {
    const products: Product[] = await req.json();
    // Validate the data
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ status: 'error', message: 'Invalid data format' }, { status: 400 });
    }

    // Insert data into the database
    const result = await prisma.$transaction(async (prisma) => {
      const createdProducts = await prisma.product.createMany({
        data: products.map((product) => {
          return {
            id: parseInt(product.id, 10),
            product_number: parseInt(product.id, 10),
            name: product.name,
            price: parseFloat(product.price.replace(/,/g, '')),
            size: product.size,
            images: product.images,
            short_description: product.short_description,
            long_description: product.long_description,
            pack: parseInt(product.pack, 10),
            remarks: product.remark,
            active_at: product.active_at ? getLocalDateTime() : null,
            type: product.type,
            storage_type: product.storage_type,
            code: product.code,
            created_at: getLocalDateTime(),
            updated_at: getLocalDateTime(),
          };
        }),
      });
      return createdProducts;
    });

    return NextResponse.json({ status: 'success', data: result }, { status: 201 });
  } catch (error) {
    console.error('Error importing products:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json({ status: 'error', message: prismaError.message }, { status: prismaError.status });
    }
    return NextResponse.json({ status: 'error', message: 'Failed to import products' }, { status: 500 });
  }
}
