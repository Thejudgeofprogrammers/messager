import { Controller, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
    UserService as UserInterfase,
    FindUserByIdRequest,
    FindUserByIdResponse,
    FindUserByEmailRequest,
    FindUserByEmailResponse,
    FindUserByPhoneNumberRequest,
    FindUserByPhoneNumberResponse,
    FindUserByUsernameRequest,
    FindUserByTagRequest,
    FindUserByUsernameResponse,
    FindUserByTagResponse,
    CreateNewUserRequest,
    CreateNewUserResponse,
    RemoveChatFromUserRequest,
    RemoveChatFromUserResponse,
    AddChatToUserResponse,
    AddChatToUserRequest,
} from '../../protos/proto_gen_files/user';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Controller('UserService')
export class UserService implements UserInterfase {
    constructor(
        private readonly prismaService: PrismaService,

        @InjectMetric('PROM_METRIC_USER_CREATE_TOTAL')
        private readonly createUserTotal: Counter<string>,
        @InjectMetric('PROM_METRIC_USER_CREATE_DURATION')
        private readonly createUserDuration: Histogram<string>,

        @InjectMetric('PROM_METRIC_USER_FIND_TOTAL')
        private readonly findUserTotal: Counter<string>,
        @InjectMetric('PROM_METRIC_USER_FIND_DURATION')
        private readonly findUserDuration: Histogram<string>,
    ) {}

    @GrpcMethod('UserService', 'AddChatToUser')
    async AddChatToUser(
        payload: AddChatToUserRequest,
    ): Promise<AddChatToUserResponse> {
        try {
            if (!payload.userId || !payload.chatId) {
                throw new InternalServerErrorException(
                    'All fields are required',
                );
            }
            const existUser = await this.prismaService.user.findUnique({
                where: { user_id: +payload.userId },
            });

            if (!existUser) {
                throw new InternalServerErrorException('User not found');
            }
            await this.prismaService.user.update({
                where: { user_id: +payload.userId },
                data: {
                    chatReferences: {
                        push: payload.chatId,
                    },
                },
            });

            return { info: { message: 'Чат Добавлен', status: 200 } };
        } catch (e) {
            console.error('Error AddChatToUser:', e);
            throw new InternalServerErrorException(
                'Server encountered an issue',
            );
        }
    }

    @GrpcMethod('UserService', 'RemoveChatFromUser')
    async RemoveChatFromUser(
        payload: RemoveChatFromUserRequest,
    ): Promise<RemoveChatFromUserResponse> {
        try {
            if (!payload.userId || !payload.chatId) {
                throw new InternalServerErrorException(
                    'All fields are required',
                );
            }

            const user = await this.prismaService.user.findUnique({
                where: { user_id: +payload.userId },
            });

            if (!user) {
                throw new InternalServerErrorException('User not found');
            }

            await this.prismaService.user.update({
                where: { user_id: +payload.userId },
                data: {
                    chatReferences: {
                        set: user.chatReferences.filter(
                            (id) => id !== payload.chatId,
                        ),
                    },
                },
            });

            return {
                info: { message: 'Пользователь покинул чат', status: 200 },
            };
        } catch (e) {
            console.error('Error RemoveChatFromUser:', e);
            throw new InternalServerErrorException(
                'Server encountered an issue',
            );
        }
    }

    @GrpcMethod('UserService', 'CreateNewUser')
    async CreateNewUser(
        request: CreateNewUserRequest,
    ): Promise<CreateNewUserResponse> {
        const end = this.createUserDuration.startTimer();
        try {
            if (
                !request.username ||
                !request.email ||
                !request.phoneNumber ||
                !request.passwordHash
            ) {
                throw new InternalServerErrorException(
                    'All fields are required',
                );
            }

            const existingUserByEmail =
                await this.prismaService.findUserByEmail(request.email);

            if (existingUserByEmail) {
                throw new InternalServerErrorException('Email already in use');
            }

            const existingUserByPhone =
                await this.prismaService.findUserByPhone(request.phoneNumber);

            if (existingUserByPhone) {
                throw new InternalServerErrorException(
                    'Phone number already in use',
                );
            }

            const newUser = await this.prismaService.createUser(request);

            if (!newUser) {
                throw new InternalServerErrorException('User is not created');
            }

            this.createUserTotal.inc();
            return { info: { message: 'User created', status: 201 } };
        } catch (e) {
            console.error('Error in CreateNewUser:', e);
            throw new InternalServerErrorException(
                'Server encountered an issue',
            );
        } finally {
            end();
        }
    }

    @GrpcMethod('UserService', 'FindUserById')
    async FindUserById(
        request: FindUserByIdRequest,
    ): Promise<FindUserByIdResponse> {
        const end = this.findUserDuration.startTimer();
        try {
            const { userId } = request;
            const existUser = await this.prismaService.findUserById(userId);

            if (!existUser) {
                return {
                    notFound: {
                        message: 'User not found',
                        status: 404,
                    },
                };
            }

            return {
                userData: {
                    userId: existUser.user_id,
                    phoneNumber: existUser.phone_number,
                    email: existUser.email,
                    tag: existUser.tag,
                    passwordHash: existUser.password_hash,
                    username: existUser.username,
                    chatReferences: existUser.chatReferences,
                },
            };
        } catch (e) {
            console.error('Error in CreateNewUser:', e);
            throw new InternalServerErrorException(
                'Server encountered an issue',
            );
        } finally {
            end();
        }
    }

    @GrpcMethod('UserService', 'FindUserByUsername')
    async FindUserByUsername(
        request: FindUserByUsernameRequest,
    ): Promise<FindUserByUsernameResponse> {
        const end = this.findUserDuration.startTimer();
        try {
            const { username } = request;
            const existUsers =
                await this.prismaService.findUserByUsername(username);

            this.findUserTotal.inc();
            return {
                users: existUsers
                    ? existUsers.map((user) => ({
                          userId: user.user_id,
                          username: user.username,
                      }))
                    : [],
            };
        } catch (e) {
            console.error('Error in FindUserByUsername:', e);
            throw new InternalServerErrorException(
                'Server encountered an issue',
            );
        } finally {
            end();
        }
    }

    @GrpcMethod('UserService', 'FindUserByTag')
    async FindUserByTag(
        request: FindUserByTagRequest,
    ): Promise<FindUserByTagResponse> {
        const end = this.findUserDuration.startTimer();
        try {
            const { tag } = request;
            const existUser = await this.prismaService.findUserByTag(tag);

            if (!existUser) {
                return {
                    notFound: {
                        message: 'User not found',
                        status: 404,
                    },
                };
            }

            return {
                userData: {
                    userId: existUser.user_id,
                    phoneNumber: existUser.phone_number,
                    email: existUser.email,
                    tag: existUser.tag,
                    passwordHash: existUser.password_hash,
                    username: existUser.username,
                },
            };
        } catch (e) {
            console.error('Error in FindUserByEmail:', e);
            throw new InternalServerErrorException('Server error occurred');
        } finally {
            end();
        }
    }

    @GrpcMethod('UserService', 'FindUserByEmail')
    async FindUserByEmail(
        request: FindUserByEmailRequest,
    ): Promise<FindUserByEmailResponse> {
        const end = this.findUserDuration.startTimer();
        try {
            const { email } = request;
            const existUser = await this.prismaService.findUserByEmail(email);

            if (!existUser) {
                return {
                    notFound: {
                        message: 'User not found',
                        status: 404,
                    },
                };
            }

            this.findUserTotal.inc();

            return {
                userData: {
                    userId: existUser.user_id,
                    phoneNumber: existUser.phone_number,
                    email: existUser.email,
                    tag: existUser.tag,
                    passwordHash: existUser.password_hash,
                    username: existUser.username,
                },
            };
        } catch (e) {
            console.error('Error in FindUserByEmail:', e);
            throw new InternalServerErrorException('Server error occurred');
        } finally {
            end();
        }
    }

    @GrpcMethod('UserService', 'FindUserByPhoneNumber')
    async FindUserByPhoneNumber(
        request: FindUserByPhoneNumberRequest,
    ): Promise<FindUserByPhoneNumberResponse> {
        const end = this.findUserDuration.startTimer();
        try {
            const { phoneNumber } = request;
            const existUser =
                await this.prismaService.findUserByPhone(phoneNumber);

            if (!existUser) {
                return {
                    notFound: {
                        message: 'User not found',
                        status: 404,
                    },
                };
            }

            this.findUserTotal.inc();
            return {
                userData: {
                    userId: existUser.user_id,
                    phoneNumber: existUser.phone_number,
                    email: existUser.email,
                    tag: existUser.tag,
                    passwordHash: existUser.password_hash,
                    username: existUser.username,
                },
            };
        } catch (e) {
            console.error('Error in FindUserByEmail:', e);
            throw new InternalServerErrorException('Server error occurred');
        } finally {
            end();
        }
    }
}
