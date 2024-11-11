import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { grpcClientOptionsChat } from 'src/config/grpc/grpc.options';
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
    LeaveFromChatRequest,
    LeaveFromChatResponse,
    LoadToChatRequest,
    LoadToChatResponse,
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

@Injectable()
export class ChatService implements ChatInterface, OnModuleInit {
    @Client(grpcClientOptionsChat)
    private readonly chatClient: ClientGrpc;

    private chatMicroservice: ChatInterface;

    constructor(private readonly userService: UserService) {}

    onModuleInit() {
        this.chatMicroservice =
            this.chatClient.getService<ChatInterface>('ChatService');
    }

    async LoadToChat(payload: LoadToChatRequest): Promise<LoadToChatResponse> {
        try {
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
                message: errMessages.loadToChat,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async LeaveFromChat(
        payload: LeaveFromChatRequest,
    ): Promise<LeaveFromChatResponse> {
        try {
            const userAdd = await this.userService.AddChatToUser({
                userId: +payload.userId,
                chatId: payload.chatId,
            });

            if (userAdd.info.status !== 200) {
                throw new InternalServerErrorException('Exception on userAdd');
            }

            const chatAdd = await lastValueFrom(
                from(
                    this.chatMicroservice.LeaveFromChat({
                        userId: payload.userId,
                        chatId: payload.chatId,
                    }),
                ),
            );
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
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.CreateNewChat({
                        chatName: payload.chatName,
                        chatType: payload.chatType,
                        userId: payload.userId,
                    }),
                ),
            );

            if (chatInfo) {
                throw new ConflictException(
                    'Unable to create chat, possible data conflict.',
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
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.GetChatById({
                        chatId: payload.chatId,
                    }),
                ),
            );

            if (chatInfo) {
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
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.GetChatByChatName({
                        chatName: payload.chatName,
                    }),
                ),
            );

            if (chatInfo) {
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
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.UpdateChatById({
                        chatId: payload.chatId,
                        chatName: payload.chatName,
                        chatType: payload.chatType,
                        description: payload.description,
                    }),
                ),
            );

            if (chatInfo) {
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
    ): Promise<DeleteChatByIdResponse> {
        try {
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.DeleteChatById({
                        chatId: payload.chatId,
                    }),
                ),
            );

            if (chatInfo) {
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
                message: errMessages.deleteChatById,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async AddUserToChat(
        payload: AddUserToChatRequest,
    ): Promise<AddUserToChatResponse> {
        try {
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.AddUserToChat({
                        chatId: payload.chatId,
                        participant: payload.participant,
                    }),
                ),
            );

            if (chatInfo) {
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
            const chatInfo = await lastValueFrom(
                from(
                    this.chatMicroservice.RemoveUserFromChat({
                        chatId: payload.chatId,
                        userId: payload.userId,
                    }),
                ),
            );

            if (chatInfo) {
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
