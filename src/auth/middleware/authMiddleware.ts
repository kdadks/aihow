import { NextFunction, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { AuthError, UserRole } from '../types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      userRoles?: UserRole[];
    }
  }
}

// Type for the Supabase role query response
interface RoleData {
  data: Array<{
    role: {
      id: string;
      name: string;
      description?: string;
    };
  }> | null;
  error: Error | null;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: {
          type: 'UNAUTHORIZED',
          message: 'No token provided'
        } as AuthError
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        error: {
          type: 'UNAUTHORIZED',
          message: 'Invalid token'
        } as AuthError
      });
    }

    // Get user roles
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role:roles(id, name, description)')
      .eq('user_id', user.id) as RoleData;

    if (roleError) {
      return res.status(500).json({
        error: {
          type: 'ROLE_NOT_FOUND',
          message: 'Error fetching user roles'
        } as AuthError
      });
    }

    // Transform role data to UserRole array
    const userRoles: UserRole[] = roleData?.map(item => ({
      id: item.role.id,
      name: item.role.name,
      description: item.role.description
    })) || [];

    // Attach user and roles to request
    req.user = user;
    req.userRoles = userRoles;
    next();
  } catch (err) {
    return res.status(500).json({
      error: {
        type: 'UNKNOWN',
        message: 'Internal server error'
      } as AuthError
    });
  }
};

export const requireRole = (roleName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRoles = req.userRoles;

      if (!userRoles || !userRoles.some(role => role.name === roleName)) {
        return res.status(403).json({
          error: {
            type: 'UNAUTHORIZED',
            message: `Required role '${roleName}' not found`
          } as AuthError
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        error: {
          type: 'UNKNOWN',
          message: 'Internal server error'
        } as AuthError
      });
    }
  };
};

// Helper middleware to require admin role
export const requireAdmin = requireRole('admin');

// Middleware to check multiple roles (any of the roles is sufficient)
export const requireAnyRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRoles = req.userRoles;

      if (!userRoles || !userRoles.some(role => roles.includes(role.name))) {
        return res.status(403).json({
          error: {
            type: 'UNAUTHORIZED',
            message: `Required roles [${roles.join(', ')}] not found`
          } as AuthError
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        error: {
          type: 'UNKNOWN',
          message: 'Internal server error'
        } as AuthError
      });
    }
  };
};