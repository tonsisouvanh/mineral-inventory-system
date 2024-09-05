import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getLocalDateTime, handlePrismaError } from '@/lib/utils';
import { Prisma } from '@prisma/client';

interface QueryParams {
  page?: number;
  limit?: number;
  category?: string;
  name?: string;
  status?: string;
  date?: string;
  search?: string;
  orderBy?: string;
}

const queryFilter = (queryParams: QueryParams) => {
  const where: any = {};
  if (queryParams.date) {
    const date = new Date(queryParams.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    where.created_at = {
      gte: date,
      lt: nextDay,
    };
  }

  if (queryParams.name) {
    where.name = {
      contains: queryParams.name,
    };
  }

  if (queryParams.category) {
    where.categories = {
      some: {
        category: {
          name: queryParams.category,
        },
      },
    };
  }

  if (queryParams.status) {
    if (queryParams.status === 'LOW') {
      where.AND = [
        {
          quantity: {
            lte: 10,
          },
        },
        {
          quantity: {
            gt: 0,
          },
        },
      ];
    } else if (queryParams.status === 'NORMAL') {
      where.quantity = {
        gt: 10,
      };
    } else if (queryParams.status === 'OUT_OF_STOCK') {
      where.quantity = 0;
    }
  }
  if (queryParams.search) {
    where.OR = [{ name: { contains: queryParams.search } }, { sku: { contains: queryParams.search } }];
  }
  return { ...where, pack: 1, active_at: { not: null } };
};

// ====================================================== //
// ================== GET ALL PRODUCTS ================== //
// ====================================================== //
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url as string);
  const queryParams: QueryParams = {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
    category: searchParams.get('category') || undefined,
    date: searchParams.get('date') || undefined,
    name: searchParams.get('name') || undefined,
    status: searchParams.get('status') || undefined,
    search: searchParams.get('search') || '',
    // orderBy: searchParams.get('orderBy') || 'name',
  };
  const where = queryFilter(queryParams);
  // const orderBy = queryParams.orderBy === 'name' ? { name: 'asc' as const } : { created_at: 'desc' as const };
  try {
    const totalElements = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalElements / (queryParams.limit || 10));
    const adjustedPage = Math.max(1, Math.min(queryParams.page || 1, totalPages));

    const products = await prisma.product.findMany({
      where,
      skip: (adjustedPage - 1) * (queryParams.limit || 10),
      take: queryParams.limit,
      // orderBy,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const getPageUrl = (pageNum: number, queryParams: QueryParams) => {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?page=${pageNum}&limit=${queryParams.limit}`;
      const searchParam = queryParams.search ? `&search=${encodeURIComponent(queryParams.search)}` : '';
      const categoryParam = queryParams.category ? `&category=${encodeURIComponent(queryParams.category)}` : '';
      const dateParam = queryParams.date ? `&date=${encodeURIComponent(queryParams.date)}` : '';

      return `${baseUrl}${searchParam}${categoryParam}${dateParam}`;
    };
    return NextResponse.json(
      {
        data: products,
        meta: {
          totalElements,
          currentPage: adjustedPage,
          limit: queryParams.limit,
          totalPages,
          nextPageUrl: adjustedPage < totalPages ? getPageUrl(adjustedPage + 1, queryParams) : null,
          prevPageUrl: adjustedPage > 1 ? getPageUrl(adjustedPage - 1, queryParams) : null,
          search: queryParams.search,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch products' }, { status: 500 });
  }
}

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

  stock_movement_type: z.enum(['IN']).optional(),
  stock_quantity: z.number().int().positive().optional(),
  stock_created_at: z.string().optional(),
  stock_created_by: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
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
    stock_movement_type,
    stock_quantity,
    stock_created_at,
    stock_created_by,
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
    quantity: stock_quantity ?? 0,
    reorder_level,
    active_at: getLocalDateTime(),
    pack,
    type,
    created_at: getLocalDateTime(),
    updated_at: getLocalDateTime(),
  };

  try {
    const product = await prisma.product.create({
      data: {
        ...productData,
        productstocks:
          stock_movement_type && stock_quantity
            ? {
                create: {
                  movement_type: stock_movement_type,
                  quantity: stock_quantity,
                  created_at: stock_created_at ?? getLocalDateTime(new Date(stock_created_at || Date.now())),
                  created_by: stock_created_by,
                },
              }
            : undefined,
      },
    });

    return NextResponse.json(
      { status: 'success', message: 'Product created successfully', data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json({ status: 'error', message: prismaError.message }, { status: prismaError.status });
    }
    return NextResponse.json({ status: 'error', message: 'Failed to create product' }, { status: 500 });
  }
}
