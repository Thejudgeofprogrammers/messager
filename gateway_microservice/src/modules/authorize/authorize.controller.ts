import { Body, Controller, Post, Res } from '@nestjs/common';
import {
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
} from '../../protos/proto_gen_files/auth';
import { AuthorizeService } from './authorize.service';
import { myOptionalCookieOptions } from '../../config/config.cookie';
import { Response } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Controller('auth')
export class AuthorizeController {
    constructor(
        private readonly authService: AuthorizeService,

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
        @Body() payload: LoginRequest,
        @Res() res: Response,
    ): Promise<Response<LoginResponse>> {
        const end = this.loginDuration.startTimer();
        try {
            const data = await this.authService.loginUser(payload);
            res.cookie('jwtToken', data.jwtToken, myOptionalCookieOptions);
            res.cookie(
                'userId',
                data.userId.toString(),
                myOptionalCookieOptions,
            );

            this.loginTotal.inc();
            return res.json({ userId: data.userId, jwtToken: data.jwtToken });
        } catch (e) {
            res.json({ message: 'Server encountered a problem during' }).status(
                500,
            );
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
        try {
            const data = await this.authService.registerUser(payload);
            this.registerTotal.inc();
            return res.json({ message: data.message, status: data.status });
        } catch (e) {
            console.log(e);
            res.json({ message: 'Server encountered a problem during' }).status(
                500,
            );
        } finally {
            end();
        }
    }

    @Post('logout')
    async logoutUser(
        @Body() payload: LogoutRequest,
        @Res() res: Response,
    ): Promise<Response<LogoutResponse>> {
        const end = this.logoutDuration.startTimer();
        try {
            res.clearCookie('jwtToken');
            res.clearCookie('userId');
            const data = await this.authService.logoutUser(payload);
            this.logoutTotal.inc();
            return res.json({ message: data.message, status: data.status });
        } catch (e) {
            res.json({ message: 'Server encountered a problem during' }).status(
                500,
            );
        } finally {
            end();
        }
    }
}
