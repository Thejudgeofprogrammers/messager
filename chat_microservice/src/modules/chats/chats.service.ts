import {
    Controller,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/Chat';
import { Model } from 'mongoose';
import { GrpcMethod } from '@nestjs/microservices';
import {
    CreateNewChatRequest,
    CreateNewChatResponse,
} from '../../protos/proto_gen_files/chat';

@Controller('ChatService')
export class ChatService {
    private readonly logger = new Logger(ChatService.name);

    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    ) {}

    @GrpcMethod('ChatService', 'CreateNewChat')
    async CreateNewChat(
        payload: CreateNewChatRequest,
    ): Promise<CreateNewChatResponse> {
        try {
            const { chatName, chatType, userId } = payload;
            const newChat: Chat = {};
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при создании чата',
            );
        }
    }

    @GrpcMethod('ChatService', 'GetChatById')
    async GetChatById() {
        try {
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при поиске чата по Id',
            );
        }
    }

    @GrpcMethod('ChatService', 'GetChatByChatName')
    async GetChatByChatName() {
        try {
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при поиске чата по Имени',
            );
        }
    }

    @GrpcMethod('ChatService', 'UpdateChatById')
    async UpdateChatById() {
        try {
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при обновлении чата',
            );
        }
    }

    @GrpcMethod('ChatService', 'DeleteChatById')
    async DeleteChatById() {
        try {
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при удалении чата',
            );
        }
    }

    @GrpcMethod('ChatService', 'GetAllChats')
    async GetAllChats() {
        try {
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка поиске чатов пользователя',
            );
        }
    }

    @GrpcMethod('ChatService', 'AddUserToChat')
    async AddUserToChat() {
        try {
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при добавлении пользователя в чат',
            );
        }
    }

    @GrpcMethod('ChatService', 'RemoveUserFromChat')
    async RemoveUserFromChat() {
        try {
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при удалении пользователя из чата',
            );
        }
    }
}
