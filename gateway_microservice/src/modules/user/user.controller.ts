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
import { RequireQueryPayload } from 'src/common/decorators/requireQueryPayload';

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
    @RequireQueryPayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async findUserById(
        @Query() data: FindUserByIdRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByIdResponse>> {
        const end = this.findByIdDuration.startTimer();
        try {
            const payload = await this.userService.FindUserById({
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
    @RequireQueryPayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async findUserByTag(
        @Query() data: FindUserByTagRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByTagResponse>> {
        const end = this.findByTagDuration.startTimer();
        try {
            const payload = await this.userService.FindUserByTag({
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
    @RequireQueryPayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async findUserByPhone(
        @Query() data: FindUserByPhoneNumberRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByPhoneNumberResponse>> {
        const end = this.findByPhoneDuration.startTimer();
        try {
            const payload = await this.userService.FindUserByPhoneNumber({
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
    @RequireQueryPayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async findUserByEmail(
        @Query() data: FindUserByEmailRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<Response<FindUserByEmailResponse>> {
        const end = this.findByEmailDuration.startTimer();
        try {
            const payload = await this.userService.FindUserByEmail({
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
    @RequireQueryPayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async findUsername(
        @Query() data: FindUserByUsernameRequest,
        @Res() res: Response,
    ): Promise<Response<FindUserByUsernameResponse>> {
        const end = this.findByUsernameDuration.startTimer();
        try {
            const payload = await this.userService.FindUserByUsername({
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
