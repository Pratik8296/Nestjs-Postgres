import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
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
            throw new UnauthorizedException('Please provide a valid token');
        }

        const token: string = authHeader;

        try {
            const decoded = this.jwtService.verify(token);
            req.user = decoded;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        next();
    }
}
