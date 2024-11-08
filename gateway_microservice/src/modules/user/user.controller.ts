import { Controller, Get, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

import {
    FindUserByIdResponse,
    FindUserByEmailResponse,
    FindUserByPhoneNumberResponse,
    FindUserByUsernameResponse,
    FindUserByTagResponse,
    FindUserByUsernameRequest,
    FindUserByEmailRequest,
    FindUserByPhoneNumberRequest,
    FindUserByTagRequest,
    FindUserByIdRequest,
} from 'src/protos/proto_gen_files/user';
import { StatusClient } from 'src/common/status';
import { errMessages } from 'src/common/messages';

type ResponseWithoutPassword<T> = Promise<Response<Omit<T, 'passwordHash'>>>;

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_ID_TOTAL')
        private readonly findByIdTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_ID_DURATION')
        private readonly findByIdDuration: Histogram<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_TAG_TOTAL')
        private readonly findByTagTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_BY_TAG_DURATION')
        private readonly findByTagDuration: Histogram<string>,

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

    @Get('findById')
    async findUserById(
        @Query() data: FindUserByIdRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByIdResponse>> {
        const end = this.findByIdDuration.startTimer();
        if (!data.userId) {
            return res
                .json({ message: StatusClient.HTTP_STATUS_BAD_REQUEST.message })
                .status(StatusClient.HTTP_STATUS_BAD_REQUEST.status);
        }
        try {
            const payload = await this.userService.findUserById({
                userId: data.userId,
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

    @Get('findByTag')
    async findUserByTag(
        @Query() data: FindUserByTagRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByTagResponse>> {
        const end = this.findByTagDuration.startTimer();
        if (!data.tag) {
            return res
                .json({ message: StatusClient.HTTP_STATUS_BAD_REQUEST.message })
                .status(StatusClient.HTTP_STATUS_BAD_REQUEST.status);
        }
        try {
            const payload = await this.userService.findUserByTag({
                tag: data.tag,
            });

            if (!payload) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }

            this.findByTagTotal.inc();
            return res.status(StatusClient.HTTP_STATUS_OK.status).json(payload);
        } catch (e) {
            return res
                .json({ message: errMessages.findByTag, error: e.message })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        } finally {
            end();
        }
    }

    @Get('findByPhone')
    async findUserByPhone(
        @Query() data: FindUserByPhoneNumberRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByPhoneNumberResponse>> {
        const end = this.findByPhoneDuration.startTimer();
        if (!data.phoneNumber) {
            return res
                .json({ message: StatusClient.HTTP_STATUS_BAD_REQUEST.message })
                .status(StatusClient.HTTP_STATUS_BAD_REQUEST.status);
        }
        try {
            const payload = await this.userService.findUserByPhone({
                phoneNumber: data.phoneNumber,
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

    @Get('findByEmail')
    async findUserByEmail(
        @Query() data: FindUserByEmailRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByEmailResponse>> {
        const end = this.findByEmailDuration.startTimer();
        if (!data.email) {
            return res
                .json({ message: StatusClient.HTTP_STATUS_BAD_REQUEST.message })
                .status(StatusClient.HTTP_STATUS_BAD_REQUEST.status);
        }
        try {
            const payload = await this.userService.findUserByEmail({
                email: data.email,
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

    @Get('findByUsername')
    async findUsername(
        @Query() data: FindUserByUsernameRequest,
        @Res() res: Response,
    ): Promise<Response<FindUserByUsernameResponse>> {
        const end = this.findByUsernameDuration.startTimer();
        if (!data.username) {
            return res
                .json({ message: StatusClient.HTTP_STATUS_BAD_REQUEST.message })
                .status(StatusClient.HTTP_STATUS_BAD_REQUEST.status);
        }
        try {
            const payload = await this.userService.findUserByUsername({
                username: data.username,
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
