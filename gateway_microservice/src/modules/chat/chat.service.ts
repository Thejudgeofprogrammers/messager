import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import {
    grpcClientOptionsChat,
    grpcClientOptionsUser,
} from 'src/config/grpc/grpc.options';
import {
    AddUserToChatRequest,
    AddUserToChatResponse,
    ChatService as ChatInterface,
    CreateNewChatRequest,
    CreateNewChatResponse,
    DeleteChatByIdRequest,
    DeleteChatByIdResponse,
    GetChatByChatNameRequest,
    GetChatByChatNameResponse,
    GetChatByIdRequest,
    GetChatByIdResponse,
    KickUserFromChatRequest,
    KickUserFromChatResponse,
    LeaveFromChatRequest,
    LeaveFromChatResponse,
    LoadToChatRequest,
    LoadToChatResponse,
    PermissionToMemberRequest,
    PermissionToMemberResponse,
    RemoveUserFromChatRequest,
    RemoveUserFromChatResponse,
    UpdateChatByIdRequest,
    UpdateChatByIdResponse,
} from 'src/protos/proto_gen_files/chat';
import { RpcException } from '@nestjs/microservices';
import { errMessages } from 'src/common/messages';
import { StatusClient } from 'src/common/status';
import { from, lastValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';

import {
    ArrayLinkUsers,
    RemoveArrayChatRequest,
    RemoveArrayChatResponse,
    UserService as UserServiceClient,
} from 'src/protos/proto_gen_files/user';
import { DeleteChatByIdResponseDTO } from './dto';

@Injectable()
export class ChatService implements OnModuleInit {
    @Client(grpcClientOptionsChat)
    private readonly chatClient: ClientGrpc;
    @Client(grpcClientOptionsUser)
    private readonly userClient: ClientGrpc;

    private chatMicroservice: ChatInterface;
    private userMicroservice: UserServiceClient;

    constructor(private readonly userService: UserService) {}

    onModuleInit() {
        this.chatMicroservice =
            this.chatClient.getService<ChatInterface>('ChatService');
        this.userMicroservice =
            this.userClient.getService<UserServiceClient>('UserService');
    }

    async KickUserFromChat(
        payload: KickUserFromChatRequest,
    ): Promise<KickUserFromChatResponse> {
        try {
            if (!payload.chatId || !payload.participantId || !payload.userId) {
                throw new BadRequestException('Не все данные получены');
            }

            const kickUser = await lastValueFrom(
                from(
                    this.chatMicroservice.KickUserFromChat({
                        participantId: payload.participantId,
                        chatId: payload.chatId,
                        userId: payload.userId,
                    }),
                ),
            );

            if (!kickUser) {
                throw new InternalServerErrorException('Ошибка сервера');
            }

            return { message: kickUser.message, status: kickUser.status };
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.loadToChat,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async PermissionToAdmin(
        payload: PermissionToMemberRequest,
    ): Promise<PermissionToMemberResponse> {
        try {
            if (!payload.chatId || !payload.participantId || !payload.userId) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }

            const chatSwithPermission = await lastValueFrom(
                from(
                    this.chatMicroservice.PermissionToAdmin({
                        participantId: payload.participantId,
                        chatId: payload.chatId,
                        userId: payload.userId,
                    }),
                ),
            );

            if (!chatSwithPermission) {
                throw new BadRequestException('Ошибка сервера');
            }

            return {
                message: chatSwithPermission.message,
                status: chatSwithPermission.status,
            };
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.loadToChat,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async PermissionToMember(
        payload: PermissionToMemberRequest,
    ): Promise<PermissionToMemberResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }

            const chatSwithPermission = await lastValueFrom(
                from(
                    this.chatMicroservice.PermissionToMember({
                        participantId: payload.participantId,
                        chatId: payload.chatId,
                        userId: payload.userId,
                    }),
                ),
            );

            if (!chatSwithPermission) {
                throw new BadRequestException('Ошибка сервера');
            }

            return {
                message: chatSwithPermission.message,
                status: chatSwithPermission.status,
            };
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.loadToChat,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async LoadToChat(payload: LoadToChatRequest): Promise<LoadToChatResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const userAdd = await this.userService.AddChatToUser({
                userId: +payload.userId,
                chatId: payload.chatId,
            });

            if (userAdd.info.status !== 200) {
                throw new InternalServerErrorException('Exception on userAdd');
            }

            const chatAdd = await lastValueFrom(
                from(
                    this.chatMicroservice.AddUserToChat({
                        participant: {
                            userId: payload.userId,
                            role: 'member',
                        },
                        chatId: payload.chatId,
                    }),
                ),
            );

            if (!chatAdd) {
                throw new BadRequestException('Ошибка сервера');
            }

            const response = {
                message: chatAdd.response.message,
                status: chatAdd.response.status,
            };

            return { response };
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.loadToChat,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async LeaveFromChat(
        payload: LeaveFromChatRequest,
    ): Promise<LeaveFromChatResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }

            const userAdd = await this.userService.RemoveChatFromUser({
                userId: +payload.userId,
                chatId: payload.chatId,
            });

            if (userAdd.info.status !== 200) {
                throw new InternalServerErrorException('Exception on userAdd');
            }

            const chatAdd = await lastValueFrom(
                from(
                    this.chatMicroservice.RemoveUserFromChat({
                        userId: +payload.userId,
                        chatId: payload.chatId,
                    }),
                ),
            );

            if (!chatAdd.response) {
                throw new InternalServerErrorException('Ошибка сервера');
            }

            const response = {
                message: chatAdd.response.message,
                status: 200,
            };

            return { response };
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.leaveFromChat,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async CreateNewChat(
        payload: CreateNewChatRequest,
    ): Promise<CreateNewChatResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.CreateNewChat({
                        chatName: payload.chatName,
                        chatType: payload.chatType,
                        userId: payload.userId,
                    }),
                ),
            );

            if (!chatInfo) {
                throw new ConflictException(
                    'Unable to create chat, possible data conflict.',
                );
            }

            const addChat = await this.userService.AddChatToUser({
                userId: payload.userId,
                chatId: chatInfo.chatId,
            });

            if (!addChat) {
                throw new InternalServerErrorException(
                    'Ошибка добавления чата пользователю',
                );
            }

            return chatInfo;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.createNewChat,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async GetChatById(
        payload: GetChatByIdRequest,
    ): Promise<GetChatByIdResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const validChatId = payload.toString();
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.GetChatById({
                        chatId: validChatId,
                    }),
                ),
            );
            if (!chatInfo) {
                throw new NotFoundException(errMessages.notFound.chat);
            }
            return chatInfo;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.getChatById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async GetChatByChatName(
        payload: GetChatByChatNameRequest,
    ): Promise<GetChatByChatNameResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.GetChatByChatName({
                        chatName: payload.toString(),
                    }),
                ),
            );

            if (!chatInfo) {
                throw new NotFoundException(errMessages.notFound.chat);
            }

            return chatInfo;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.getChatByChatName,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async UpdateChatById(
        payload: UpdateChatByIdRequest,
    ): Promise<UpdateChatByIdResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            let chatInfo;
            if (
                payload.chatType === 'private' ||
                payload.chatType === 'group'
            ) {
                chatInfo = await lastValueFrom(
                    from(
                        this.chatMicroservice.UpdateChatById({
                            chatId: payload.chatId.toString(),
                            userId: +payload.userId,
                            chatName: payload.chatName.toString(),
                            chatType: payload.chatType.toString(),
                            description: payload.description.toString(),
                        }),
                    ),
                );
            } else if (
                payload.chatType === '' ||
                payload.chatType === undefined
            ) {
                chatInfo = await lastValueFrom(
                    from(
                        this.chatMicroservice.UpdateChatById({
                            chatId: payload.chatId.toString(),
                            userId: +payload.userId,
                            chatName: payload.chatName.toString(),
                            description: payload.description.toString(),
                        }),
                    ),
                );
            } else {
                throw new BadRequestException('private or group');
            }

            if (!chatInfo) {
                throw new NotFoundException(errMessages.notFound.chat);
            }

            return chatInfo;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.updateChatById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async DeleteChatById(
        payload: DeleteChatByIdRequest,
    ): Promise<DeleteChatByIdResponseDTO> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }

            const chatInfoData: DeleteChatByIdRequest = {
                chatId: payload.chatId,
                userId: +payload.userId,
            };

            if (!chatInfoData.chatId || isNaN(payload.userId)) {
                throw new BadRequestException(
                    'Invalid or missing userId in cookies',
                );
            }

            const chatInfo: DeleteChatByIdResponse = await lastValueFrom(
                from(this.chatMicroservice.DeleteChatById(chatInfoData)),
            );

            if (!chatInfo) {
                throw new NotFoundException(errMessages.notFound.chat);
            }

            const arrayUsers: ArrayLinkUsers[] = chatInfo.info.data.map(
                (userId: number) => ({
                    userId,
                }),
            );

            const chatParticipantDelData: RemoveArrayChatRequest = {
                chatId: payload.chatId,
                data: arrayUsers,
            };

            const chatParticipantDel: RemoveArrayChatResponse =
                await lastValueFrom(
                    from(
                        this.userMicroservice.RemoveArrayChat(
                            chatParticipantDelData,
                        ),
                    ),
                );

            if (chatParticipantDel.status !== 200) {
                throw new InternalServerErrorException(
                    'Failed to remove chat references for users',
                );
            }

            const msg = {
                message: chatParticipantDel.message.toString(),
            };

            return msg;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            console.error('Error in DeleteChatById:', e.message, e.stack);

            throw new RpcException({
                message: errMessages.deleteChatById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async AddUserToChat(
        payload: AddUserToChatRequest,
    ): Promise<AddUserToChatResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.AddUserToChat({
                        chatId: payload.chatId,
                        participant: payload.participant,
                    }),
                ),
            );

            if (!chatInfo) {
                throw new NotFoundException(errMessages.notFound.chat);
            }

            return chatInfo;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.addUserToChat,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async RemoveUserFromChat(
        payload: RemoveUserFromChatRequest,
    ): Promise<RemoveUserFromChatResponse> {
        try {
            if (!payload) {
                throw new BadRequestException(
                    StatusClient.HTTP_STATUS_BAD_REQUEST.message,
                );
            }
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.RemoveUserFromChat({
                        chatId: payload.chatId,
                        userId: payload.userId,
                    }),
                ),
            );

            if (!chatInfo) {
                throw new NotFoundException(errMessages.notFound.chat);
            }

            return chatInfo;
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.removeUserFromChat,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }
}
