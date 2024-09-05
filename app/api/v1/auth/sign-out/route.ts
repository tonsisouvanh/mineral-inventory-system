import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const clearCookies = () => {
  const cookieStore = cookies();
  cookieStore.set("AccessToken", "", { httpOnly: true, expires: new Date(0) });
  cookieStore.set("RefreshToken", "", { httpOnly: true, expires: new Date(0) });
};

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const headersList = req.headers;
    const userPayloadHeader = JSON.parse(
      headersList.get("X-User-Payload") as string
    );
    if (!userPayloadHeader) {
      return NextResponse.json(
        { message: "Access token is missing" },
        { status: 401 }
      );
    }
    // const userId = userPayloadHeader.userId;
    // const deletedToken = await prisma.refreshToken.deleteMany({
    //   where: { user_id: userId },
    // });

    // if (deletedToken.count === 0) {
    //   return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
    // }

    clearCookies();
    return NextResponse.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to log out" }, { status: 500 });
  }
};
