import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate a secure JWT token for authenticated users
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
    issuer: 'havenspace',
    audience: 'havenspace-users'
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 * Returns null if token is invalid or expired
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'havenspace',
      audience: 'havenspace-users'
    }) as jwt.JwtPayload;
    
    return {
      userId: decoded.userId as string,
      email: decoded.email as string,
      role: decoded.role as string
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Token has expired'
      });
    }
    if (error instanceof JsonWebTokenError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token'
      });
    }
    return null;
  }
}

/**
 * Decode a token without verification (for debugging only)
 */
export function decodeToken(token: string): JWTPayload | null {
  return jwt.decode(token) as JWTPayload | null;
}
