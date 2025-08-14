import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-client';
import { AuthUser } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const client = jwksClient({
  jwksUri: process.env.SUPABASE_JWKS || 'https://nerhxpfcccyggmmxdugc.supabase.co/auth/v1/keys',
  cache: true,
  cacheMaxAge: 600000, // 10 minutes
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export const authenticateToken = (requireRole = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      const decoded = await new Promise<any>((resolve, reject) => {
        jwt.verify(token, getKey, {
          audience: 'authenticated',
          issuer: 'https://nerhxpfcccyggmmxdugc.supabase.co/auth/v1',
          algorithms: ['RS256']
        }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });

      const user: AuthUser = {
        sub: decoded.sub,
        email: decoded.email,
        roles: [] // Will be fetched from Supabase user_roles table
      };

      // TODO: Fetch user roles from Supabase user_roles table
      // For now, check user_metadata for office role
      const userMetadata = decoded.user_metadata || {};
      if (userMetadata.roles && Array.isArray(userMetadata.roles)) {
        user.roles = userMetadata.roles;
      }

      req.user = user;

      // Check if role is required and user has it
      if (requireRole && process.env.REQUIRED_ROLE) {
        const hasRequiredRole = user.roles?.includes(process.env.REQUIRED_ROLE);
        if (!hasRequiredRole) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }

      next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};