import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response, NextFunction } from 'express';
import { Observable, lastValueFrom } from 'rxjs';

interface SessionService {
    GetUserSession(data: {
        userId: string;
    }): Observable<{ userId: string; jwtToken: string }>;
}

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    private sessionService: SessionService;

    constructor(@Inject('SESSION_PACKAGE') private client: ClientGrpc) {
        this.sessionService =
            this.client.getService<SessionService>('SessionUserService');
    }

    async use(req: Request, res: Response, next: NextFunction) {
        if (
            req.originalUrl === '/api/auth/login' ||
            req.originalUrl === '/api/auth/register'
        ) {
            return next();
        }
        const { userId, jwtToken } = req.cookies;

        if (!userId || !jwtToken) {
            throw new UnauthorizedException('No authentication data provided');
        }

        try {
            const response = await lastValueFrom(
                this.sessionService.GetUserSession({ userId }),
            );

            if (response.jwtToken === jwtToken) {
                return next();
            } else {
                throw new UnauthorizedException('Invalid session');
            }
        } catch (e) {
            throw new UnauthorizedException('Failed to validate session');
        }
    }
}
