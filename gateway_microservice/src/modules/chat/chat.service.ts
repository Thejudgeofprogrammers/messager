import { Injectable, OnModuleInit } from '@nestjs/common';
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
    GetAllChatsRequest,
    GetAllChatsResponse,
    GetChatByChatNameRequest,
    GetChatByChatNameResponse,
    GetChatByIdRequest,
    GetChatByIdResponse,
    RemoveUserFromChatRequest,
    RemoveUserFromChatResponse,
    UpdateChatByIdRequest,
    UpdateChatByIdResponse,
} from 'src/protos/proto_gen_files/chat';
import { RpcException } from '@nestjs/microservices';
import { errMessages } from 'src/common/messages';
import { StatusClient } from 'src/common/status';

@Injectable()
export class ChatService implements ChatInterface, OnModuleInit {
    @Client(grpcClientOptionsChat)
    private readonly chatClient: ClientGrpc;

    private chatMicroservice: ChatInterface;

    onModuleInit() {
        this.chatMicroservice =
            this.chatClient.getService<ChatInterface>('ChatService');
    }

    async CreateNewChat(
        payload: CreateNewChatRequest,
    ): Promise<CreateNewChatResponse> {
        try {
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
        payload: GetChatByIdRequest
    ): Promise<GetChatByIdResponse> {
        try {

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
        payload: GetChatByChatNameRequest
    ): Promise<GetChatByChatNameResponse> {
        try {
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
        payload: UpdateChatByIdRequest
    ): Promise<UpdateChatByIdResponse> {
        try {
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
        payload: DeleteChatByIdRequest
    ): Promise<DeleteChatByIdResponse> {
        try {
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

    async GetAllChats(
        payload: GetAllChatsRequest
    ): Promise<GetAllChatsResponse> {
        try {
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.getAllChats,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    async AddUserToChat(
        payload: AddUserToChatRequest
    ): Promise<AddUserToChatResponse> {
        try {
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
        payload: RemoveUserFromChatRequest
    ): Promise<RemoveUserFromChatResponse> {
        try {
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
