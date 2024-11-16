import {
    Injectable,
    NestMiddleware,
    OnModuleInit,
    Inject,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response, NextFunction } from 'express';
import { from, lastValueFrom } from 'rxjs';
import { errMessages } from 'src/common/messages';
import { StatusClient } from 'src/common/status';
import { exludeRoutes } from 'src/config/exlude_route';
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
        if (exludeRoutes.includes(req.originalUrl)) {
            return next();
        }
        const { userId, jwtToken } = req.cookies;

        if (!userId || !jwtToken) {
            return res
                .json({
                    message: StatusClient.HTTP_STATUS_UNAUTHORIZED.message,
                })
                .status(StatusClient.HTTP_STATUS_UNAUTHORIZED.status);
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
                return res
                    .json({
                        message: errMessages.use.sessionInvalid,
                    })
                    .status(StatusClient.HTTP_STATUS_UNAUTHORIZED.status);
            }
        } catch (e) {
            return res
                .json({
                    message: errMessages.use.sessionValidate,
                })
                .status(StatusClient.HTTP_STATUS_UNAUTHORIZED.status);
        }
    }
}
