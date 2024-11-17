import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { Client, ClientGrpc, RpcException } from '@nestjs/microservices';
import { from, lastValueFrom } from 'rxjs';
import {
    UserService as UserServiceClient,
    FindUserByIdRequest,
    FindUserByIdResponse,
    FindUserByEmailRequest,
    FindUserByEmailResponse,
    FindUserByPhoneNumberRequest,
    FindUserByPhoneNumberResponse,
    FindUserByUsernameRequest,
    FindUserByUsernameResponse,
    AddChatToUserRequest,
    AddChatToUserResponse,
    RemoveChatFromUserRequest,
    RemoveChatFromUserResponse,
    UserDataId,
    UserData,
    RemoveAccountRequest,
    RemoveAccountResponse,
    GetPasswordUserRequest,
    GetPasswordUserResponse,
} from 'src/protos/proto_gen_files/user';
import { grpcClientOptionsUser } from 'src/config/grpc/grpc.options';
import { StatusClient } from 'src/common/status';
import { errMessages } from 'src/common/messages';

// type UserServiceType = Omit<UserServiceClient, 'CreateNewUser'>;

@Injectable()
export class UserService implements OnModuleInit {
    @Client(grpcClientOptionsUser)
    private readonly userClient: ClientGrpc;

    private userMicroservice: UserServiceClient;

    onModuleInit() {
        this.userMicroservice =
            this.userClient.getService<UserServiceClient>('UserService');
    }

    validateUserIds(payload: UserDataId): any {
        const validateUser = {
            userId: payload.userId,
            email: payload.email,
            username: payload.username,
            phoneNumber: payload.phoneNumber,
            chatReferences: payload.chatReferences,
        };
        return validateUser;
    }

    validateUser(payload: UserData): any {
        const validateUser = {
            userId: payload.userId,
            email: payload.email,
            username: payload.username,
            phoneNumber: payload.phoneNumber,
        };
        return validateUser;
    }

    async RemoveAccount(
        payload: RemoveAccountRequest,
    ): Promise<RemoveAccountResponse> {
        try {
            const delUser = await lastValueFrom(
                from(
                    this.userMicroservice.RemoveAccount({
                        userId: payload.userId,
                    }),
                ),
            );

            if (!delUser.message) {
                throw new InternalServerErrorException('Ошибка сервера');
            }

            return { message: delUser.message };
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.findUserById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async GetPasswordUser(
        payload: GetPasswordUserRequest,
    ): Promise<GetPasswordUserResponse> {
        try {
            if (!payload.userId) {
                throw new BadRequestException('without userId');
            }

            const userPassword = await lastValueFrom(
                from(
                    this.userMicroservice.GetPasswordUser({
                        userId: payload.userId,
                    }),
                ),
            );

            if (!userPassword) {
                throw new NotFoundException('Password without');
            }

            return { hashedPassword: userPassword.hashedPassword };
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.findUserById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async AddChatToUser(
        payload: AddChatToUserRequest,
    ): Promise<AddChatToUserResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const addChat = await lastValueFrom(
                from(
                    this.userMicroservice.AddChatToUser({
                        chatId: payload.chatId,
                        userId: payload.userId,
                    }),
                ),
            );

            if (!addChat) {
                throw new NotFoundException(errMessages.notFound.user);
            }

            return addChat;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.findUserById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async RemoveChatFromUser(
        payload: RemoveChatFromUserRequest,
    ): Promise<RemoveChatFromUserResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }

            const addChat = await lastValueFrom(
                from(
                    this.userMicroservice.RemoveChatFromUser({
                        chatId: payload.chatId,
                        userId: payload.userId,
                    }),
                ),
            );

            if (!addChat) {
                throw new NotFoundException(errMessages.notFound.user);
            }

            return addChat;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.findUserById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async FindUserById(
        payload: FindUserByIdRequest,
    ): Promise<Omit<FindUserByIdResponse, 'passwordHash'>> {
        try {
            console.log(payload);
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const userInfo = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserById({
                        userId: payload.userId,
                    }),
                ),
            );

            if (!userInfo.userData) {
                throw new NotFoundException(errMessages.notFound.user);
            }

            const userWithoutPassword = this.validateUserIds(userInfo.userData);

            return userWithoutPassword;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.findUserById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async FindUserByPhoneNumber(
        payload: FindUserByPhoneNumberRequest,
    ): Promise<Omit<FindUserByPhoneNumberResponse, 'userData.passwordHash'>> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const userInfo = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserByPhoneNumber({
                        phoneNumber: payload.phoneNumber,
                    }),
                ),
            );

            if (!userInfo) {
                throw new NotFoundException(errMessages.notFound.user);
            }

            const userWithoutPassword = this.validateUser(userInfo.userData);

            return { userData: userWithoutPassword };
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.findByPhone,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async FindUserByEmail(
        payload: FindUserByEmailRequest,
    ): Promise<Omit<FindUserByEmailResponse, 'passwordHash'>> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const userInfo = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserByEmail({
                        email: payload.email,
                    }),
                ),
            );

            if (!userInfo) {
                throw new NotFoundException(errMessages.notFound.user);
            }

            const userWithoutPassword = this.validateUser(userInfo.userData);

            return userWithoutPassword;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.findByEmail,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async FindUserByUsername(
        payload: FindUserByUsernameRequest,
    ): Promise<FindUserByUsernameResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const userInfo = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserByUsername({
                        username: payload.username,
                    }),
                ),
            );

            if (!userInfo) {
                throw new NotFoundException(errMessages.notFound.user);
            }

            return userInfo;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.findByUsername,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }
}
