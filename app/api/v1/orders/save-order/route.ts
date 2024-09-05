import prisma from "@/lib/prisma";
import { getLocalDateTime, handlePrismaError } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const OrderSchema = z.object({
  id: z.string(), // Assuming id is a UUID
  order_code: z.string(),
  order_amount: z.number().positive(),
  payment_status: z.string(),
  shipping_phone: z.string().optional().nullable(),
  shipping_amount: z.number().optional().nullable(),
  orderDetails: z.array(
    z.object({
      shop_order_id: z.string(), // Assuming order_id is a UUID
      shop_product_id: z.number().int().positive(),
      quantity: z.number().int().positive(),
      price: z.number(),
      type: z.string().optional().nullable(),
      pack: z.number(),
      gift: z.object({
        normal_250ml_pack: z.number().int().nonnegative(),
        normal_600ml_pack: z.number().int().nonnegative(),
        normal_1500ml_pack: z.number().int().nonnegative(),
        premium_500ml_pack: z.number().int().nonnegative(),
        premium_500ml_carton: z.number().int().nonnegative(),
      }),
    })
  ),
});

type OrderDetailsType = z.infer<typeof OrderSchema>["orderDetails"][number];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = OrderSchema.safeParse(body);

    if (!validatedData.success) {
      const error = validatedData.error.errors[0];
      await prisma.errorLog.create({
        data: {
          timestamp: getLocalDateTime(),
          endpoint: req.url,
          requestBody: JSON.stringify(body),
          errorMessage: `${error.path}: ${error.message}`,
          stackTrace: null,
          created_at: getLocalDateTime(),
        },
      });
      return NextResponse.json(
        { message: `${error.path}: ${error.message}` },
        { status: 400 }
      );
    }

    const {
      id,
      order_code,
      shipping_phone,
      shipping_amount,
      order_amount,
      payment_status,
      orderDetails,
    } = validatedData.data;

    // Format order details
    const formattedOrderDetails = orderDetails.map((detail) => ({
      product_id: detail.shop_product_id,
      quantity: detail.quantity,
      price: detail.price,
      total_price: detail.price * detail.quantity,
      created_at: getLocalDateTime(),
      updated_at: getLocalDateTime(),
    }));

    const result = await prisma.$transaction(async (prisma) => {
      // Create order and order details
      const order = await prisma.order.create({
        data: {
          id,
          order_code,
          order_amount,
          payment_status,
          shipping_phone,
          shipping_amount: shipping_amount ?? 0,
          orderdetails: {
            create: formattedOrderDetails,
          },
          created_at: getLocalDateTime(),
          updated_at: getLocalDateTime(),
        },
      });

      const productUpdatePromises = orderDetails.map(async (detail) => {
        // Handle bundle product
        const bundleProduct = await prisma.bundleProduct.findUnique({
          where: {
            id: detail.shop_product_id,
          },
        });

        if (bundleProduct) {
          await prisma.product.update({
            where: { id: bundleProduct.product_id },
            data: {
              quantity: {
                decrement: bundleProduct.pack * detail.quantity,
              },
              productstocks: {
                create: {
                  movement_type: "OUT",
                  quantity: bundleProduct.pack * detail.quantity,
                  remarks: "By System",
                  created_at: getLocalDateTime(),
                  updated_at: getLocalDateTime(),
                },
              },
            },
          });
        } else {
          // Handle regular product
          await prisma.product.update({
            where: { product_number: detail.shop_product_id },
            data: {
              quantity: {
                decrement: detail.quantity,
              },
              productstocks: {
                create: {
                  movement_type: "OUT",
                  quantity: detail.quantity || 0,
                  remarks: "By System",
                  created_at: getLocalDateTime(),
                  updated_at: getLocalDateTime(),
                },
              },
            },
          });
        }

        // Decrement gift quantities
        const giftUpdatePromises = Object.entries(detail.gift).map(
          async ([giftType, giftQuantity]) => {
            if (giftQuantity > 0) {
              await prisma.product.update({
                where: { product_number: detail.shop_product_id },
                data: {
                  quantity: {
                    decrement: giftQuantity,
                  },
                  productstocks: {
                    create: {
                      movement_type: "OUT",
                      quantity: giftQuantity,
                      remarks: "Gift by System",
                      created_at: getLocalDateTime(),
                      updated_at: getLocalDateTime(),
                    },
                  },
                },
              });
            }
          }
        );

        await Promise.all(giftUpdatePromises);
      });

      await Promise.all(productUpdatePromises);

      return order;
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Order created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);

    // Log error to ErrorLog table
    await prisma.errorLog.create({
      data: {
        timestamp: getLocalDateTime(),
        endpoint: req.url,
        requestBody: JSON.stringify(req.body),
        errorMessage: (error as Error).message,
        stackTrace: (error as Error).stack,
        created_at: getLocalDateTime(),
      },
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json(
        { status: "error", message: prismaError.message },
        { status: prismaError.status }
      );
    }

    return NextResponse.json(
      { status: "error", message: "Failed to create order" },
      { status: 500 }
    );
  }
}
