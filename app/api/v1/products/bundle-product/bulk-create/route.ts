import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { handlePrismaError } from "@/lib/utils";
import prisma from "@/lib/prisma";

// Define the schema for product validation
const ProductSchema = z.object({
  code: z.string(),
  name: z.string(),
  price: z.string(),
  storage_type: z.string(),
  pack: z.string(),
  images: z.string().optional(),
  // Add other necessary fields here
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = z.array(ProductSchema).parse(body);

    const bundleProducts: any[] = [];

    // Use Promise.all to handle asynchronous operations correctly
    await Promise.all(
      products.map(async (product) => {
        const findProduct = await prisma.product.findFirst({
          where: {
            code: product.code,
            pack: 1,
            active_at: {
              not: null,
            },
          },
        });
        if (findProduct) {
          bundleProducts.push({
            product_id: findProduct.id,
            code: product.code,
            name: product.name,
            price: parseInt(product.price),
            storage_type: findProduct.storage_type,
            quantity: 0,
            pack: parseInt(product.pack, 10),
            images: product.images,
          });
        }
      })
    );
    const result = await prisma.$transaction(async (prisma) => {
      const createdBundleProducts = await prisma.bundleProduct.createMany({
        data: bundleProducts,
      });

      return createdBundleProducts;
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Bundle products created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bundle products:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json(
        { status: "error", message: prismaError.message },
        { status: prismaError.status }
      );
    }

    return NextResponse.json(
      { status: "error", message: "Failed to create bundle products" },
      { status: 500 }
    );
  }
}
