import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import generateToken from "@/lib/generateToken";
import setCookie from "@/lib/setCookie";
import { registerSchema } from "@/lib/apiValidations/authValidationSchemas";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    // Validate the request body
    const validatedData = registerSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { message: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    // Destructure the validated data
    const { email, password, name } = validatedData.data;

    // Check if user exists
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const createdUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateToken({
      id: createdUser.id,
      role: createdUser.role,
    });

    // Save refresh token to the database
    if (createdUser) {
      const createdToken = await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          user_id: createdUser.id,
        },
      });

      // if refresh token added then set cookie
      if (createdToken) {
        setCookie(accessToken, refreshToken);
      }
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        data: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    } else {
      console.error(error);
      return NextResponse.json(
        { message: "Failed to register user" },
        { status: 500 }
      );
    }
  }
};

// import prisma from '@/lib/prisma';
// import { NextRequest, NextResponse } from 'next/server';
// import { z } from 'zod';
// import bcrypt from 'bcrypt';
// import generateToken from '@/lib/generateToken';
// import setCookie from '@/lib/setCookie';
// import { registerSchema } from '@/lib/apiValidations/authValidationSchemas';

// const validateRequestBody = async (req: NextRequest) => {
//   const body = await req.json();
//   const validatedRegisterData = registerSchema.safeParse(body);
//   if (!validatedRegisterData.success) {
//     throw new z.ZodError(validatedRegisterData.error.errors);
//   }
//   return validatedRegisterData.data;
// };

// const checkUserExists = async (email: string) => {
//   const existUser = await prisma.user.findUnique({ where: { email } });
//   if (existUser) {
//     return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
//   }
// };

// const hashPassword = async (password: string) => {
//   return await bcrypt.hash(password, 10);
// };

// const createUser = async (email: string, name: string, hashedPassword: string) => {
//   return await prisma.user.create({
//     data: {
//       email,
//       name,
//       password: hashedPassword,
//     },
//   });
// };

// const saveRefreshToken = async (refreshToken: string, userId: number) => {
//   return await prisma.refreshToken.create({
//     data: {
//       token: refreshToken,
//       userId,
//     },
//   });
// };

// export const POST = async (req: NextRequest, res: NextResponse) => {
//   try {
//     const { email, password, name } = await validateRequestBody(req);
//     await checkUserExists(email);
//     const hashedPassword = await hashPassword(password);
//     const createdUser = await createUser(email, name, hashedPassword);
//     const { accessToken, refreshToken } = await generateToken({ id: createdUser.id, role: createdUser.role });
//     await saveRefreshToken(refreshToken, createdUser.id);
//     setCookie(accessToken, refreshToken);

//     return NextResponse.json(
//       {
//         message: 'User registered successfully',
//         data: {
//           id: createdUser.id,
//           email: createdUser.email,
//           name: createdUser.name,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
//     } else if ((error as Error).message === 'Email already exists') {
//       return NextResponse.json({ message: (error as Error).message }, { status: 400 });
//     } else {
//       console.error(error);
//       return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
//     }
//   }
// };
