import { Controller, Get, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

import { StatusClient } from 'src/common/status';
import { errMessages } from 'src/common/messages';
import {
    ApiBody,
    ApiCookieAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import {
    FindUserByEmailRequestDTO,
    FindUserByEmailResponseDTO,
    FindUserByIdRequestDTO,
    FindUserByIdResponseDTO,
    FindUserByPhoneNumberRequestDTO,
    FindUserByPhoneNumberResponseDTO,
    FindUserByUsernameResponseDTO,
} from './dto';
import {
    findUserByEmailDocs,
    findUserByIdDocs,
    findUserByPhoneDocs,
    findUserByUsernameDocs,
} from 'src/common/api/user';

type ResponseWithoutPassword<T> = Promise<Response<Omit<T, 'passwordHash'>>>;

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_ID_TOTAL')
        private readonly findByIdTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_ID_DURATION')
        private readonly findByIdDuration: Histogram<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_PHONE_TOTAL')
        private readonly findByPhoneTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_PHONE_DURATION')
        private readonly findByPhoneDuration: Histogram<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_EMAIL_TOTAL')
        private readonly findByEmailTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_EMAIL_DURATION')
        private readonly findByEmailDuration: Histogram<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_USERNAME_TOTAL')
        private readonly findByUsernameTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_USERNAME_DURATION')
        private readonly findByUsernameDuration: Histogram<string>,
    ) {}

    @Get('user/:userId')
    @ApiOperation({
        summary: 'Поиск пользователя по id',
        description: findUserByIdDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Пользователь найден',
        type: FindUserByIdResponseDTO,
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
        status: 404,
        description: 'Пользователь не найден',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для поиска пользователя по id',
        type: FindUserByIdRequestDTO,
    })
    async findUserById(
        @Param('userId') userId: number,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByIdResponseDTO>> {
        const end = this.findByIdDuration.startTimer();
        try {
            const payload = await this.userService.FindUserById({
                userId,
            });

            if (!payload) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }

            this.findByIdTotal.inc();
            return res.status(StatusClient.HTTP_STATUS_OK.status).json(payload);
        } catch (e) {
            return res
                .json({ message: errMessages.findUserById, error: e.message })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        } finally {
            end();
        }
    }

    @Get('phone/:phoneNumber')
    @ApiOperation({
        summary: 'Поиск пользователя по phoneNumber',
        description: findUserByPhoneDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Пользователь найден',
        type: FindUserByPhoneNumberResponseDTO,
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
        status: 404,
        description: 'Пользователь не найден',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для поиска пользователя по phoneNumber',
        type: FindUserByPhoneNumberRequestDTO,
    })
    async findUserByPhone(
        @Param('phoneNumber') phoneNumber: string,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByPhoneNumberResponseDTO>> {
        const end = this.findByPhoneDuration.startTimer();
        try {
            const payload = await this.userService.FindUserByPhoneNumber({
                phoneNumber,
            });

            if (!payload) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }

            this.findByPhoneTotal.inc();
            return res.status(StatusClient.HTTP_STATUS_OK.status).json(payload);
        } catch (e) {
            return res
                .json({ message: errMessages.findByPhone, error: e.message })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        } finally {
            end();
        }
    }

    @Get('email/:email')
    @ApiOperation({
        summary: 'Поиск пользователя по email',
        description: findUserByEmailDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Пользователь найден',
        type: FindUserByEmailResponseDTO,
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
        status: 404,
        description: 'Пользователь не найден',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для поиска пользователя по email',
        type: FindUserByEmailRequestDTO,
    })
    async findUserByEmail(
        @Param('email') email: string,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByEmailResponseDTO>> {
        const end = this.findByEmailDuration.startTimer();
        try {
            const payload = await this.userService.FindUserByEmail({
                email,
            });

            if (!payload) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }

            this.findByEmailTotal.inc();
            return res.status(StatusClient.HTTP_STATUS_OK.status).json(payload);
        } catch (e) {
            return res
                .json({ message: errMessages.findByEmail, error: e.message })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        } finally {
            end();
        }
    }

    @Get('username/:username')
    @ApiOperation({
        summary: 'Поиск пользователя по username',
        description: findUserByUsernameDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Пользователь найден',
        type: FindUserByEmailResponseDTO,
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
        status: 404,
        description: 'Пользователь не найден',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для поиска пользователя по username',
        type: FindUserByEmailRequestDTO,
    })
    async findUsername(
        @Param('username') username: string,
        @Res() res: Response,
    ): Promise<Response<FindUserByUsernameResponseDTO>> {
        const end = this.findByUsernameDuration.startTimer();
        try {
            const payload = await this.userService.FindUserByUsername({
                username,
            });

            if (!payload) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }

            this.findByUsernameTotal.inc();
            return res.status(StatusClient.HTTP_STATUS_OK.status).json(payload);
        } catch (e) {
            return res
                .json({
                    message: errMessages.findByUsername,
                    error: e.message,
                })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        } finally {
            end();
        }
    }
}
