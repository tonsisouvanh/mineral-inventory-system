import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const stockSchema = z.object({
  movement_type: z.enum(["IN", "OUT", "TRANSFER"]),
  quantity: z.number().int().positive(),
  remarks: z.string().optional(),
});

//TODO: Too hard to implement, consider using delete instead
export async function PUT(
  req: NextRequest,
  { params }: { params: { stockId: string } },
  res: NextResponse
) {
  // Get product id from params
  const stockId = parseInt(params.stockId);
  try {
    // get request body
    const body = await req.json();

    // Validate the request body
    const validatedData = stockSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: `${validatedData.error.errors[0].path}: ${validatedData.error.errors[0].message}`,
        },
        { status: 400 }
      );
    }
    // Destructure the validated data
    const {
      movement_type,
      quantity: incomingQty,
      remarks,
    } = validatedData.data;

    // Find current stock exist and assign current stock to updated stock
    const currnetStock = await prisma.productStock.findUnique({
      where: { id: stockId },
    });
    if (!currnetStock)
      return NextResponse.json(
        { status: "error", message: "Stock not found" },
        { status: 404 }
      );

    // Get the currrent quantity of product
    const productId = currnetStock.product_id;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      return NextResponse.json(
        { status: "error", message: "Product not found" },
        { status: 404 }
      );

    const updatedStock = await prisma.productStock.update({
      where: { id: stockId },
      data: {
        movement_type,
        quantity: incomingQty,
        remarks,
      },
    });

    // Update the product quantity based on movement_type
    if (updatedStock) {
      let updateQuantity = 0;
      if (movement_type === "IN") {
        if (incomingQty !== currnetStock.quantity) {
          if (incomingQty > currnetStock.quantity) {
            updateQuantity = incomingQty - currnetStock.quantity;
            await prisma.product.update({
              where: { id: updatedStock.product_id },
              data: {
                quantity:
                  product.quantity - currnetStock.quantity + updateQuantity,
              },
            });
          }
          if (incomingQty < currnetStock.quantity) {
            updateQuantity = currnetStock.quantity - incomingQty;
            await prisma.product.update({
              where: { id: updatedStock.product_id },
              data: {
                quantity:
                  product.quantity - currnetStock.quantity - updateQuantity,
              },
            });
          }
        }
      } else if (movement_type === "OUT") {
        if (incomingQty !== currnetStock.quantity) {
          if (incomingQty > currnetStock.quantity) {
            updateQuantity = incomingQty - currnetStock.quantity;
            await prisma.product.update({
              where: { id: updatedStock.product_id },
              data: { quantity: product.quantity - updateQuantity },
            });
          }
          if (incomingQty < currnetStock.quantity) {
            updateQuantity = currnetStock.quantity - incomingQty;
            await prisma.product.update({
              where: { id: updatedStock.product_id },
              data: {
                quantity:
                  product.quantity + currnetStock.quantity + updateQuantity,
              },
            });
          }
        }
      }
    }

    return NextResponse.json(
      { status: "success", message: "Stock added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    if ((error as Error).message === "Insufficient stock") {
      return NextResponse.json(
        { status: "error", message: "Insufficient stock" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: "error", message: "Failed to add stock" },
      { status: 500 }
    );
  }
}

// export async function DELETE(req: NextRequest, { params }: { params: { stockId: string } }, res: NextResponse) {
//   // Get product id from params
//   const stockId = parseInt(params.stockId);
//   try {
//     // Find current stock exist and assign current stock to updated stock
//     const isStockExist = await prisma.productStock.findUnique({ where: { id: stockId } });
//     if (!isStockExist) return NextResponse.json({ status: 'error', message: 'Stock not found' }, { status: 404 });

//     const deletedStosck = await prisma.productStock.delete({
//       where: { id: isStockExist.id },
//     });

//     if (deletedStosck) {
//       if (deletedStosck.movement_type === 'IN') {
//         await prisma.product.update({
//           where: { id: deletedStosck.product_id },
//           data: { quantity: { decrement: deletedStosck.quantity } },
//         });
//       }
//       if (deletedStosck.movement_type === 'OUT') {
//         await prisma.product.update({
//           where: { id: deletedStosck.product_id },
//           data: { quantity: { increment: deletedStosck.quantity } },
//         });
//       }
//     }

//     return NextResponse.json({ status: 'success', message: 'Stock added successfully' }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ status: 'error', message: 'Failed to add stock' }, { status: 500 });
//   }
// }
// With transaction
export async function DELETE(
  req: NextRequest,
  { params }: { params: { stockId: string } },
  res: NextResponse
) {
  // Get stock id from params
  const stockId = parseInt(params.stockId);
  if (isNaN(stockId)) {
    return NextResponse.json(
      { status: "error", message: "Invalid stock ID" },
      { status: 400 }
    );
  }

  try {
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Find if the stock exists
      const existingStock = await prisma.productStock.findUnique({
        where: { id: stockId },
      });
      if (!existingStock) {
        throw new Error("Stock not found");
      }

      // Delete the stock
      const deletedStock = await prisma.productStock.delete({
        where: { id: existingStock.id },
      });

      // Update the product quantity based on the movement type
      if (deletedStock.movement_type === "IN") {
        await prisma.product.update({
          where: { id: deletedStock.product_id },
          data: { quantity: { decrement: deletedStock.quantity } },
        });
      } else if (deletedStock.movement_type === "OUT") {
        await prisma.product.update({
          where: { id: deletedStock.product_id },
          data: { quantity: { increment: deletedStock.quantity } },
        });
      }
    });

    return NextResponse.json(
      { status: "success", message: "Stock deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting stock:", error);
    if ((error as Error).message === "Stock not found") {
      return NextResponse.json(
        { status: "error", message: "Stock not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { status: "error", message: "Failed to delete stock" },
      { status: 500 }
    );
  }
}
