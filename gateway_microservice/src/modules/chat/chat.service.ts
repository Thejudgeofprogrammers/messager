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
                    message: 'Ошибка подключения к gRPC-серверу',
                    code: e.code,
                });
            }

            throw new RpcException({
                message: 'Произошла ошибка при создании чата',
                code: 500,
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
                    message: 'Ошибка подключения к gRPC-серверу',
                    code: e.code,
                });
            }

            throw new RpcException({
                message: 'Произошла ошибка при создании чата',
                code: 500,
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
                    message: 'Ошибка подключения к gRPC-серверу',
                    code: e.code,
                });
            }

            throw new RpcException({
                message: 'Произошла ошибка при создании чата',
                code: 500,
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
                    message: 'Ошибка подключения к gRPC-серверу',
                    code: e.code,
                });
            }

            throw new RpcException({
                message: 'Произошла ошибка при создании чата',
                code: 500,
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
                    message: 'Ошибка подключения к gRPC-серверу',
                    code: e.code,
                });
            }

            throw new RpcException({
                message: 'Произошла ошибка при создании чата',
                code: 500,
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
                    message: 'Ошибка подключения к gRPC-серверу',
                    code: e.code,
                });
            }

            throw new RpcException({
                message: 'Произошла ошибка при создании чата',
                code: 500,
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
                    message: 'Ошибка подключения к gRPC-серверу',
                    code: e.code,
                });
            }

            throw new RpcException({
                message: 'Произошла ошибка при создании чата',
                code: 500,
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
                    message: 'Ошибка подключения к gRPC-серверу',
                    code: e.code,
                });
            }

            throw new RpcException({
                message: 'Произошла ошибка при создании чата',
                code: 500,
            });
        }
    }
}
