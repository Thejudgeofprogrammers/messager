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
} from '../../../../protos/proto_gen_files/user';

type ResponseWithoutPassword<T> = Promise<Response<Omit<T, 'passwordHash'>>>;

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('')
    async findUserById(
        @Query() data: FindUserByIdRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByIdResponse> {
        try {
            if (!data) {
                res.json({ message: 'Bad request' }).status(400);
            }

            const payload = this.userService.findUserById({
                userId: data.userId,
            });

            if (!payload) {
                res.json({ message: 'Resource not Found' }).status(404);
            }

            return res.json(payload).status(200);
        } catch (e) {
            res.json({ message: 'Server error' }).status(500);
        }
    }

    @Get('')
    async findUserByTag(
        @Query() data: FindUserByTagRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByTagResponse> {
        try {
            if (!data) {
                res.json({ message: 'Bad request' }).status(400);
            }

            const payload = this.userService.findUserByTag({
                tag: data.tag,
            });

            if (!payload) {
                res.json({ message: 'Resource not Found' }).status(404);
            }

            return res.json(payload).status(200);
        } catch (e) {
            res.json({ message: 'Server error' }).status(500);
        }
    }

    @Get('')
    async findUserByPhone(
        @Query() data: FindUserByPhoneNumberRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByPhoneNumberResponse> {
        try {
            if (!data) {
                res.json({ message: 'Bad request' }).status(400);
            }

            const payload = this.userService.findUserByPhone({
                phoneNumber: data.phoneNumber,
            });

            if (!payload) {
                res.json({ message: 'Resource not Found' }).status(404);
            }

            return res.json(payload).status(200);
        } catch (e) {
            res.json({ message: 'Server error' }).status(500);
        }
    }

    @Get('')
    async findUserByEmail(
        @Query() data: FindUserByEmailRequest,
        @Res() res: Response,
    ): ResponseWithoutPassword<FindUserByEmailResponse> {
        try {
            if (!data) {
                res.json({ message: 'Bad request' }).status(400);
            }

            const payload = this.userService.findUserByEmail({
                email: data.email,
            });

            if (!payload) {
                res.json({ message: 'Resource not Found' }).status(404);
            }

            return res.json(payload).status(200);
        } catch (e) {
            res.json({ message: 'Server error' }).status(500);
        }
    }

    @Get('')
    async findUserName(
        @Query() data: FindUserByUsernameRequest,
        @Res() res: Response,
    ): Promise<Response<FindUserByUsernameResponse>> {
        try {
            if (!data) {
                res.json({ message: 'Bad request' }).status(400);
            }

            const payload = this.userService.findUserByUsername({
                username: data.username,
            });

            if (!payload) {
                res.json({ message: 'Resource not Found' }).status(404);
            }

            return res.json(payload).status(200);
        } catch (e) {
            res.json({ message: 'Server error' }).status(500);
        }
    }
}
