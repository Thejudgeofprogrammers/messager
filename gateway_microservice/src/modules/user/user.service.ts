import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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
    FindUserByTagRequest,
    FindUserByUsernameResponse,
    FindUserByTagResponse,
    UserData,
} from 'src/protos/proto_gen_files/user';
import { grpcClientOptionsUser } from 'src/config/grpc/grpc.options';
import { StatusClient } from 'src/common/status';
import { errMessages } from 'src/common/messages';

@Injectable()
export class UserService implements OnModuleInit {
    @Client(grpcClientOptionsUser)
    private readonly userClient: ClientGrpc;

    private userMicroservice: UserServiceClient;

    onModuleInit() {
        this.userMicroservice =
            this.userClient.getService<UserServiceClient>('UserService');
    }

    validateUser(payload: UserData): any {
        const validateUser = {
            userId: payload.userId,
            email: payload.email,
            username: payload.username,
            phoneNumber: payload.phoneNumber,
            tag: payload.tag,
        };
        return validateUser;
    }

    async findUserById(
        payload: FindUserByIdRequest,
    ): Promise<Omit<FindUserByIdResponse, 'passwordHash'>> {
        try {
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
                message: errMessages.findUserById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async findUserByTag(
        payload: FindUserByTagRequest,
    ): Promise<Omit<FindUserByTagResponse, 'passwordHash'>> {
        try {
            const userInfo = await lastValueFrom(
                from(this.userMicroservice.FindUserByTag({ tag: payload.tag })),
            );

            if (!userInfo.userData) {
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
                message: errMessages.findByTag,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async findUserByPhone(
        payload: FindUserByPhoneNumberRequest,
    ): Promise<Omit<FindUserByPhoneNumberResponse, 'userData.passwordHash'>> {
        try {
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

    async findUserByEmail(
        payload: FindUserByEmailRequest,
    ): Promise<Omit<FindUserByEmailResponse, 'passwordHash'>> {
        try {
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

    async findUserByUsername(
        payload: FindUserByUsernameRequest,
    ): Promise<FindUserByUsernameResponse> {
        try {
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
