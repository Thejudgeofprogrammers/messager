import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import {
    RegisterRequest,
    RegisterResponse,
} from 'src/protos/proto_gen_files/auth';
import { AuthorizeService } from './authorize.service';
import { myOptionalCookieOptions } from 'src/config/config.cookie';
import {
    LoginFormDTO,
    LoginResponseDTO,
    LogoutRequestDTO,
    LogoutResponseDTO,
    RegisterFormDTO,
    RegisterResponseDTO,
} from './dto';
import { StatusClient } from 'src/common/status';
import { errMessages } from 'src/common/messages';
import {
    ApiBody,
    ApiCookieAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { loginDocs, logoutDocs, RegisterDocs } from 'src/common/api/auth';

@ApiTags('Авторизация/Аутентификация')
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
    @ApiOperation({
        summary: 'Вход в аккаунт',
        description: loginDocs,
    })
    @ApiCookieAuth()
    @ApiResponse({
        status: 200,
        description: 'Выполнен вход. Установлены куки jwtToken и userId.',
        type: LoginResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для входа',
        type: LoginFormDTO,
    })
    async loginUser(
        @Body() payload: LoginFormDTO,
        @Res() res: Response,
    ): Promise<Response<LoginResponseDTO>> {
        const end = this.loginDuration.startTimer();
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
    @ApiOperation({
        summary: 'Регистрация нового пользователя',
        description: RegisterDocs,
    })
    @ApiResponse({
        status: 200,
        description: 'Пользователь зарегистрирован',
        type: RegisterResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для входа',
        type: RegisterFormDTO,
    })
    async registerUser(
        @Body() payload: RegisterRequest,
        @Res() res: Response,
    ): Promise<Response<RegisterResponse>> {
        const end = this.registerDuration.startTimer();
        try {
            const {
                info: { message, status },
            } = await this.authorizeService.registerUser(payload);
            this.registerTotal.inc();
            return res.json(message).status(status);
        } catch (e) {
            return res
                .json({ message: errMessages.registry, error: e.message })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        } finally {
            end();
        }
    }

    @Post('logout')
    @ApiOperation({
        summary: 'Выход с аккаунта',
        description: logoutDocs,
    })
    @ApiResponse({
        status: 200,
        description: 'Пользователь вышел с аккаунта',
        type: LogoutResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для выхода',
        type: LogoutRequestDTO,
    })
    async logoutUser(
        @Body() payload: LogoutRequestDTO,
        @Res() res: Response,
    ): Promise<Response<LogoutResponseDTO>> {
        const end = this.logoutDuration.startTimer();
        try {
            const data = await this.authorizeService.logoutUser(
                payload.userId,
                payload.jwtToken,
            );
            const { message, status } = data;
            res.clearCookie('jwtToken');
            res.clearCookie('userId');
            this.logoutTotal.inc();
            return res.json(message).status(status);
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
