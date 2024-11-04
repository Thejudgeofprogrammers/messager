import { Body, Controller, Post, Res } from '@nestjs/common';
import {
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
} from '../../../protos/proto_gen_files/auth';
import { AuthorizeService } from './authorize.service';
import { myOptionalCookieOptions } from '../../config/config.cookie';
import { Response } from 'express';

@Controller('auth')
export class AuthorizeController {
    constructor(private readonly authService: AuthorizeService) {}

    @Post('login')
    async loginUser(
        @Body() payload: LoginRequest,
        @Res() res: Response,
    ): Promise<Response<LoginResponse>> {
        try {
            const data = await this.authService.loginUser(payload);
            res.cookie('jwtToken', data.jwtToken, myOptionalCookieOptions);
            res.cookie(
                'userId',
                data.userId.toString(),
                myOptionalCookieOptions,
            );

            return res.json({ userId: data.userId, jwtToken: data.jwtToken });
        } catch (e) {
            res.json({ message: 'Server encountered a problem during' }).status(
                500,
            );
        }
    }

    @Post('register')
    async registerUser(
        @Body() payload: RegisterRequest,
        @Res() res: Response,
    ): Promise<Response<RegisterResponse>> {
        try {
            const data = await this.authService.registerUser(payload);
            return res.json({ message: data.message, status: data.status });
        } catch (e) {
            console.log(e);
            res.json({ message: 'Server encountered a problem during' }).status(
                500,
            );
        }
    }

    @Post('logout')
    async logoutUser(
        @Body() payload: LogoutRequest,
        @Res() res: Response,
    ): Promise<Response<LogoutResponse>> {
        try {
            res.clearCookie('jwtToken');
            res.clearCookie('userId');
            const data = await this.authService.logoutUser(payload);
            return res.json({ message: data.message, status: data.status });
        } catch (e) {
            res.json({ message: 'Server encountered a problem during' }).status(
                500,
            );
        }
    }
}
