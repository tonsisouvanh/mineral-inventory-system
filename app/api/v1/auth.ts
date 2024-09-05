import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import generateToken from "@/lib/generateToken";
import setCookie from "@/lib/setCookie";
import { loginSchema } from "@/lib/apiValidations/authValidationSchemas";
import { z } from "zod";
import { getLocalDateTime } from "@/lib/utils";

const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Email does not exist");
  }
  return user;
};

const verifyPassword = async (inputPassword: string, userPassword: string) => {
  const match = await bcrypt.compare(inputPassword, userPassword);
  if (!match) {
    throw new Error("Invalid password");
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const body = req.body;

      // Validate the request body
      const validatedData = loginSchema.safeParse(body);
      if (!validatedData.success) {
        return res
          .status(400)
          .json({
            message: "Invalid input",
            errors: validatedData.error.errors,
          });
      }

      // Destructure the validated data
      const { email, password } = validatedData.data;

      // Check if user exists
      const existUser = await findUserByEmail(email);

      // Compare the password
      await verifyPassword(password, existUser.password);

      // Generate access and refresh tokens
      const { accessToken, refreshToken } = await generateToken({
        id: existUser.id,
        role: existUser.role,
      });

      // Update user last login time
      await prisma.user.update({
        where: { id: existUser.id },
        data: {
          lastlogin_at: getLocalDateTime(),
          updated_at: getLocalDateTime(),
        },
      });

      // Save refresh token to the database
      const createdToken = await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          user_id: existUser.id,
          created_at: getLocalDateTime(),
          updated_at: getLocalDateTime(),
        },
      });

      // Set cookie
      if (createdToken) {
        setCookie(accessToken, refreshToken);
      }

      return res.status(200).json({
        message: "You are logged in",
        data: {
          id: existUser.id,
          email: existUser.email,
          name: existUser.name,
        },
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid input", errors: error.errors });
      } else if (
        error.message === "Email does not exist" ||
        error.message === "Invalid password"
      ) {
        return res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        return res.status(500).json({ message: "Failed to sign in" });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
}
