import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader: string = req.headers.auth as string;

    if (!authHeader) {
      // Allow unauthenticated requests; routes can use RequiredAuthGuard if needed
      req.user = null;
      return next();
    }

    const token: string = authHeader;

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded;
    } catch (err) {
      // Log invalid token but allow request to proceed
      req.user = null;
    }

    next();
  }
}
