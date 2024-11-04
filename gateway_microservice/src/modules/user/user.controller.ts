import { Controller, Get, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

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
} from '../../protos/proto_gen_files/user';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

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
    ): ResponseWithoutPassword<FindUserByIdResponse> {
        const end = this.findByIdDuration.startTimer();
        try {
            if (!data || !data.userId) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const payload = await this.userService.findUserById({
                userId: data.userId,
            });

            if (!payload) {
                return res.status(404).json({ message: 'Resource not Found' });
            }

            this.findByIdTotal.inc();
            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserById:', e);
            return res.status(500).json({ message: 'Server error' });
        } finally {
            end();
        }
    }

    @Get('findByTag')
    async findUserByTag(
        @Query() data: FindUserByTagRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByTagResponse> {
        const end = this.findByTagDuration.startTimer();
        try {
            if (!data || !data.tag) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const payload = await this.userService.findUserByTag({
                tag: data.tag,
            });

            if (!payload) {
                return res.status(404).json({ message: 'Resource not Found' });
            }

            this.findByTagTotal.inc();
            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserByTag:', e);
            return res.status(500).json({ message: 'Server error' });
        } finally {
            end();
        }
    }

    @Get('findByPhone')
    async findUserByPhone(
        @Query() data: FindUserByPhoneNumberRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByPhoneNumberResponse> {
        const end = this.findByPhoneDuration.startTimer();
        try {
            if (!data || !data.phoneNumber) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const payload = await this.userService.findUserByPhone({
                phoneNumber: data.phoneNumber,
            });

            if (!payload) {
                return res.status(404).json({ message: 'Resource not Found' });
            }

            this.findByPhoneTotal.inc();
            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserByPhone:', e);
            return res.status(500).json({ message: 'Server error' });
        } finally {
            end();
        }
    }

    @Get('findByEmail')
    async findUserByEmail(
        @Query() data: FindUserByEmailRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByEmailResponse> {
        const end = this.findByEmailDuration.startTimer();
        try {
            if (!data || !data.email) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const payload = await this.userService.findUserByEmail({
                email: data.email,
            });

            if (!payload) {
                return res.status(404).json({ message: 'Resource not Found' });
            }

            this.findByEmailTotal.inc();
            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserByEmail:', e);
            return res.status(500).json({ message: 'Server error' });
        } finally {
            end();
        }
    }

    @Get('findByUsername')
    async findUserName(
        @Query() data: FindUserByUsernameRequest,
        @Res() res: Response,
    ): Promise<Response<FindUserByUsernameResponse>> {
        const end = this.findByUsernameDuration.startTimer();
        try {
            if (!data || !data.username) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const payload = await this.userService.findUserByUsername({
                username: data.username,
            });

            this.findByUsernameTotal.inc();
            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserByUsername:', e);
            return res.status(500).json({ message: 'Server error' });
        } finally {
            end();
        }
    }
}
