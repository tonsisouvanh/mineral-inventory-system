import { cookies } from 'next/headers';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string(),
});

// Validate environment variables
const env = envSchema.safeParse(process.env.NODE_ENV);

const setCookie = (accessToken: string, refreshToken: string) => {
  const isProduction = env.data?.NODE_ENV === 'production';
  // const refreshTokenExpiry = 10000; // testing
  // const accessTokenExpiry = 3 * 24 * 60 * 60 * 1000; // 3 days
  const accessTokenExpiry = 3 * 60 * 60 * 1000; // 3 hours
  const refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days

  const setSingleCookie = (name: string, value: string, expiry: number) => {
    cookies().set(name, value, {
      secure: isProduction,
      httpOnly: true,
      expires: new Date(Date.now() + expiry),
      // expires: new Date(getLocalDateTime() + expiry),
      // maxAge: expiry,
      path: '/',
      sameSite: 'lax',
    });
  };

  setSingleCookie('AccessToken', accessToken, accessTokenExpiry);
  setSingleCookie('RefreshToken', refreshToken, refreshTokenExpiry);
};

export default setCookie;
