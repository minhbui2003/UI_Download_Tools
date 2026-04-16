import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';

export const AUTH_COOKIE_NAME = 'auth_token';
export const AUTH_TOKEN_MAX_AGE = 60 * 60 * 24;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return new TextEncoder().encode(secret);
}

export async function signAuthToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token) {
  if (!token) {
    throw new Error('Auth token is missing');
  }

  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload;
}

export function getAuthCookieOptions() {
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    path: '/',
    maxAge: AUTH_TOKEN_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };
}

export function isConfigError(error) {
  return error?.message === 'JWT_SECRET is not configured';
}
