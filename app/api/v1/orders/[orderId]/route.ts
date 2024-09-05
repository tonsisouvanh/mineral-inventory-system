import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// const ProductSchema = z.object({
//   product_number: z.number().int().positive(),
//   name: z.string().max(255),
//   short_description: z.string().max(255).nullable().optional(),
//   long_description: z.string().nullable().optional(),
//   price: z.number({
//     invalid_type_error: 'Price must be a number',
//     required_error: 'Price is required',
//   }),
//   sku: z.string().max(50).nullable().optional(),
//   images: z.string().nullable().optional(),
//   size: z.string().max(55).nullable().optional(),
//   category_id: z.number().int().positive().nullable().optional(),
//   supplier_id: z.number().int().positive().nullable().optional(),
//   reorder_level: z.number().int().default(0),
//   pack: z.number().int().default(1).nullable().optional(),
//   type: z.string().max(55).nullable().optional(),
// });

// const OrderSchema = z.object({
//   order_code: z.string().max(50),
//   order_amount: z.number().positive(),
//   payment_status: z.string().max(50),
//   shipping_phone: z.string().max(20),
//   shipping_amount: z.number().positive(),
//   orderDetails: z.array(
//     z.object({
//       shop_order_id: z.string().max(50),
//       shop_product_id: z.number().int().positive(),
//       quantity: z.number().int().positive(),
//       price: z.number().positive(),
//       type: z.string().max(50),
//       pack: z.number().int().positive(),
//     })
//   ),
// });

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderdetails: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { status: "error", message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
//   const orderId = parseInt(params.orderId);
//   if (isNaN(orderId)) {
//     return NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 });
//   }

//   const body = await req.json();
//   const validatedData = OrderSchema.safeParse(body);
//   if (!validatedData.success) {
//     return NextResponse.json(
//       { message: `${validatedData.error.errors[0].path}: ${validatedData.error.errors[0].message}` },
//       { status: 400 }
//     );
//   }

//   const { order_code, order_amount, payment_status, shipping_phone, shipping_amount, orderDetails } = validatedData.data;

//   const orderData = {
//     order_code,
//     order_amount,
//     payment_status,
//     shipping_phone,
//     shipping_amount,
//     updated_at: getLocalDateTime(),
//   };

//   try {
//     const existingOrder = await prisma.order.findUnique({
//       where: { id: orderId },
//     });

//     if (!existingOrder) {
//       return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 });
//     }

//     const updatedOrder = await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         ...orderData,
//         orderDetails: {
//           deleteMany: {}, // Clear existing order details
//           create: orderDetails, // Add new order details
//         },
//       },
//     });

//     return NextResponse.json(
//       { status: 'success', message: 'Order updated successfully', data: updatedOrder },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error updating order:', error);
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       const prismaError = handlePrismaError(error);
//       return NextResponse.json({ status: 'error', message: prismaError.message }, { status: prismaError.status });
//     }
//     return NextResponse.json({ status: 'error', message: 'Failed to update order' }, { status: 500 });
//   }
// }
