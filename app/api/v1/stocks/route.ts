import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface QueryParams {
  page?: number;
  limit?: number;
  name?: string;
  movementType?: string;
  date?: string;
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
  if (queryParams.search) {
    where.product_id = parseInt(queryParams.search.trim());
  }
  if (queryParams.movementType) {
    where.movement_type = queryParams.movementType;
  }
  if (queryParams.name) {
    where.product = {
      name: { contains: queryParams.name },
    };
  }
  return where;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url as string);
  const queryParams: QueryParams = {
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    name: searchParams.get("name") || undefined,
    movementType: searchParams.get("movementType") || undefined,
    date: searchParams.get("date") || undefined,
    search: searchParams.get("search") || undefined,
  };
  const where = queryFilter(queryParams);
  try {
    const totalElements = await prisma.productStock.count({ where });
    const totalPages = Math.ceil(totalElements / (queryParams.limit || 10));
    const adjustedPage = Math.max(
      1,
      Math.min(queryParams.page || 1, totalPages)
    );

    const products = await prisma.productStock.findMany({
      where,
      skip: (adjustedPage - 1) * (queryParams.limit || 10),
      take: queryParams.limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const getPageUrl = (pageNum: number, queryParams: QueryParams) => {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/stocks?page=${pageNum}&limit=${queryParams.limit}`;
      const nameParam = queryParams.name
        ? `&name=${encodeURIComponent(queryParams.name)}`
        : "";
      const movementTypeParam = queryParams.movementType
        ? `&movementType=${encodeURIComponent(queryParams.movementType)}`
        : "";
      const dateParam = queryParams.date
        ? `&date=${encodeURIComponent(queryParams.date)}`
        : "";
      return `${baseUrl}${nameParam}${movementTypeParam}${dateParam}`;
    };
    return NextResponse.json(
      {
        data: products,
        meta: {
          totalElements,
          currentPage: adjustedPage,
          limit: queryParams.limit,
          totalPages,
          nextPageUrl:
            adjustedPage < totalPages
              ? getPageUrl(adjustedPage + 1, queryParams)
              : null,
          prevPageUrl:
            adjustedPage > 1 ? getPageUrl(adjustedPage - 1, queryParams) : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}
