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
} from '../../../protos/proto_gen_files/user';

type ResponseWithoutPassword<T> = Promise<Response<Omit<T, 'passwordHash'>>>;

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('findById')
    async findUserById(
        @Query() data: FindUserByIdRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByIdResponse> {
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

            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserById:', e);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    @Get('findByTag')
    async findUserByTag(
        @Query() data: FindUserByTagRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByTagResponse> {
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

            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserByTag:', e);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    @Get('findByPhone')
    async findUserByPhone(
        @Query() data: FindUserByPhoneNumberRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByPhoneNumberResponse> {
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

            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserByPhone:', e);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    @Get('findByEmail')
    async findUserByEmail(
        @Query() data: FindUserByEmailRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByEmailResponse> {
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

            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserByEmail:', e);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    @Get('findByUsername')
    async findUserName(
        @Query() data: FindUserByUsernameRequest,
        @Res() res: Response,
    ): Promise<Response<FindUserByUsernameResponse>> {
        try {
            if (!data || !data.username) {
                return res.status(400).json({ message: 'Bad request' });
            }

            const payload = await this.userService.findUserByUsername({
                username: data.username,
            });

            return res.status(200).json(payload);
        } catch (e) {
            console.error('Error in findUserByUsername:', e);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}
