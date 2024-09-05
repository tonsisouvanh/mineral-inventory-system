import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "../apiValidations/authValidationSchemas";
import { z } from "zod";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import { headers } from "next/headers";

export const validateRequestBody = async (req: NextRequest) => {
  const body = await req.json();
  const validatedRegisterData = registerSchema.safeParse(body);
  if (!validatedRegisterData.success) {
    throw new z.ZodError(validatedRegisterData.error.errors);
  }
  return validatedRegisterData;
};

export const checkUserExists = async (email: string) => {
  const existUser = await prisma.user.findUnique({ where: { email } });
  if (existUser) {
    throw new Error("Email already exists");
  }
  return existUser;
};

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

export function getUserPayload() {
  const headersList = headers();
  const userPayloadHeader = JSON.parse(
    headersList.get("X-User-Payload") as string
  );

  if (!userPayloadHeader) {
    return NextResponse.json(
      { message: "Access token is missing" },
      { status: 401 }
    );
  }
  try {
    return userPayloadHeader;
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid access token format" },
      { status: 400 }
    );
  }
}
