import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import {
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from 'src/protos/proto_gen_files/auth';
import { AuthorizeService } from './authorize.service';
import { myOptionalCookieOptions } from 'src/config/config.cookie';
import { LoginFormDTO, LogoutDTO } from './dto';
import { StatusClient } from 'src/common/status';
import { errMessages } from 'src/common/messages';

@Controller('auth')
export class AuthorizeController {
    constructor(
        private readonly authorizeService: AuthorizeService,

        @InjectMetric('PROM_METRIC_AUTH_LOGIN_TOTAL')
        private readonly loginTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_AUTH_LOGIN_DURATION')
        private readonly loginDuration: Histogram<string>,

        @InjectMetric('PROM_METRIC_AUTH_REGISTER_TOTAL')
        private readonly registerTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_AUTH_REGISTER_DURATION')
        private readonly registerDuration: Histogram<string>,

        @InjectMetric('PROM_METRIC_AUTH_LOGOUT_TOTAL')
        private readonly logoutTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_AUTH_LOGOUT_DURATION')
        private readonly logoutDuration: Histogram<string>,
    ) {}

    @Post('login')
    async loginUser(
        @Body() payload: LoginFormDTO,
        @Res() res: Response,
    ): Promise<Response<LoginResponse>> {
        const end = this.loginDuration.startTimer();
        if (!payload) {
            return res
                .json({ message: StatusClient.HTTP_STATUS_BAD_REQUEST.message })
                .status(StatusClient.HTTP_STATUS_BAD_REQUEST.status);
        }
        try {
            const data = await this.authorizeService.loginUser(payload);
            const { userId, jwtToken } = data;
            res.cookie('jwtToken', jwtToken, myOptionalCookieOptions);
            res.cookie('userId', userId.toString(), myOptionalCookieOptions);

            this.loginTotal.inc();
            return res.json({ userId, jwtToken });
        } catch (e) {
            return res
                .json({
                    message: errMessages.login,
                    error: e.message,
                })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        } finally {
            end();
        }
    }

    @Post('register')
    async registerUser(
        @Body() payload: RegisterRequest,
        @Res() res: Response,
    ): Promise<Response<RegisterResponse>> {
        const end = this.registerDuration.startTimer();
        if (!payload) {
            return res
                .json({ message: StatusClient.HTTP_STATUS_BAD_REQUEST.message })
                .status(StatusClient.HTTP_STATUS_BAD_REQUEST.status);
        }
        try {
            const {
                info: { message, status },
            } = await this.authorizeService.registerUser(payload);
            return res.json({ message, status });
        } catch (e) {
            return res
                .json({ message: errMessages.registry, error: e.message })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        } finally {
            end();
        }
    }

    @Post('logout')
    async logoutUser(
        @Body() payload: LogoutDTO,
        @Res() res: Response,
    ): Promise<Response<LogoutDTO>> {
        const end = this.logoutDuration.startTimer();
        if (!payload) {
            return res
                .json({ message: StatusClient.HTTP_STATUS_BAD_REQUEST.message })
                .status(StatusClient.HTTP_STATUS_BAD_REQUEST.status);
        }
        try {
            const data = await this.authorizeService.logoutUser(
                payload.userId,
                payload.jwtToken,
            );
            const { message, status } = data;
            res.clearCookie('jwtToken');
            res.clearCookie('userId');
            this.logoutTotal.inc();
            return res.json({ message, status });
        } catch (e) {
            return res
                .json({
                    message: errMessages.logout,
                    error: e.message,
                })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        } finally {
            end();
        }
    }
}
