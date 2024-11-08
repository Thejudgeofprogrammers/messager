import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
    OnModuleInit,
    Inject,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response, NextFunction } from 'express';
import { from, lastValueFrom } from 'rxjs';
import { SessionUserService } from 'src/protos/proto_gen_files/session_user';

@Injectable()
export class SessionMiddleware implements NestMiddleware, OnModuleInit {
    private sessionUserMicroservice: SessionUserService;
    constructor(
        @Inject('SESSION_USER_CLIENT')
        private readonly sessionUserClient: ClientGrpc,
    ) {}
    onModuleInit() {
        this.sessionUserMicroservice =
            this.sessionUserClient.getService<SessionUserService>(
                'SessionUserService',
            );
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
                from(
                    this.sessionUserMicroservice.GetUserSession({
                        userId,
                    }),
                ),
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
