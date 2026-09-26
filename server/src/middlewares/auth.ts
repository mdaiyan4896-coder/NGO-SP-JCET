import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AppError } from './errorHandler';

export interface AuthUser {
  id: string;
  organizationId: string;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'COORDINATOR' | 'VIEWER' | 'VOLUNTEER';
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Missing token.', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired.', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN'));
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated.', 401, 'UNAUTHORIZED'));
    }

    if (req.user.role === 'SUPER_ADMIN') {
      return next(); // Super admin has full access
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Access denied: insufficient permissions.', 403, 'FORBIDDEN'));
    }

    next();
  };
};

export const enforceOrgScope = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated.', 401, 'UNAUTHORIZED'));
  }

  // Super admin can inspect any org
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  const targetOrgId = req.params.organizationId || req.body.organizationId || req.query.organizationId;
  if (targetOrgId && targetOrgId !== req.user.organizationId) {
    return next(new AppError('Cross-organization access forbidden.', 403, 'FORBIDDEN_ORG'));
  }

  next();
};
