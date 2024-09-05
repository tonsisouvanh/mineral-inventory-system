import { SignJWT } from 'jose';
import { z } from 'zod';

// Define a schema to validate environment variables
const envSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

const env = envSchema.safeParse({
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
});

interface TokenValues {
  id: number;
  role: string;
}

const generateToken = async (values: TokenValues) => {
  const secret = new TextEncoder().encode(env.data?.ACCESS_TOKEN_SECRET);
  const refreshSecret = new TextEncoder().encode(env.data?.REFRESH_TOKEN_SECRET);
  const alg = 'HS256';
  const createToken = async (secret: Uint8Array, expiration: string) => {
    return await new SignJWT({ userId: values.id, role: values.role })
      .setProtectedHeader({ alg })
      .setExpirationTime(expiration)
      .setSubject(values.id.toString())
      .sign(secret);
  };

  try {
    const accessToken = await createToken(secret, (process.env.ACCESS_TOKEN_EXPIRY as string) || '3h');
    // const refreshToken = await createToken(refreshSecret, '10s');
    // const accessToken = await createToken(secret, '3h');
    const refreshToken = await createToken(refreshSecret, '7d');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw new Error('Token generation failed');
  }
};

export default generateToken;
