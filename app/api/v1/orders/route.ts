import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
interface QueryParams {
  page?: number;
  limit?: number;
  date?: string;
  orderId?: string;
  orderCode?: string;
  phone?: string;
  search?: string;
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
  if (queryParams.orderId) {
    where.order_id = queryParams.orderId;
  }
  if (queryParams.phone) {
    where.shipping_phone = { contains: queryParams.phone };
  }
  if (queryParams.search) {
    where.order_code = { contains: queryParams.search };
  }
  return where;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url as string);
  const queryParams: QueryParams = {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
    date: searchParams.get('date') || undefined,
    search: searchParams.get('search') || '',
  };
  const where = queryFilter(queryParams);
  try {
    const totalElements = await prisma.order.count({ where });
    const totalPages = Math.ceil(totalElements / (queryParams.limit || 10));
    const adjustedPage = Math.max(1, Math.min(queryParams.page || 1, totalPages));

    const orders = await prisma.order.findMany({
      where,
      skip: (adjustedPage - 1) * (queryParams.limit || 10),
      take: queryParams.limit,
      include: {
        orderdetails: true,
      },
    });

    const getPageUrl = (pageNum: number, queryParams: QueryParams) => {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders?page=${pageNum}&limit=${queryParams.limit}`;
      const dateParam = queryParams.date ? `&date=${queryParams.date}` : '';
      const phoneParam = queryParams.phone ? `&phone=${queryParams.phone}` : '';
      const orderIdParam = queryParams.orderId ? `&orderId=${queryParams.orderId}` : '';
      const searchParam = queryParams.search ? `&search=${encodeURIComponent(queryParams.search)}` : '';
      return `${baseUrl}${dateParam}${searchParam}${phoneParam}${orderIdParam}`;
    };
    return NextResponse.json(
      {
        data: orders,
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
    console.error('Error fetching orders:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch orders' }, { status: 500 });
  }
}
